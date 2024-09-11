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
        "/Users/miroj/Desktop/final_year_project/models/cleaned_data.csv", encoding="utf-8")
    print(df.shape)
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
        average_ratings = df.groupby(['Name', 'ReviewCount', 'Brand', 'ImageURL', 'Price'])[
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
        index='ID', columns='ProdID', values='Rating', aggfunc='mean').fillna(0)

    # Compute user similarity using k-NN
    knn_model = NearestNeighbors(
        n_neighbors=top_n, metric='cosine', algorithm='brute')
    knn_model.fit(user_item_matrix)

    # Find the index of the target user in the matrix
    target_user_index = user_item_matrix.index.get_loc(target_user_id)

    # Get the similarity scores for the target user
    distances, indices = knn_model.kneighbors(
        user_item_matrix.iloc[target_user_index, :].values.reshape(1, -1))

    # Collect recommendations from similar users
    recommended_items = set()
    for i in range(len(indices.flatten())):
        if indices.flatten()[i] == target_user_index:
            continue  # Skip the target user itself

        similar_user_ratings = user_item_matrix.iloc[indices.flatten()[i]]
        # Recommend items not yet rated by the target user
        not_rated_by_target_user = (similar_user_ratings > 0) & (
            user_item_matrix.iloc[target_user_index] == 0)
        recommended_items.update(
            similar_user_ratings[not_rated_by_target_user].index)

    # Get the details of recommended items
    recommended_items_details = df[df['ID'].isin(recommended_items)][[
        'Name', 'ReviewCount', 'Brand', 'ImageURL', 'Rating', 'Price']]
    return recommended_items_details.head(top_n)


def knn_content_based_recommendations(df, search_term, top_n):
    if df.empty:
        return pd.DataFrame()

    df['Name_normalized'] = df['Name'].str.lower().str.strip()
    search_term_normalized = search_term.lower().strip()
    print(f"Normalized search term: '{search_term_normalized}'")

    matched_item = process.extractOne(
        search_term_normalized, df['Name_normalized'], scorer=fuzz.partial_ratio)
    print(f"Fuzzy match result: {matched_item}")

    if matched_item is None or matched_item[1] < 30:  # Adjust threshold
        print(f"No good match found for '{search_term}'.")
        return pd.DataFrame()

    best_match = matched_item[0]
    item_index = df[df['Name_normalized'] == best_match].index
    if item_index.empty:
        print(f"Index not found for '{best_match}'")
        return pd.DataFrame()
    item_index = item_index[0]

    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    df['Combined'] = df['Tags'].fillna('') + " " + df['Description'].fillna('')
    tfidf_matrix_content = tfidf_vectorizer.fit_transform(df['Combined'])
    print("TF-IDF matrix shape:", tfidf_matrix_content.shape)

    knn_model = NearestNeighbors(metric='cosine', algorithm='brute')
    knn_model.fit(tfidf_matrix_content)
    distances, indices = knn_model.kneighbors(
        tfidf_matrix_content[item_index], n_neighbors=top_n)

    # Create a DataFrame with recommendations and distances
    recommended_items_details = df.iloc[indices.flatten(
    )][['Name', 'ReviewCount', 'Brand', 'ImageURL', 'Rating', 'Price']]
    recommended_items_details['Distance'] = distances.flatten()

    return recommended_items_details.head(top_n)


@app.get("/search")
def search(search_term: str, target_user_id: int, top_n: int = Query()):
    print(top_n)
    if df.empty:
        return JSONResponse(content={"error": "Data not available"}, status_code=500)

    try:
        # Get content-based recommendations
        content_based_rec = knn_content_based_recommendations(
            df, search_term, top_n)

        # Get collaborative filtering recommendations
        collaborative_filtering_rec = collaborative_filtering_recommendations(
            df, target_user_id, top_n)

        # Combine and deduplicate recommendations
        combined_rec = pd.concat(
            [content_based_rec, collaborative_filtering_rec]).drop_duplicates()

        cleaned_data = clean_df(combined_rec)
        cleaned_data = cleaned_data.head(20)
        result = cleaned_data.to_dict(orient='records')
        return JSONResponse(content=result)
    except Exception as e:
        print(f"Error processing search: {e}")
        return JSONResponse(content={"error": "Internal Server Error"}, status_code=500)
