import { v4 as uuidv4 } from "uuid";

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

//get token from localstorage

export const getToken = () => {
  return localStorage.getItem("adminToken");
};

export const generateFloatID = () => {
  const base = 1000000; // Base number to ensure the float has significant digits
  const uniquePart = parseInt(uuidv4().replace(/-/g, "").slice(0, 8), 16); // Extract part of UUID for uniqueness
  return base + uniquePart / 1000000; // Convert to float
};
