import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  Container,
  Flex,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { motion } from 'framer-motion'
import { FcGoogle } from 'react-icons/fc'

const MotionBox = motion(Box)
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [googleLoading, setGoogleLoading] = useState(false)

  const cardBgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      setLoading(true)
      await login(email, password)
      navigate('/meetings')
    } catch (error: any) {
      let errorMessage = 'Failed to log in'
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email'
            break
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password'
            break
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address'
            break
          default:
            errorMessage = error.message || 'Failed to log in'
        }
      }
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
    setLoading(false)
  }

  async function handleGoogleSignIn() {
    try {
      setGoogleLoading(true)
      await signInWithGoogle()
      navigate('/meetings')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Google sign-in failed',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
    setGoogleLoading(false)
  }

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      py={10}
    >
      <Container maxW="md" animation={`${fadeIn} 1s ease-out`}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          bgGradient="linear(to-br, whiteAlpha.200, whiteAlpha.100)" // Glassmorphism effect
          backdropFilter="blur(10px)"
          p={8}
          borderRadius="xl"
          boxShadow="2xl"
          border="1px solid rgba(255, 255, 255, 0.18)"
        >
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Heading
                size="xl"
                bgGradient="linear(to-r, white, blue.100)"
                bgClip="text"
                fontWeight="extrabold"
              >
                Welcome Back
              </Heading>
              <Text mt={2} color="whiteAlpha.800">
                Sign in to continue your journey
              </Text>
            </Box>

            <form onSubmit={handleSubmit}>
              <VStack spacing={5}>
                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.800">Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="lg"
                    focusBorderColor="blue.300"
                    placeholder="Enter your email"
                    bg="whiteAlpha.100"
                    color="white"
                    _placeholder={{ color: 'whiteAlpha.600' }}
                    borderColor="whiteAlpha.300"
                    _hover={{ borderColor: 'blue.300' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.800">Password</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      focusBorderColor="blue.300"
                      placeholder="Enter your password"
                      bg="whiteAlpha.100"
                      color="white"
                      _placeholder={{ color: 'whiteAlpha.600' }}
                      borderColor="whiteAlpha.300"
                      _hover={{ borderColor: 'blue.300' }}
                    />
                    <InputRightElement>
                      <IconButton
                        variant="ghost"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                        color="whiteAlpha.700"
                        _hover={{ color: 'white' }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  size="lg"
                  width="full"
                  isLoading={loading}
                  loadingText="Signing in..."
                  bg="white"
                  color="blue.600"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  Sign In
                </Button>
                <Button
                  leftIcon={<FcGoogle />}
                  size="lg"
                  width="full"
                  isLoading={googleLoading}
                  loadingText="Signing in..."
                  variant="outline"
                  borderColor="blue.400"
                  color={textColor}
                  fontWeight="bold"
                  boxShadow="md"
                  borderRadius="lg"
                  bg={cardBgColor}
                  _hover={{
                    bgGradient: 'linear(to-r, blue.500, purple.600)',
                    color: 'white',
                    borderColor: 'blue.500',
                    transform: 'scale(1.07)',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                  }}
                  _active={{
                    bgGradient: 'linear(to-r, blue.600, purple.700)',
                    color: 'white',
                    borderColor: 'blue.600',
                    transform: 'scale(0.98)',
                  }}
                  onClick={handleGoogleSignIn}
                  type="button"
                >
                  Sign in with Google
                </Button>
              </VStack>
            </form>

            <Text textAlign="center" color="whiteAlpha.700">
              Don't have an account?{' '}
              <Link
                as={RouterLink}
                to="/register"
                color="blue.300"
                fontWeight="semibold"
                _hover={{ color: 'blue.400' }}
              >
                Register
              </Link>
            </Text>
          </VStack>
        </MotionBox>
      </Container>
    </Flex>
  )
}