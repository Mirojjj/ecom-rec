from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from fastapi.responses import JSONResponse

import os


df = pd.read_csv(
    "/Users/miroj/Desktop/final_year_project/models/cleaned_data.csv",  encoding="utf-8")
# print(df.head())

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

# showing top rated products present in the store


# grouping the df my the given paratmeters that depends on ratings mean
# average_ratings = df.groupby(['Name', 'ReviewCount', 'Brand', 'ImageURL'])[
#     'Rating'].mean().reset_index()

# # top 10 recommended items based on rating
# top_rated_items = average_ratings.sort_values(by='Rating', ascending=False)
# rating_base_recommendation = top_rated_items.head(20)


# print(rating_base_recommendation)
   # Run with: uvicorn app:app --reload
