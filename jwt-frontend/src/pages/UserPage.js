import React, { useState, useEffect } from 'react'
import { Box, Heading, Text } from '@chakra-ui/react';
import api, { apiSetHeader } from "../services/api";

function UserPage({userInfo}) {

  async function checkToken() {
    try {
      apiSetHeader("Bearer", `${localStorage.getItem("access")}`);
      const res = await api.get("user_info");
    } catch (error) {
      console.log(error);
    }
  }
  function logout() {
    localStorage.clear();
  }
  console.log("Вот такие пироги, вот моё описание: " + userInfo)

  return (
    <Box
      w="25vw"
      borderWidth='2px' 
      borderRadius='lg' 
      overflow='hidden'
      px="50px"
      py="70px"
    >
        <Heading>Информация о пользователе</Heading> 
        <Text>{userInfo}</Text>
    </Box>
  )
}

export default UserPage