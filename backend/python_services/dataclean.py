# taking only the required essential columns from the given dataset
df = df[['Uniq Id', 'Product Id', 'Product Rating', 'Product Reviews Count', 'Product Category',
         'Product Brand', 'Product Name', 'Product Image Url', 'Product Description', 'Product Tags']]
df.head(3)

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

# data cleaning to change the category, brand and descripton to make it more readable by seperating it with commas
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
