from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
import numpy as np
from rapidfuzz import process, fuzz
from fastapi.responses import JSONResponse

app = FastAPI()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data
try:
    df = pd.read_csv(
        "/Users/miroj/Desktop/final_year_project/models/cleaned_datae.csv", encoding="utf-8")

    collab_df = pd.read_csv(
        "/Users/miroj/Desktop/final_year_project/models/collab_filter.csv", encoding="utf-8")

except Exception as e:
    print(f"Error loading data: {e}")
    df = pd.DataFrame()  # Fallback to an empty DataFrame


def clean_df(df):
    df = df.fillna('')  # Replace NaN with empty strings
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.dropna(inplace=True)
    return df


@app.get("/")
def home():
    return {"status": "working"}


@app.get("/trendings")
def getTrendingProducts():
    if df.empty:
        return JSONResponse(content={"error": "Data not available"}, status_code=500)

    try:
        average_ratings = df.groupby(['Name', 'ReviewCount', 'Brand', 'ImageURL', 'Price', 'ProdID'])[
            'Rating'].mean().reset_index()
        average_ratings['WeightedScore'] = (
            average_ratings['Rating'] * 0.94) + (np.log1p(average_ratings['ReviewCount']) * 0.06)
        top_rated_items = average_ratings.sort_values(
            by='WeightedScore', ascending=False)
        rating_base_recommendation = top_rated_items.head(12)
        result = rating_base_recommendation.to_dict(orient='records')
        return JSONResponse(content=result)
    except Exception as e:
        print(f"Error processing trendings: {e}")
        return JSONResponse(content={"error": "Internal Server Error"}, status_code=500)


def collaborative_filtering_recommendations(df, target_user_id, top_n):
    # Create the user-item matrix
    user_item_matrix = df.pivot_table(
        index='userID', columns='ProdID', values='Rating', aggfunc='mean').fillna(0)

    # Check if target user exists
    if target_user_id not in user_item_matrix.index:
        raise ValueError(
            f"Target user {target_user_id} not found in the matrix.")

    # Compute user similarity
    user_similarity = cosine_similarity(user_item_matrix)
    user_similarity_df = pd.DataFrame(
        user_similarity, index=user_item_matrix.index, columns=user_item_matrix.index)

    # Get the target user's similarity scores
    similar_users = user_similarity_df[target_user_id].sort_values(
        ascending=False)

    # Weighted scoring for recommendations
    item_scores = {}
    for similar_user_id, similarity_score in similar_users.items():  # Use `.items()` instead of `.iteritems()`
        if similar_user_id == target_user_id:
            continue  # Skip the target user itself

        similar_user_ratings = user_item_matrix.loc[similar_user_id]
        not_rated_by_target_user = (similar_user_ratings > 0) & (
            user_item_matrix.loc[target_user_id] == 0)

        for prod_id in similar_user_ratings[not_rated_by_target_user].index:
            if prod_id not in item_scores:
                item_scores[prod_id] = 0
            item_scores[prod_id] += similar_user_ratings[prod_id] * \
                similarity_score

    # Sort and get top N items
    sorted_item_scores = sorted(
        item_scores.items(), key=lambda x: x[1], reverse=True)
    top_items = [prod_id for prod_id, score in sorted_item_scores[:top_n]]

    # Retrieve item details
    recommended_items_details = df[df['ProdID'].isin(top_items)].drop_duplicates(subset=['ProdID'])[
        ['Name', 'ReviewCount', 'Brand', 'ImageURL', 'Rating', 'Price', 'ProdID']]

    return recommended_items_details.head(top_n)


def content_based_recommendations(df, user_id, search_term, top_n):
    if df.empty:
        return pd.DataFrame()

    # Normalize and clean the search term
    df['Name_normalized'] = df['Name'].str.lower().str.strip()
    search_term_normalized = search_term.lower().strip()
    print(f"Normalized search term: '{search_term_normalized}'")

    # Perform fuzzy matching to find the closest item
    matched_item = process.extractOne(
        search_term_normalized, df['Name_normalized'], scorer=fuzz.partial_ratio)
    print(f"Fuzzy match result: {matched_item}")

    # Ensure the matched item meets a threshold
    if matched_item is None or matched_item[1] < 30:
        print(f"No good match found for '{search_term}'.")
        return pd.DataFrame()

    best_match = matched_item[0]
    item_index = df[df['Name_normalized'] == best_match].index
    if item_index.empty:
        print(f"Index not found for '{best_match}'")
        return pd.DataFrame()
    item_index = item_index[0]

    # Combine content fields for TF-IDF vectorization
    df['Combined'] = df['Tags'].fillna('') + " " + df['Description'].fillna('')
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix_content = tfidf_vectorizer.fit_transform(df['Combined'])
    print("TF-IDF matrix shape:", tfidf_matrix_content.shape)

    # Compute cosine similarity between the target item and all others
    cosine_similarities = cosine_similarity(
        tfidf_matrix_content[item_index], tfidf_matrix_content).flatten()

    # Get the top N most similar items
    similar_indices = cosine_similarities.argsort(
    )[::-1][1:top_n + 1]  # Exclude the target item itself
    similar_scores = cosine_similarities[similar_indices]

    # Retrieve recommended items
    recommended_items_details = df.iloc[similar_indices][[
        'Name', 'ReviewCount', 'Brand', 'ImageURL', 'Rating', 'Price', 'ProdID']]
    recommended_items_details['Similarity'] = similar_scores

    # Incorporate user preferences (e.g., based on past ratings)
    # Example: Assume you have a `user_ratings` dataframe containing user-item ratings
    user_ratings = df[df['userID'] == user_id][['ProdID', 'Rating']]

    # Add user ratings to the recommendations if available
    recommended_items_details['User_Rating'] = recommended_items_details['ProdID'].apply(
        lambda x: user_ratings[user_ratings['ProdID'] == x]['Rating'].max()
        if not user_ratings[user_ratings['ProdID'] == x].empty else 0
    )

    # Sort by user rating and similarity
    recommended_items_details = recommended_items_details.sort_values(
        by=['User_Rating', 'Similarity'], ascending=[False, False])

    return recommended_items_details.head(top_n)


@app.get("/search")
def search(search_term: str, target_user_id: int, top_n: int = Query()):
    print(top_n)
    if df.empty:
        return JSONResponse(content={"error": "Data not available"}, status_code=500)

    try:
        # Get content-based recommendations
        content_based_rec = content_based_recommendations(
            collab_df, target_user_id, search_term, top_n)
        # Assign weight to content-based recommendations
        content_based_rec["Weight"] = 0.7

        # Get collaborative filtering recommendations
        collaborative_filtering_rec = collaborative_filtering_recommendations(
            collab_df, target_user_id, top_n)
        # Assign weight to collaborative recommendations
        collaborative_filtering_rec["Weight"] = 0.3

        # Combine recommendations
        combined_rec = pd.concat(
            [content_based_rec, collaborative_filtering_rec])

        # Calculate weighted score
        combined_rec["Weighted_Score"] = (
            combined_rec["Rating"] * combined_rec["Weight"]
        )

        # Sort recommendations by Weighted_Score in descending order
        combined_rec = combined_rec.sort_values(
            by="Weighted_Score", ascending=False
        ).drop_duplicates(subset="ProdID")  # Ensure no duplicate items

        # Clean and limit results to top 20
        cleaned_data = clean_df(combined_rec)
        cleaned_data = cleaned_data.head(20)

        result = cleaned_data.to_dict(orient="records")
        return JSONResponse(content=result)

    except Exception as e:
        print(f"Error processing search: {e}")
        return JSONResponse(content={"error": "Internal Server Error"}, status_code=500)
