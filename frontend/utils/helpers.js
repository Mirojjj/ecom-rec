export const searchProduct = (products, searchQuery) => {
  return products.filter(
    (product) =>
      product.Name.trim()
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase()) ||
      product.ID.trim().toLowerCase().includes(searchQuery.trim().toLowerCase())
  );
};

export const sortProducts = (products, sortOption) => {
  if (sortOption === "Rating") {
    // Sort by Rating in descending order
    return [...products].sort((a, b) => b.Rating - a.Rating);
  } else if (sortOption === "ReviewCount") {
    // Sort by Review Count in descending order
    return [...products].sort((a, b) => b.ReviewCount - a.ReviewCount);
  }
  // Return products unsorted if no sort option is selected
  return products;
};
