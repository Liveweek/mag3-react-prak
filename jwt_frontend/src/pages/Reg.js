import React, { useState } from 'react'
import axios from "axios"
import { Box, Button, ButtonGroup, FormControl, FormLabel, Heading, Input, Spacer, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'



import { API_URL } from "../services/api";

function Reg() {
  const [signupLogin, setSignupLogin] = useState("")
  const [signupPass, setSignupPass] = useState("")
  const [signupLoginInfo, setSignupLoginInfo] = useState("")
  const toast = useToast()
  const navigate = useNavigate()

  function register() {
    axios({
      method: "post",
      url: API_URL + "register",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        username: signupLogin,
        password: signupPass,
        user_information: signupLoginInfo
      },
    })
      .then(function (response) {
        toast({
          title: 'Аккаунт создан успешно',
          description: "Теперь можно перейти на /login для входа",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
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
        <Heading size="lg">Регистрация</Heading>
        
        <FormControl mt="20px" isRequired>
            <FormLabel>Логин</FormLabel>
            <Input 
                placeholder='Введите логин...'
                onChange={(e) => setSignupLogin(e.target.value)}
            />
        </FormControl>
        <FormControl isRequired mt="10px">
          <FormLabel>Информация о пользователе</FormLabel>
          <Input placeholder='Информация о пользователе...'
            onChange={(e) => setSignupLoginInfo(e.target.value)}
          />
        </FormControl>

        <FormControl mt="10px" isRequired>
            <FormLabel>Пароль</FormLabel>
            <Input 
                type="password" 
                placeholder='Введите пароль...' 
                onChange={(e) => setSignupPass(e.target.value)}
            />
        </FormControl>


        <Button colorScheme='red' w="100%" mt="10px" onClick={() => register()}>Регистрация</Button>
        <Button colorScheme='blue' w="100%" mt="10px" onClick={() => navigate('/login')}>Обратно на вход</Button>
        

    </Box>
  )
}

export default Reg