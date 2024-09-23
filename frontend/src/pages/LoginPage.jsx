import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from "@chakra-ui/react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import React from "react";

const LoginPage = () => {
  return (
    <div className=" flex min-h-screen justify-center items-center">
      <Box
        bg={"white"}
        w={"65%"}
        borderRadius={"lg"}
        borderWidth={"1px"}
        p={"4"}
        color={"black"}
      >
        <Tabs variant="soft-rounded">
          <TabList mb={"1em"}>
            <Tab w={"50%"}>Login</Tab>
            <Tab w={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </div>
  );
};

export default LoginPage;
