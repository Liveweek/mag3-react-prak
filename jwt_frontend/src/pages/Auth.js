import React, { useState } from 'react'
import axios from "axios"
import { Box, Button, ButtonGroup, Center, FormControl, FormLabel, HStack, Heading, Input, Spacer } from "@chakra-ui/react"
import { API_URL } from "../services/api"
import { useNavigate } from 'react-router-dom'


function Auth() {
  const [loginLogin, setLoginLogin] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const navigate = useNavigate();

  function login() {
    axios({
      method: "post",
      url: API_URL + "login",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": API_URL
      },
      withCredentials: true,
      data: {
        username: loginLogin,
        password: loginPassword,
      },
    })
      .then(function (response) {
        localStorage.setItem("access", response.data.access_token);
        navigate("/");
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
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
        <Heading size="lg">Авторизируйтесь</Heading>
        
        <FormControl mt="20px">
            <FormLabel>Логин</FormLabel>
            <Input 
                placeholder='Введите логин...' 
                onChange={(e) => setLoginLogin(e.target.value)}
            />
        </FormControl>

        <FormControl mt="10px">
            <FormLabel>Пароль</FormLabel>
            <Input 
                type="password" 
                placeholder='Введите пароль...' 
                onChange={(e) => setLoginPassword(e.target.value)}
            />
        </FormControl>

        <Button mt="15px" colorScheme='blue' w="100%" onClick={() => login()}>Войти</Button>
        <Button mt="15px" colorScheme='red' w="100%" onClick={() => navigate('/register')}>Зарегистрироваться</Button>
    </Box>
  )
}

export default Auth