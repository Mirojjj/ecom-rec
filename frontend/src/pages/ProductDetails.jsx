import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { useToast } from "@chakra-ui/react";
import { useCartStore } from "../store/useCartStore";
import axios from "axios";
import TrendingProducts from "../components/TrendingProducts";
import DrawerModel from "../components/Drawer";
import { useDisclosure } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const { isLoggedIn } = useAuthStore();
  const { logout } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDrawer, setIsDrawer] = useState(false);

  const navigate = useNavigate();

  const API_URL = "http://localhost:3000/products";

  const btnRef = React.useRef();

  const handleCartDrawer = () => {
    setIsDrawer(true);
    onOpen();
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user-credentials");
  };

  useEffect(() => {
    console.log(id);
    window.scrollTo(0, 0);
    const fetchProductDetails = async () => {
      try {
        // Fetch product details
        const productResponse = await fetch(`${API_URL}/${id}`);
        if (!productResponse.ok) {
          throw new Error("Failed to fetch product details");
        }
        const productData = await productResponse.json();
        console.log(productData);
        setProduct(productData);

        // Fetch recommendations
        try {
          const params = {
            product_id: id,
            target_user_id: 100,
            top_n: 70,
          };

          const { data: recommendations } = await axios.get(
            `http://127.0.0.1:8000/search`,
            { params }
          );
          console.log("Recommendations:", recommendations);
          setRecommendations(recommendations);

          // console.log(products.map((pro) => pro.ProdID));
        } catch (error) {
          console.error("Failed to fetch products:", error);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddItemToCart = (event) => {
    event.stopPropagation();
    if (isLoggedIn) {
      addItem(product);
      toast({
        title: "Item added to the cart",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } else {
      toast({
        title: "Please Login First",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    // isLoggedIn
    //   ? addItem(product)
    //   : toast({
    //       title: "Please Login First",
    //       status: "warning",
    //       duration: 5000,
    //       isClosable: true,
    //       position: "bottom",
    //     });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-center py-8">Product not found.</div>;
  }

  const firstImageUrl = product.ImageURL.match(/^([^|]+)/)?.[0] || "";

  return (
    <div>
      <div className="px-20 py-5 flex justify-between items-center w-full bg-orange-500 shadow-md">
        {/* Logo Section */}
        <div
          className="logo flex text-white text-2xl font-semibold pl-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/src/assets/logo.png"
            alt="logo"
            height={20}
            width={40}
            className="rounded-full"
          />
          <span className="ml-2">Shopkart</span>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-6 font-medium text-white">
          {isLoggedIn ? (
            <div
              onClick={handleLogout}
              className="flex items-center space-x-2 cursor-pointer hover:text-orange-200 transition-colors duration-200"
            >
              <span>Logout</span>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to={"/login"}
                className="flex items-center space-x-2 cursor-pointer hover:text-orange-200 transition-colors duration-200"
              >
                <span>Login</span>
              </Link>
              <Link
                to={"/signup"}
                className="flex items-center space-x-2 cursor-pointer hover:text-orange-200 transition-colors duration-200"
              >
                <span>Sign Up</span>
              </Link>
            </div>
          )}

          {/* Cart Icon */}
          <div
            ref={btnRef}
            onClick={handleCartDrawer}
            className="flex items-center space-x-2 cursor-pointer hover:text-orange-200 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            <span>Cart</span>
          </div>
        </div>

        {/* Cart Drawer */}
        {isDrawer && (
          <DrawerModel isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
        )}
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* Product Details */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="md:w-1/2">
            <img
              src={firstImageUrl}
              alt={product.Name}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Product Info */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{product.Name}</h1>
            <p className="text-gray-600 mb-4">{product.Brand}</p>
            <p className="text-gray-600 mb-4">{product.Description}</p>
            <div className="text-orange-400 font-bold  flex gap-1">
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                    clip-rule="evenodd"
                  />
                </svg>
                {product.Rating}
              </div>

              <p className="text-black font-normal tracking-tight">
                ({product.ReviewCount})
              </p>
            </div>
            <br />
            <p className="text-2xl font-bold mb-4">Rs. {product.Price}</p>
            <button
              onClick={handleAddItemToCart}
              className=" border border-black rounded-3xl py-1 px-3 tracking-tight mt-1 text-sm font-semibold hover:bg-orange-500 hover:text-white hover:border-none"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Recommendations Section */}
        <h2 className=" mt-16 font-bold text-3xl">Other Recommendations: </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16 mt-12">
          {recommendations.map((product) => (
            <TrendingProducts product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
