""""Load Packages and Libraries"""
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import spacy

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from spacy.lang.en.stop_words import STOP_WORDS
from scipy.sparse import coo_matrix

"""Data Loading and Preprocessing"""

# reading the given data set with pandas, converting them in dataframe and placing them in the df varaible.
df = pd.read_csv('Walmart Product Review 2020 5k.tsv', sep='\t')
df.columns

# taking only the required essential columns from the given dataset
df = df[['Uniq Id', 'Product Id', 'Product Rating', 'Product Reviews Count', 'Product Category',
         'Product Brand', 'Product Name', 'Product Image Url', 'Product Description', 'Product Tags']]
df.head(3)


# checking the number of rows and columns
df.shape

# part of cleaning the dataset: removing duplicates row present in the dataset if any
df.drop_duplicates(inplace=True)

# checking the null data that might be present in various columns of the dataset
df.isnull().sum()

# here the columns with null value cannot be dropped as they are essential data to us and we might loose various other data associated with it
# so we are replace those null values with 0.

# Fill missing values in 'Product Rating' with a default value (e.g., 0)
df['Product Rating'].fillna(0, inplace=True)
# Fill missing values in 'Product Reviews Count' with a default value (e.g., 0)
df['Product Reviews Count'].fillna(0, inplace=True)
# Fill missing values in 'Product Category' with a default value (e.g., 'Unknown')
df['Product Category'].fillna('', inplace=True)
# Fill missing values in 'Product Brand' with a default value (e.g., 'Unknown')
df['Product Brand'].fillna('', inplace=True)
# Fill missing values in 'Product Description' with an empty string
df['Product Description'].fillna('', inplace=True)

# check if we still have any null values remaining
df.isnull().sum()

# make columns shorter
# Define the mapping of current column names to shorter names
column_name_mapping = {
    'Uniq Id': 'ID',
    'Product Id': 'ProdID',
    'Product Rating': 'Rating',
    'Product Reviews Count': 'ReviewCount',
    'Product Category': 'Category',
    'Product Brand': 'Brand',
    'Product Name': 'Name',
    'Product Image Url': 'ImageURL',
    'Product Description': 'Description',
    'Product Tags': 'Tags',
    'Product Contents': 'Contents'
}
# Rename the columns using the mapping
df.rename(columns=column_name_mapping, inplace=True)

# converted the id and prod id of the product to type float from type string as it is essential to have these values in type int of float
# during collaborative filtering while using consine_similarity.
df['ID'] = df['ID'].str.extract(r'(\d+)').astype(float)
df['ProdID'] = df['ProdID'].str.extract(r'(\d+)').astype(float)

# Taking out unique users, items and ratings from the dataset which can be useful in furtuer operations.
# Basic statistics
num_users = df['ID'].nunique()
num_items = df['ProdID'].nunique()
num_ratings = df['Rating'].nunique()
print(f"Number of unique users: {num_users}")
print(f"Number of unique items: {num_items}")
print(f"Number of unique ratings: {num_ratings}")

"""Data cleaning and tag creation"""


nlp = spacy.load("en_core_web_sm")  # created npl object


def clean_and_extract_tags(text):
    doc = nlp(text.lower())
    tags = [token.text for token in doc if token.text.isalnum()
            and token.text not in STOP_WORDS]
    return ', '.join(tags)


columns_to_extract_tags_from = ['Category', 'Brand', 'Description']

for column in columns_to_extract_tags_from:
    df[column] = df[column].apply(clean_and_extract_tags)

# Concatenate the cleaned tags to all relevant columns
df['Tags'] = df[columns_to_extract_tags_from].apply(
    lambda row: ', '.join(row), axis=1)
df.head(5)


""""EDA (Exploratory Data Analysis)"""


# Understand user activity and item popularity by counting the number of interactions.
# Count interactions per user
user_interactions = df['ID'].value_counts()


# Count interactions per product
product_interactions = df['ProdID'].value_counts()

# Plotting user interactions
plt.figure(figsize=(12, 6))
plt.subplot(1, 2, 1)
user_interactions.hist(bins=20, edgecolor='k')
plt.xlabel('Number of Interactions per User')
plt.ylabel('Number of Users')
plt.title('Distribution of User Interactions')

# Plotting product interactions
plt.subplot(1, 2, 2)
product_interactions.hist(bins=20, edgecolor='k', color='green')
plt.xlabel('Number of Interactions per Product')
plt.ylabel('Number of Products')
plt.title('Distribution of Product Interactions')

plt.tight_layout()
plt.show()

# Explore the frequency of ratings of different products.

df['Rating'].plot(kind='hist', bins=10, title='Rating')
plt.gca().spines[['top', 'right',]].set_visible(False)
plt.show()

# Explore the frequency of different brands to understand the dataset composition.
top_brands = df['Brand'].value_counts().head(10)


# Plotting brands
top_brands.plot(kind='bar', color='blue', edgecolor='k')
plt.xlabel('Brand')
plt.ylabel('Number of Products')
plt.title('Top 10 Brands')

plt.tight_layout()
plt.show()

# shows the review counts per product according to the given dataset.
plt.figure(figsize=(6, 4))
df['ReviewCount'].hist(bins=10, edgecolor='k', color='orange')
plt.xlabel('Review Count')
plt.ylabel('Number of Products')
plt.title('Distribution of Review Counts per Product')
plt.show()

# Check the correlation between numerical features, like rating and review count, to see if highly reviewed products tend to have higher or lower ratings.
correlation_matrix = df[['Rating', 'ReviewCount']].corr()

print(correlation_matrix)
plt.figure(figsize=(6, 4))
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm')
plt.title('Correlation Matrix')
plt.show()
