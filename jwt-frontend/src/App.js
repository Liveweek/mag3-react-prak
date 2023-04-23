import React from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api, { apiSetHeader } from "./services/api";

import Auth from './pages/Auth';
import Reg from './pages/Reg';
import UserPage from './pages/UserPage';

function App() {

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState("")
  useEffect(() => {
    getUserInfo();
  }, []);

  async function getUserInfo() {
    try{
      if (localStorage.getItem("access") !== null) {
        apiSetHeader("Bearer", `${localStorage.getItem("access")}`);
        const res = await api.get("user_info");
        setUserInfo(res.data.user);
        navigate('/');
      } else {
        navigate("/login");
      }
    } catch (e) {
      navigate("/login");
    }
  }


  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <Routes>
              <Route path="/" element={<UserPage userInfo={userInfo}/>}></Route>
              <Route path="/login" element={<Auth/>}></Route>
              <Route path="/register" element={<Reg/>}></Route>
            </Routes>
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
