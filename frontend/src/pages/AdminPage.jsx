import React, { useState } from "react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    navigate("/admin/dashboard");
  };

  return (
    <div className=" min-h-screen flex flex-col justify-center items-center">
      <h1 className=" font-bold text-2xl mb-6">Admin Login</h1>
      <form
        className=" border p-16 rounded-lg shadow-lg"
        onSubmit={handleSubmit}
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
