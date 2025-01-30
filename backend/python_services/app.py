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

    # Remove duplicate products based on 'product_id'
    df = df.drop_duplicates(subset="ProdID", keep="first")

    return df


@app.get("/")
def home():
    return {"status": "working"}


@app.get("/trendings")
def getTrendingProducts():
    if df.empty:
        return JSONResponse(content={"error": "Data not available"}, status_code=500)

    try:
        average_ratings = collab_df.groupby(['Name', 'ReviewCount', 'Brand', 'ImageURL', 'Price', 'ProdID', 'Category', 'Description', "Tags", "CProdId"])[
            'Rating'].mean().reset_index()
        average_ratings['WeightedScore'] = (
            average_ratings['Rating'] * 0.94) + (np.log1p(average_ratings['ReviewCount']) * 0.06)
        top_rated_items = average_ratings.sort_values(
            by='WeightedScore', ascending=False)
        rating_base_recommendation = top_rated_items.head(16)
        result = rating_base_recommendation.to_dict(orient='records')
        return JSONResponse(content=result)
    except Exception as e:
        print(f"Error processing trendings: {e}")
        return JSONResponse(content={"error": "Internal Server Error"}, status_code=500)


def collaborative_filtering_recommendations(df, target_user_id, top_n, k=25):
    # Create the user-item matrix
    user_item_matrix = df.pivot_table(
        index='userID', columns='CProdId', values='Rating', aggfunc='mean').fillna(0)

    # Check if target user exists
    if target_user_id not in user_item_matrix.index:
        print(f"Target user {target_user_id} not found in the matrix.")
        return pd.DataFrame()  # Return an empty DataFrame if the user is not found

    # Fit the KNN model
    knn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=k+1)
    knn.fit(user_item_matrix)

    # Get the target user's index
    target_user_index = user_item_matrix.index.get_loc(target_user_id)

    # Find the nearest neighbors
    distances, indices = knn.kneighbors(
        user_item_matrix.iloc[target_user_index].values.reshape(1, -1), n_neighbors=k+1)

    # Get the neighbor user IDs (excluding the target user itself)
    neighbor_indices = indices.flatten()[1:]
    neighbor_distances = distances.flatten()[1:]
    neighbor_user_ids = user_item_matrix.index[neighbor_indices]

    # Aggregate ratings from neighbors
    item_scores = {}
    for neighbor_id, distance in zip(neighbor_user_ids, neighbor_distances):
        neighbor_ratings = user_item_matrix.loc[neighbor_id]
        for prod_id, rating in neighbor_ratings[neighbor_ratings > 0].items():
            if prod_id not in item_scores:
                item_scores[prod_id] = 0
            item_scores[prod_id] += rating / (1 + distance)  # Weighted scoring

    # Filter out products that have never been rated before
    item_scores = {prod_id: score for prod_id, score in item_scores.items(
    ) if df[df['CProdId'] == prod_id]['Rating'].sum() > 0}

    # Sort and get top N items
    sorted_item_scores = sorted(
        item_scores.items(), key=lambda x: x[1], reverse=True)
    top_items = [prod_id for prod_id, score in sorted_item_scores[:top_n]]

    # Retrieve item details
    recommended_items_details = df[df['CProdId'].isin(top_items)].drop_duplicates(subset=['CProdId'])[
        ['Name', 'ReviewCount', 'Brand', 'ImageURL', 'Rating', 'Price', 'ProdID']]

    return recommended_items_details.head(top_n)


def content_based_recommendations(df, user_id, search_term, top_n):
    if df.empty:
        return pd.DataFrame()

    # Normalize and clean the search term
    df['Name_normalized'] = df['Name'].str.lower().str.strip()
    search_term_normalized = search_term.lower().strip()
    print(f"Normalized search term: '{search_term_normalized}'")

    # Check for an exact match first
    exact_match = df[df['Name_normalized'] == search_term_normalized]
    if not exact_match.empty:
        item_index = exact_match.index[0]
        print(
            f"Exact match found for '{search_term}': {df.loc[item_index, 'Name']}")
    else:
        # Perform fuzzy matching if no exact match is found
        matched_item = process.extractOne(
            search_term_normalized, df['Name_normalized'], scorer=fuzz.partial_ratio)
        print(f"Fuzzy match result: {matched_item}")

        # Ensure the matched item meets a threshold
        if matched_item is None or matched_item[1] < 30:
            print(f"No good match found for '{search_term}'.")
            return pd.DataFrame()

        best_match = matched_item[0]
        print("best match: " + best_match)
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
    similar_indices = cosine_similarities.argsort()[::-1][:top_n]
    similar_scores = cosine_similarities[similar_indices]

    # Retrieve recommended items
    recommended_items_details = df.iloc[similar_indices][[
        'Name', 'ReviewCount', 'Brand', 'ImageURL', 'Rating', 'Price', 'ProdID', 'CProdId']]
    recommended_items_details['Similarity'] = similar_scores

    # Check if user_id exists in the dataframe
    if user_id in df['userID'].values:
        print(
            f"User ID {user_id} found in the dataset. Incorporating user ratings.")

        # Assume you have a `user_ratings` dataframe containing user-item ratings
        user_ratings = df[df['userID'] == user_id][['CProdId', 'Rating']]

        # Add user ratings to the recommendations
        recommended_items_details['User_Rating'] = recommended_items_details['CProdId'].apply(
            lambda x: user_ratings[user_ratings['CProdId']
                                   == x]['Rating'].max()
            if not user_ratings[user_ratings['CProdId'] == x].empty else 0
        )

        # Sort by user rating and similarity
        recommended_items_details = recommended_items_details.sort_values(
            by=['Similarity', 'User_Rating'], ascending=[False, False]
        )
    else:
        print(
            f"User ID {user_id} not found. Providing content-based recommendations only.")
        # Add a default column for user ratings as 0
        recommended_items_details['User_Rating'] = 0

        # Sort by similarity only
        recommended_items_details = recommended_items_details.sort_values(
            by=['Similarity'], ascending=False
        )

    return recommended_items_details.head(top_n)


def content_based_recommendations_by_prodid(df, product_id, top_n, user_id):
    if df.empty:
        return pd.DataFrame()

    # Debug: Print the product_id being processed
    print(f"Processing product_id: {product_id}")

    # Find the product by ID
    product = df[df['ProdID'] == product_id]
    if product.empty:
        print(f"Product ID {product_id} not found.")
        return pd.DataFrame()

    # Debug: Print the product details
    print(f"Product details: {product}")

    # Combine content fields for TF-IDF vectorization
    df['Combined'] = df['Tags'].fillna('') + " " + df['Description'].fillna('')
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix_content = tfidf_vectorizer.fit_transform(df['Combined'])

    # Get the index of the clicked product
    product_index = product.index[0]

    # Debug: Print the product index
    print(f"Product index: {product_index}")

    # Compute cosine similarity between the target product and all others
    cosine_similarities = cosine_similarity(
        tfidf_matrix_content[product_index], tfidf_matrix_content).flatten()

    # Debug: Print cosine similarities
    print(f"Cosine similarities: {cosine_similarities}")

    # Get the top N most similar products (excluding the clicked product itself)
    similar_indices = cosine_similarities.argsort()[::-1][1:top_n + 1]
    similar_scores = cosine_similarities[similar_indices]

    # Debug: Print similar indices and scores
    print(f"Similar indices: {similar_indices}")
    print(f"Similar scores: {similar_scores}")

    # Retrieve recommended products
    recommended_items_details = df.iloc[similar_indices][[
        'Name', 'ReviewCount', 'Brand', 'ImageURL', 'Rating', 'Price', 'ProdID', 'CProdId']]
    recommended_items_details['Similarity'] = similar_scores

    # Debug: Print recommended items
    print(f"Recommended items: {recommended_items_details}")

    # Check if user_id exists in the dataframe
    if user_id in df['userID'].values:
        print(
            f"User ID {user_id} found in the dataset. Incorporating user ratings.")

        # Assume you have a `user_ratings` dataframe containing user-item ratings
        user_ratings = df[df['userID'] == user_id][['CProdId', 'Rating']]

        # Add user ratings to the recommendations
        recommended_items_details['User_Rating'] = recommended_items_details['CProdId'].apply(
            lambda x: user_ratings[user_ratings['CProdId']
                                   == x]['Rating'].max()
            if not user_ratings[user_ratings['CProdId'] == x].empty else 0
        )

        # Sort by user rating and similarity
        recommended_items_details = recommended_items_details.sort_values(
            by=['Similarity', 'User_Rating'], ascending=[False, False]
        )
    else:
        print(
            f"User ID {user_id} not found. Providing content-based recommendations only.")
        # Add a default column for user ratings as 0
        recommended_items_details['User_Rating'] = 0

        # Sort by similarity only
        recommended_items_details = recommended_items_details.sort_values(
            by=['Similarity'], ascending=False
        )

    return recommended_items_details.head(top_n)


def get_recommendations(df, search_term=None, product_id=None, target_user_id=None, top_n=5):
    if search_term:
        # Content-based recommendations for search term
        content_based_rec = content_based_recommendations(
            df, target_user_id, search_term, top_n
        )
    elif product_id:
        # Content-based recommendations for clicked product
        content_based_rec = content_based_recommendations_by_prodid(
            df, product_id, top_n, target_user_id
        )
    else:
        return pd.DataFrame()

    # Collaborative filtering recommendations
    if target_user_id:
        collaborative_filtering_rec = collaborative_filtering_recommendations(
            df, target_user_id, top_n
        )
    else:
        collaborative_filtering_rec = pd.DataFrame()

    # Combine recommendations
    content_based_count = int(0.7 * top_n)
    collaborative_count = top_n - content_based_count

    content_based_sample = content_based_rec.head(content_based_count)
    collaborative_sample = collaborative_filtering_rec.head(
        collaborative_count)

    combined_rec = pd.concat([content_based_sample, collaborative_sample])
    return combined_rec.head(top_n)


@app.get("/search")
def search(
    search_term: str = None,
    product_id: str = None,
    target_user_id: int = None,
    top_n: int = Query(default=5)
):
    print(product_id)
    print("aksdhfakshfkashdf")
    if df.empty:
        return JSONResponse(content={"error": "Data not available"}, status_code=500)

    try:
        recommendations = get_recommendations(
            collab_df, search_term, product_id, target_user_id, top_n
        )
        cleaned_data = clean_df(recommendations)
        result = cleaned_data.to_dict(orient="records")
        return JSONResponse(content=result)

    except Exception as e:
        print(f"Error processing recommendation: {e}")
        return JSONResponse(content={"error": "Internal Server Error"}, status_code=500)

# @app.get("/search")
# def search(search_term: str, target_user_id: int, top_n: int = Query()):
#     print(top_n)
#     if df.empty:
#         return JSONResponse(content={"error": "Data not available"}, status_code=500)

#     try:
#         # Get content-based recommendations
#         content_based_rec = content_based_recommendations(
#             collab_df, target_user_id, search_term, top_n)

#         # Get collaborative filtering recommendations
#         collaborative_filtering_rec = collaborative_filtering_recommendations(
#             collab_df, target_user_id, top_n)

#         # Determine the number of recommendations to take from each method
#         content_based_count = int(0.7 * top_n)
#         collaborative_count = top_n - content_based_count  # Remaining for collaborative

#         # Sample 70% of data from content-based recommendations
#         content_based_sample = content_based_rec.head(content_based_count)

#         # Sample 30% of data from collaborative filtering recommendations
#         collaborative_sample = collaborative_filtering_rec.head(
#             collaborative_count)

#         # Combine recommendations
#         combined_rec = pd.concat([content_based_sample, collaborative_sample])

#         # Clean and limit results to top N
#         cleaned_data = clean_df(combined_rec)
#         result = cleaned_data.to_dict(orient="records")

#         return JSONResponse(content=result)

#     except Exception as e:
#         print(f"Error processing search: {e}")
#         return JSONResponse(content={"error": "Internal Server Error"}, status_code=500)
