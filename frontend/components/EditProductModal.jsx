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

const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  // State to manage the form data
  const [formData, setFormData] = useState({
    ID: product.ID,
    Name: "",
    Brand: "",
    Category: "",
    Tags: "",
    ImageURL: "",
  });

  // Populate the form data when the modal opens
  useEffect(() => {
    if (product) {
      setFormData({
        ID: product.ID,
        Name: product.Name || "",
        Brand: product.Brand || "",
        Category: product.Category || "",
        Tags: product.Tags || "",
        ImageURL: product.ImageURL || "",
      });
    }
  }, [product]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save button click
  const handleSave = () => {
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
      <ModalContent>
        <ModalHeader className="text-center">Edit Product</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Product Name</FormLabel>
            <Input
              ref={initialRef}
              placeholder="Product Name"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Brand</FormLabel>
            <Input
              placeholder="Brand"
              name="Brand"
              value={formData.Brand}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Category</FormLabel>
            <Input
              placeholder="Category"
              name="Category"
              value={formData.Category}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Tags</FormLabel>
            <Input
              placeholder="Tags"
              name="Tags"
              value={formData.Tags}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Image URL</FormLabel>
            <Input
              placeholder="Image URL"
              name="ImageURL"
              value={formData.ImageURL}
              onChange={handleChange}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProductModal;
