import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import TrendingProducts from "../components/TrendingProducts";
import { Box } from "@chakra-ui/react";
import ImageSlider from "../components/ImageSlider";
import { SlideData } from "../utils/slidedata";
import Footer from "../components/Footer";

const HomePage = () => {
  const API_URL = "http://127.0.0.1:8000";
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch products based on search query or trending products
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoint = searchQuery.trim() ? "/search" : "/trendings";
        const params = searchQuery.trim()
          ? { search_term: searchQuery, target_user_id: 26287, top_n: 20 }
          : {};
        const response = await axios.get(`${API_URL}${endpoint}`, { params });
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);

  const handleSearchProduct = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="bg-white">
      <div className="min-h-screen px-[6%]">
        <Navbar onSearch={handleSearchProduct} />
        {/* Conditionally render the banner if no search query */}
        {!searchQuery && (
          <Box w="100%" p={4} color="white">
            <ImageSlider slides={SlideData} />
          </Box>
        )}
        <h1 className="text-center text-3xl font-bold my-12">
          {searchQuery ? "Search Results" : "Trending Products"}
        </h1>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div key={index}>
                  <TrendingProducts
                    name={product.Name}
                    reviewCount={product.ReviewCount}
                    brand={product.Brand}
                    imageUrl={product.ImageURL}
                    ratings={product.Rating}
                  />
                </div>
              ))
            ) : (
              <div className="text-center">No products found</div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
