import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDisclosure } from "@chakra-ui/hooks";
import EditProductModal from "../components/EditProductModal";
import AddProductModal from "../components/AddProductModal";
import {
  getToken,
  searchProduct,
  // sortProducts,
  generateFloatID,
} from "../utils/helpers";
import { useNavigate } from "react-router-dom";

const AdminDashboardPage = () => {
  const [productsData, setProductsData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAdd, setIsAdd] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const token = getToken();
  const newId = generateFloatID();

  const navigate = useNavigate();
  const {
    isOpen: isOpenAdd,
    onOpen: onOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure();

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 50;

  const API_URL = "http://localhost:3000/products";

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setProductsData(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAdd = () => {
    setIsAdd(true);
    onOpenAdd();
  };

  const handleDelete = async (productId) => {
    console.log(productId);
    try {
      await axios.delete(`${API_URL}/${productId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting the product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    console.log(product);
    onOpen();
  };

  const handleSave = async (updatedProduct) => {
    console.log(updatedProduct);
    console.log(updatedProduct.ProdID);
    try {
      await axios.put(`${API_URL}/${updatedProduct.ProdID}`, updatedProduct, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      onClose();
      fetchProducts();
    } catch (error) {
      console.error("Error updating the product:", error);
    }
  };

  const handleAddSave = async (product) => {
    console.log(product);
    try {
      await axios.post(
        `${API_URL}`,
        {
          ...product,
          ProdID: newId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProducts();
    } catch (error) {
      console.error("Error adding the product:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
    console.log("logout");
  };

  // Filter and sort products
  let filteredProducts = searchProduct(productsData, searchQuery);
  // filteredProducts = sortProducts(filteredProducts, sortOption);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-5">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold mb-12 text-center">
          Admin Dashboard
        </h1>
        <div className="filter-functions mb-6 flex flex-col sm:flex-row sm:justify-between">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 w-full sm:w-80 rounded-lg shadow-lg mb-4 sm:mb-0"
            type="text"
            placeholder="Search By name or product ID"
          />
          {/* <div className="filter mb-4 sm:mb-0">
            <select
              className="p-2 rounded-lg border"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">None</option>
              <option value="ReviewCount">Review Count</option>
              <option value="Rating">Rating</option>
            </select>
          </div> */}
          <div className=" flex gap-2">
            <button
              className="p-2 bg-blue-600 rounded-lg text-white"
              onClick={handleAdd}
            >
              Add Product
            </button>
            <button
              className="p-2 bg-red-500 rounded-lg text-white"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
        <div className="overflow-x-auto shadow-2xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "SN",
                  "ProdID",
                  "Category",
                  "Brand",
                  "Name",
                  "Image",
                  "Description",
                  "Tags",
                  "Price",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.map((product, index) => (
                <tr key={product.ProdID}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {indexOfFirstProduct + index + 1}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.ID && product.ID.length > 4
                      ? `${product.ID.slice(0, 4)}...`
                      : product.ID}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.ProdID && product.ProdID.length > 4
                      ? `${product.ProdID.slice(0, 4)}...`
                      : product.ProdID}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.Rating}
                  </td> */}
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.ReviewCount}
                  </td> */}
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
                      src={product.ImageURL.match(/^([^|]+)/)?.[0]}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.Price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.ProdID)}
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
        <div className="pagination mt-6 flex flex-wrap justify-center items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md mx-1 ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-blue-600 hover:bg-blue-100"
            }`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => {
              const isLargeScreen = window.innerWidth >= 768;
              const shouldDisplay =
                isLargeScreen || // Always show on large screens
                pageNumber === 1 || // Always show the first page
                pageNumber === totalPages || // Always show the last page
                pageNumber === currentPage || // Always show the current page
                (pageNumber >= currentPage - 1 &&
                  pageNumber <= currentPage + 1); // Show current page and one around it

              return (
                shouldDisplay && (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 rounded-md mx-1 ${
                      pageNumber === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              );
            }
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md mx-1 ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-blue-600 hover:bg-blue-100"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {isAdd && (
        <AddProductModal
          isOpen={isOpenAdd}
          onClose={onCloseAdd}
          onSave={handleAddSave}
        />
      )}
      {selectedProduct && (
        <EditProductModal
          isOpen={isOpen}
          onClose={onClose}
          onSave={handleSave}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;
