import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDisclosure } from "@chakra-ui/hooks";
import EditProductModal from "../../components/EditProductModal";

const AdminPage = () => {
  const [productsData, setProductsData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // State for the selected product
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const productsPerPage = 50; // Number of products to show per page

  const API_URL = "http://localhost:3000/users"; // Define API URL

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProductsData(response.data); // Update state with fetched products
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (productId) => {
    console.log("Deleting product with ID:", productId);
    try {
      await axios.delete(`${API_URL}/${productId}`);
      console.log("Product deleted successfully.");
      // Re-fetch the updated products list
      fetchProducts(); // Fetch products again to update the list
    } catch (error) {
      console.log("Error deleting the product:", error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products when component mounts
  }, []); // Empty dependency array to run only on mount

  const handleEdit = (product) => {
    setSelectedProduct(product); // Set the selected product for editing
    onOpen(); // Open the modal
  };

  // Handle the save action from the modal
  const handleSave = async (updatedProduct) => {
    try {
      // Update the product on the server
      const response = await axios.put(
        `${API_URL}/${updatedProduct.ID}`,
        updatedProduct
      );
      console.log("Product updated successfully:", response.data.message);

      window.location.reload();
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Error updating the product:", error);
    }
  };

  // Calculate the index of the first and last product on the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productsData.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Calculate total pages
  const totalPages = Math.ceil(productsData.length / productsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className=" p-5">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold mb-12 text-center">
          Admin Dashboard
        </h1>
        <div className="overflow-x-auto shadow-2xl">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50 ">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ProdID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.map((product, index) => (
                <tr key={product.ProdID}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {indexOfFirstProduct + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.ID && product.ID.length > 4
                      ? `${product.ID.slice(0, 4)}...`
                      : product.ID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.ProdID && product.ProdID.length > 4
                      ? `${product.ProdID.slice(0, 4)}...`
                      : product.ProdID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.Rating}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.ReviewCount}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate w-32"
                    title={product.Category}
                  >
                    {product.Category && product.Category.length > 12
                      ? `${product.Category.slice(0, 12)}...`
                      : product.Category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.Brand}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate w-32"
                    title={product.Name}
                  >
                    {product.Name && product.Name.length > 12
                      ? `${product.Name.slice(0, 12)}...`
                      : product.Name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.ImageURL}
                      alt={product.Name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate w-64"
                    title={product.Description}
                  >
                    {product.Description && product.Description.length > 12
                      ? `${product.Description.slice(0, 12)}...`
                      : product.Description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.Tags && product.Tags.length > 12
                      ? `${product.Tags.slice(0, 12)}...`
                      : product.Tags}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.ID)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 mx-1 ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 text-white"
            } rounded-md`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 ${
                currentPage === index + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200"
              } rounded-md`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 mx-1 ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 text-white"
            } rounded-md`}
          >
            Next
          </button>
        </div>
      </div>

      {/* EditProductModal for editing the product details */}
      {selectedProduct && (
        <EditProductModal
          isOpen={isOpen}
          onClose={onClose}
          product={selectedProduct} // Pass the selected product to the modal
          onSave={handleSave} // Pass the save handler to the modal
        />
      )}
    </div>
  );
};

export default AdminPage;
