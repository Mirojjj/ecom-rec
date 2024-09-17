import { v4 as uuidv4 } from "uuid";

export const searchProduct = (products, searchQuery) => {
  return products.filter(
    (product) =>
      product.Name.trim()
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase()) ||
      product.ProdID.trim()
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase())
  );
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
