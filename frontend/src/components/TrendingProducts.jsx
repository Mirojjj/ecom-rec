import React, { useEffect } from "react";
import { useCartStore } from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const TrendingProducts = ({ product }) => {
  const toast = useToast();
  const navigate = useNavigate();
  // name={product.Name}
  // reviewCount={product.ReviewCount}
  // brand={product.Brand}
  // imageUrl={product.ImageURL}
  // ratings={product.Rating}
  // price={product.Price}
  const { isLoggedIn } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    console.log(product);
  }, []);

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

  const firstImageUrl = product.ImageURL.match(/^([^|]+)/)?.[0] || "";
  return (
    <div
      onClick={() => {
        navigate(`/product-details/${product.ProdID}`);
      }}
      className="flex flex-col h-full items-center bg-white p-4 rounded-lg gap-6 shadow-xl "
    >
      <img
        src={firstImageUrl}
        alt="Product Image"
        className=" w-48 h-48 object-cover rounded-md mb-4"
      />

      <div className="flex flex-col items-start gap-1  w-full">
        <div className="text-lg font-semibold mb-1 tracking-tight line-clamp-2 text-ellipsis">
          {product.Name}
        </div>
        <div className="text-sm text-gray-600 mb-1 font-semibold tracking-tight">
          {product.Brand}
        </div>
        <div className="text-xl text-orange-600 font-bold  mb-1 tracking-tight">
          Rs. {product.Price}
        </div>
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
        {/* <div className="text-sm text-gray-600">{reviewCount} reviews</div> */}
        <button
          onClick={handleAddItemToCart}
          className=" border border-black rounded-3xl py-1 px-3 tracking-tight mt-3 text-sm font-semibold hover:bg-orange-500 hover:text-white hover:border-none"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default TrendingProducts;
