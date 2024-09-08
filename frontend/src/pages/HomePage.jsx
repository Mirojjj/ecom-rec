import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import TrendingProducts from "../components/TrendingProducts";
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
    <div className=" min-h-screen px-[10%] bg-gray-100">
      <Navbar />
      <Banner />
      <h1 className="text-center text-3xl font-bold">Trending Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-8 ">
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

      {/* <div className=" bg-red-400 p-5 flex justify-between items-center ">
          <div className="logo">Shopkart</div>
          <input className="searchbar w-96" placeholder="Search Products" />
          <div className="func flex items-center">
            <div>Account</div>
            <div>Cart</div>
          </div>
        </div> */}
    </div>
  );
};

export default HomePage;
