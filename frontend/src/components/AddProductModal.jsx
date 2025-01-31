import React, { useState, useEffect } from "react";
import { Button } from "@chakra-ui/button";
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalContent,
} from "@chakra-ui/modal";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Textarea } from "@chakra-ui/react";

const AddProductModal = ({ isOpen, onClose, onSave }) => {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  // State to manage the form data
  const [formData, setFormData] = useState({
    ProdID: "",
    Name: "",
    Brand: "",
    Category: "",
    Tags: "",
    ImageURL: "",
    Description: "",
    Price: "",
  });

  // Populate the form data when the modal opens
  //   useEffect(() => {
  //     if (product) {
  //       setFormData({
  //         ID: product.ID,
  //         Name: product.Name || "",
  //         Brand: product.Brand || "",
  //         Category: product.Category || "",
  //         Tags: product.Tags || "",
  //         ImageURL: product.ImageURL || "",
  //       });
  //     }
  //   }, [product]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save button click
  const handleSubmit = () => {
    console.log(formData);
    onSave(formData); // Call the onSave function passed from the parent component
    onClose(); // Close the modal
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <form onSubmit={handleSubmit}>
        <ModalContent>
          <ModalHeader className="text-center">Add Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Product Name</FormLabel>
              <Input
                required
                placeholder="Product Name"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                required
                placeholder="Price"
                name="Price"
                value={formData.Price}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Brand</FormLabel>
              <Input
                required
                placeholder="Brand"
                name="Brand"
                value={formData.Brand}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Category</FormLabel>
              <Input
                required
                placeholder="Category"
                name="Category"
                value={formData.Category}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Tags</FormLabel>
              <Input
                required
                placeholder="Tags"
                name="Tags"
                value={formData.Tags}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Image URL</FormLabel>
              <Input
                type="url"
                required
                placeholder="Image URL"
                name="ImageURL"
                value={formData.ImageURL}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                required
                placeholder="Description of product"
                name="Description"
                value={formData.Description}
                onChange={handleChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit">
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default AddProductModal;
