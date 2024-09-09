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
  const API_URL = "http://127.0.0.1:8000/trendings";
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        console.log(response.data);
        setTrendingProducts(response.data);
        // setData(response.data.status);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className=" bg-white">
      <div className=" min-h-screen px-[6%]">
        <Navbar />
        {/* <Banner /> */}
        <Box w="100%" p={4} color="white">
          <ImageSlider slides={SlideData} />
        </Box>
        <h1 className="text-center text-3xl font-bold my-12">
          Trending Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
          {trendingProducts.map((product, index) => (
            <div key={index}>
              <TrendingProducts
                name={product.Name}
                reviewCount={product.ReviewCount}
                brand={product.Brand}
                imageUrl={product.ImageURL}
                ratings={product.Rating}
              />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
