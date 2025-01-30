import React, { useState } from "react";
import DrawerModel from "../components/Drawer";
import { useDisclosure } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const Navbar = ({ onSearch }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isDrawer, setIsDrawer] = useState(false);

  const btnRef = React.useRef();

  const { isLoggedIn } = useAuthStore();
  const { logout } = useAuthStore();

  const handleCartDrawer = () => {
    setIsDrawer(true);
    onOpen();
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      console.log(e.target.value);
      onSearch(e.target.value);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user-credentials");
  };

  return (
    <div className="px-20 py-5 flex justify-between items-center w-full bg-orange-500 shadow-md">
      {/* Logo Section */}
      <div
        className="logo flex text-white text-2xl font-semibold pl-2 cursor-pointer"
        onClick={() => window.location.reload()}
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

      {/* Search Bar */}
      <input
        type="text"
        className="searchbar px-4 py-2 rounded-2xl w-96 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500"
        placeholder="Search for Products..."
        onKeyDown={handleSearch}
      />

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
  );
};

export default Navbar;
