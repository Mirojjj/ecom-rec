from fastapi import FastAPI, Query
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
from rapidfuzz import process
from fastapi.responses import JSONResponse

# Run with: uvicorn app:app --reload
import os


df = pd.read_csv(
    "/Users/miroj/Desktop/final_year_project/models/cleaned_data.csv",  encoding="utf-8")
print(df.head())

app = FastAPI()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserRequest(BaseModel):
    user_id: int


@app.get("/")
def home():
    return {"status": "working"}

# get tredning products


@app.get("/trendings")
def getTrendingProducts():
    average_ratings = df.groupby(['Name', 'ReviewCount', 'Brand', 'ImageURL'])[
        'Rating'].mean().reset_index()
    # Calculate weighted score: You can adjust the weight of the rating and review count as needed
    average_ratings['WeightedScore'] = (
        average_ratings['Rating'] * 0.7) + (np.log1p(average_ratings['ReviewCount']) * 0.3)

# Sort by the weighted score instead of just rating
    top_rated_items = average_ratings.sort_values(
        by='WeightedScore', ascending=False)

# Select the top 12 products
    rating_base_recommendation = top_rated_items.head(12)

# Convert to dictionary and return the result
    result = rating_base_recommendation.to_dict(orient='records')
    return JSONResponse(content=result)


# content based recommendation search api
@app.get("/search")
def content_based_recommendations(search_term: str, top_n: int = Query(10)):
    print(f"Training data shape: {df.shape}")

    # Normalize the item names for case-insensitive matching
    df['Name_normalized'] = df['Name'].str.lower().str.strip()
    search_term_normalized = search_term.lower().strip()

    # Use fuzzy matching to find the closest match for the search term
    matched_item = process.extractOne(
        search_term_normalized, df['Name_normalized'])

    # Adjust the threshold as needed
    if matched_item is None or matched_item[1] < 50:
        print(f"No good match found for '{search_term}'.")
        return pd.DataFrame()

    # Extract the best matching item name
    best_match = matched_item[0]
    print(f"Best match found for '{search_term}' is '{best_match}'.")

    # Find the index of the best matching item
    item_index = df[df['Name_normalized']
                    == best_match].index[0]

    # Create a TF-IDF vectorizer for item descriptions/tags
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')

    # Apply TF-IDF vectorization to item descriptions/tags
    tfidf_matrix_content = tfidf_vectorizer.fit_transform(
        df['Tags'].fillna(''))

    # Calculate cosine similarity between items based on descriptions/tags
    cosine_similarities_content = cosine_similarity(
        tfidf_matrix_content, tfidf_matrix_content)

    # Get the cosine similarity scores for the item
    similar_items = list(enumerate(cosine_similarities_content[item_index]))

    # Sort similar items by similarity score in descending order
    similar_items = sorted(similar_items, key=lambda x: x[1], reverse=True)

    # Get the top N most similar items (excluding the item itself)
    # Skip the first item (itself)
    top_similar_items = similar_items[0:top_n+1]

    # Get the indices of the top similar items
    recommended_item_indices = [x[0] for x in top_similar_items]

    # Get the details of the top similar items
    recommended_items_details = df.iloc[recommended_item_indices][[
        'Name', 'ReviewCount', 'Brand', 'ImageURL', 'Rating']]

    # # Calculate the weighted score
    # recommended_items_details['WeightedScore'] = (0.8 * recommended_items_details['Rating']) + \
    #                                              (0.2 *
    #                                               recommended_items_details['ReviewCount'])

    # # Sort by the weighted score (highest first)
    # recommended_items_details = recommended_items_details.sort_values(
    #     by='WeightedScore', ascending=False)

    print(f"Recommendations for '{search_term}':")
    result = recommended_items_details.to_dict(orient='records')
    return JSONResponse(content=result)
