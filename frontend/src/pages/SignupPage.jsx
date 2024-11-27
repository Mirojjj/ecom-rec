import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import axios from "axios";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handlePassword = () => setShowPassword(!showPassword);
  const handleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!username || !email || !password || !confirmPassword) {
      toast({
        title: "All fields are required!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    setLoading(true);

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const { data } = await axios.post(
        "http://localhost:3000/users/signup",
        { username, email, password, confirmPassword },
        config
      );

      toast({
        title: "User Registered Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
      navigate("/login"); // Redirect to login page
    } catch (error) {
      toast({
        title: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen p-12">
      {/* Left side with the image */}
      <div className="w-1/2 hidden lg:block">
        <img
          src="src/assets/a.jpg"
          alt="Signup Illustration"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* Right side with the form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 py-6">
        <img
          src="src/assets/logo.png"
          alt="Logo"
          height={40}
          width={60}
          className=" mb-8 rounded-full"
        />

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md flex flex-col gap-6"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-3 px-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Username"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-3 px-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Email"
          />

          {/* Password field */}
          <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 pr-4 focus-within:ring-2 focus-within:ring-orange-400">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 px-4 bg-transparent focus:outline-none"
              placeholder="Password"
            />
            {showPassword ? (
              <EyeInvisibleOutlined
                className="cursor-pointer text-gray-500"
                onClick={handlePassword}
              />
            ) : (
              <EyeOutlined
                className="cursor-pointer text-gray-500"
                onClick={handlePassword}
              />
            )}
          </div>

          {/* Confirm Password field */}
          <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 pr-4 focus-within:ring-2 focus-within:ring-orange-400">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full py-3 px-4 bg-transparent focus:outline-none"
              placeholder="Confirm Password"
            />
            {showConfirmPassword ? (
              <EyeInvisibleOutlined
                className="cursor-pointer text-gray-500"
                onClick={handleConfirmPassword}
              />
            ) : (
              <EyeOutlined
                className="cursor-pointer text-gray-500"
                onClick={handleConfirmPassword}
              />
            )}
          </div>

          <button
            type="submit"
            className={`w-full bg-orange-400 text-white font-bold py-3 rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-500"
            }`}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
