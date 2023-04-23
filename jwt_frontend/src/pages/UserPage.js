import React, { useState, useEffect } from 'react'
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import api, { apiSetHeader } from "../services/api";
import { useNavigate } from 'react-router-dom';

function UserPage() {

  const [userInfo, setUserInfo] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo();
  }, []);

  async function getUserInfo() {
      if (localStorage.getItem("access") !== null) {
        apiSetHeader("Bearer", `${localStorage.getItem("access")}`);
        const res = await api.get("user_info");
        setUserInfo(res.data.user);
        navigate('/');
      } else {
        navigate("/login");
      }
  }

  function logout() {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <Box
      w="400px"
      borderWidth='2px' 
      borderRadius='lg' 
      overflow='hidden'
      px="50px"
      py="70px"
    >
        <Heading>Информация о пользователе</Heading> 
        <Text mt="20px">{userInfo}</Text>
        <Button mt="20px" w="100%" colorScheme="red" onClick={() => logout()}>Выйти</Button>
    </Box>
  )
}

export default UserPage