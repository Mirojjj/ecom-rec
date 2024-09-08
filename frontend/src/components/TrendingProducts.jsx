import React from "react";

const TrendingProducts = ({ name, reviewCount, brand, imageUrl, ratings }) => {
  return (
    <div className="flex flex-col h-full items-center bg-white p-4 rounded-lg shadow-lg">
      <img
        src={imageUrl}
        alt="Product Image"
        className="w-48 h-48 object-cover rounded-md mb-4"
      />
      <div className="text-lg font-semibold mb-1">{name}</div>
      <div className="text-sm text-gray-500 mb-1">{brand}</div>
      <div className="text-yellow-400 font-bold mb-1">⭐ {ratings}</div>
      <div className="text-sm text-gray-600">{reviewCount} reviews</div>
    </div>
  );
};

export default TrendingProducts;
