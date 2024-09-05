import React, { useState } from "react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPage = () => {
  const API_URL = "http://localhost:3000";

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    const { username, password } = formData;
    console.log(username, password);
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/adminLogin`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        localStorage.setItem("adminToken", response.data.accessToken);
        navigate("/admin/dashboard");
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className=" min-h-screen flex flex-col justify-center items-center">
      <h1 className=" font-bold text-2xl mb-6">Admin Login</h1>
      <form
        className=" border p-16 rounded-lg shadow-lg"
        onSubmit={handleLogin}
      >
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            required
            placeholder="username"
            name="username"
            onChange={handleChange}
          />
        </FormControl>
        <br />
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            required
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
        </FormControl>
        <br />
        {error && <p className=" text-red-500">{error}</p>}

        <div className=" flex justify-center mt-4">
          <button
            className=" bg-blue-500 py-2 px-4 text-white font-bold rounded-lg hover:bg-blue-600"
            type="submit"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPage;
