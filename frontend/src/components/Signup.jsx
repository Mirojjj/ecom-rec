import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
// import axios from "axios";
// import { useHistory } from "react-router-dom";

const Signup = () => {
  //   const [name, setName] = useState("");
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  //   const [confirmPassword, setConfirmPassword] = useState("");
  //   const [pic, setPic] = useState("");
  //   const [show, setShow] = useState(false);
  //   const [loading, setLoading] = useState(false);
  //   const toast = useToast();
  //   const history = useHistory();

  //   const handleClick = () => {
  //     setShow(!show);
  //   };

  //   const postDetails = (pics) => {
  //     setLoading(true);
  //     if (pics === undefined) {
  //       toast({
  //         title: "Please Select an image!",
  //         status: "warning",
  //         duration: 5000,
  //         isClosable: true,
  //         position: "bottom",
  //       });
  //     }

  //     if (pics.type === "image/jpeg" || pics.type === "image/png") {
  //       const data = new FormData();
  //       data.append("file", pics);
  //       data.append("upload_preset", "chit-chat");
  //       data.append("cloud_name", "miroj");
  //       fetch("https://api.cloudinary.com/v1_1/miroj/image/upload", {
  //         method: "post",
  //         body: data,
  //       })
  //         .then((res) => res.json())
  //         .then((data) => {
  //           console.log(data);
  //           setPic(data.url.toString());
  //           setLoading(false);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //           setLoading(false);
  //         });
  //     } else {
  //       toast({
  //         title: "Please Select an image!",
  //         status: "warning",
  //         duration: 5000,
  //         isClosable: true,
  //         position: "bottom",
  //       });
  //     }
  //   };

  //   const handleSubmit = async () => {
  //     setLoading(true);

  //     try {
  //       const config = {
  //         headers: {
  //           "Content-type": "application/json",
  //         },
  //       };
  //       const { data } = await axios.post(
  //         "/api/user",
  //         {
  //           name,
  //           email,
  //           password,
  //           confirmPassword,
  //           pic,
  //         },
  //         config
  //       );

  //       toast({
  //         title: "User Registered Successfully",
  //         status: "success",
  //         duration: 5000,
  //         isClosable: true,
  //         position: "bottom",
  //       });

  //       localStorage.setItem("user-credentails", JSON.stringify(data));

  //       setLoading(false);

  //       history.push("/chats");
  //     } catch (error) {
  //       console.log(error);
  //       toast({
  //         title: error.response.data.message,
  //         status: "warning",
  //         duration: 5000,
  //         isClosable: true,
  //         position: "bottom",
  //       });
  //       setLoading(false);
  //     }
  //   };

  return (
    <VStack spacing={"12px"} color={"black"}>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          //   onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type="password"
            // type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            // onChange={(e) => setPassword(e.target.value)}
          />
          {/* <InputRightElement w={"4.5rem"}>
            <Button h={"1.75rem"} size={"sm"} onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement> */}
        </InputGroup>
      </FormControl>

      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type="password"
            // type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            // onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {/* <InputRightElement w={"4.5rem"}>
            <Button h={"1.75rem"} size={"sm"} onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement> */}
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width={"100%"}
        style={{ marginTop: 15 }}
        // onClick={handleSubmit}
        // isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
