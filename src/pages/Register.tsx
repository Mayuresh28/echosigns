import React from 'react'
import { useState } from 'react'
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
  Image,
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

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [googleLoading, setGoogleLoading] = useState(false)

  const cardBgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confirmPassword) {
      return toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }

    try {
      setLoading(true)
      await register(email, password)
      navigate('/meetings')
    } catch (error: any) {
      let errorMessage = 'Failed to create an account'
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already registered'
            break
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address'
            break
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password accounts are not enabled'
            break
          case 'auth/weak-password':
            errorMessage = 'Password should be at least 6 characters'
            break
          default:
            errorMessage = error.message || 'Failed to create an account'
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

  async function handleGoogleSignUp() {
    try {
      setGoogleLoading(true)
      await signInWithGoogle()
      navigate('/meetings')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Google sign-up failed',
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
                Create Account
              </Heading>
              <Text mt={2} color="whiteAlpha.800">
                Join us to get started with your journey
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

                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.800">Confirm Password</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      focusBorderColor="blue.300"
                      placeholder="Confirm your password"
                      bg="whiteAlpha.100"
                      color="white"
                      _placeholder={{ color: 'whiteAlpha.600' }}
                      borderColor="whiteAlpha.300"
                      _hover={{ borderColor: 'blue.300' }}
                    />
                    <InputRightElement>
                      <IconButton
                        variant="ghost"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  loadingText="Signing up..."
                  bg="white"
                  color="blue.600"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  Sign Up
                </Button>
                <Button
                  leftIcon={<FcGoogle />}
                  size="lg"
                  width="full"
                  isLoading={googleLoading}
                  loadingText="Signing up..."
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
                  onClick={handleGoogleSignUp}
                  type="button"
                >
                  Sign up with Google
                </Button>
              </VStack>
            </form>

            <Text textAlign="center" color="whiteAlpha.700">
              Already have an account?{' '}
              <Link
                as={RouterLink}
                to="/login"
                color="blue.300"
                fontWeight="semibold"
                _hover={{ color: 'blue.400' }}
              >
                Login
              </Link>
            </Text>
          </VStack>
        </MotionBox>
      </Container>
    </Flex>
  )
}