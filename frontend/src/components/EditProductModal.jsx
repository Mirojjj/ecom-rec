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
    Description: "",
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
        Description: product.Description || "",
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
  const handleSubmit = () => {
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
          <ModalHeader className="text-center">Edit Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Product Name</FormLabel>
              <Input
                required
                ref={initialRef}
                placeholder="Product Name"
                name="Name"
                value={formData.Name}
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

export default EditProductModal;
