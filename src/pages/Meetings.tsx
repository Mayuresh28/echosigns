import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Button,
  VStack,
  Heading,
  Input,
  useToast,
  Text,
  HStack,
  Container,
  useColorModeValue,
  Flex,
  Icon,
  Card,
  CardBody,
  InputGroup,
  SimpleGrid,
} from '@chakra-ui/react'
import { FaVideo, FaUsers } from 'react-icons/fa'
import { io, Socket } from 'socket.io-client'
import { useNavigate, Link, useLocation } from 'react-router-dom'

export default function Meetings() {
  const [userName, setUserName] = useState('')
  const toast = useToast()
  const bgColor = '#18181b'
  const cardBgColor = '#27272a'
  const textColor = '#fff'
  const socketRef = useRef<Socket | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const ROOM_CODE = 'xgs-zxpu-ihz'
  const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoyLCJ0eXBlIjoiYXBwIiwiYXBwX2RhdGEiOm51bGwsImFjY2Vzc19rZXkiOiI2ODUwYjNkZTE0NWNiNGU4NDQ5YWZjYjEiLCJyb2xlIjoiaG9zdCIsInJvb21faWQiOiI2ODUwYjNlYWE0OGNhNjFjNDY0NzQxM2IiLCJ1c2VyX2lkIjoiZGY0YTFhMDgtYTEwZS00OTM0LWFjYTAtMGRiODIxMzBiNDZkIiwiZXhwIjoxNzUwMzQzMDg2LCJqdGkiOiJlYjEzNDBhNy0wYWZjLTRkN2MtOGFlOS1lMGZmZTJmODMzZTYiLCJpYXQiOjE3NTAyNTY2ODYsImlzcyI6IjY4NTBiM2RlMTQ1Y2I0ZTg0NDlhZmNhZiIsIm5iZiI6MTc1MDI1NjY4Niwic3ViIjoiYXBpIn0.U4JcegU_zXBELJsRHI2IuGWx5waQ8raYuzOj2O2TXBo'

  useEffect(() => {
    // Connect to Flask-SocketIO backend
    const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      reconnection: true,
    })
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Connected to backend')
    })
    socket.on('disconnect', () => {
      console.log('Disconnected from backend')
    })
    socket.on('connect_error', (err) => {
      console.error('Connection error:', err)
    })
    return () => {
      socket.disconnect()
    }
  }, [])

  const handleStartMeeting = () => {
    if (!userName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your name',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    navigate(
      `/meeting?room=${ROOM_CODE}&name=${encodeURIComponent(
        userName
      )}&auth=${AUTH_TOKEN}`
    )
  }

  return (
    <Box bg={bgColor} minH="100vh" width="100vw" overflowX="hidden">
      {/* Navbar */}
      <Flex as="nav" bg={cardBgColor} boxShadow="md" px={8} py={4} mb={8} borderRadius="xl" align="center" justify="center" gap={8}>
        <Button
          as={Link}
          to="/meetings"
          variant="ghost"
          color={textColor}
          fontWeight="bold"
          fontSize="xl"
          _hover={{ bg: '#32323a' }}
        >
          Meetings
        </Button>
        <Button
          as={Link}
          to="/learn"
          variant="ghost"
          color={textColor}
          fontWeight="bold"
          fontSize="xl"
          _hover={{ bg: '#32323a' }}
        >
          Learn
        </Button>
      </Flex>
      <Box
        minH="100vh"
        width="100vw"
        position="relative"
        zIndex="1"
        bg={bgColor}
      >
        <Box maxW="container.xl" mx="auto" px={8}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align="center"
            justify="space-between"
            minH="100vh"
            py={20}
            gap={8}
            bg={bgColor}
          >
            <VStack spacing={8} align="stretch">
              <Box textAlign="center">
                <Heading
                  size="xl"
                  bgGradient="linear(to-r, blue.400, purple.500)"
                  bgClip="text"
                  fontWeight="extrabold"
                >
                  Start a Meeting
                </Heading>
                <Text mt={2} fontSize="xl" color={textColor}>
                  Create or join a video meeting with sign language support
                </Text>
              </Box>
              <Card bg={cardBgColor} borderRadius="xl" boxShadow="xl">
                <CardBody>
                  <VStack spacing={6}>
                    <HStack spacing={4} w="full">
                      <Icon as={FaVideo} w={8} h={8} color="blue.500" />
                      <Text fontSize="lg" fontWeight="medium" color={textColor}>
                        Enter your name to start or join a meeting
                      </Text>
                    </HStack>
                    <InputGroup size="lg">
                      <Input
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        focusBorderColor="blue.400"
                      />
                    </InputGroup>

                    <Button
                      size="lg"
                      colorScheme="blue"
                      width="full"
                      onClick={handleStartMeeting}
                      bgGradient="linear(to-r, blue.400, purple.500)"
                      _hover={{
                        bgGradient: 'linear(to-r, blue.500, purple.600)',
                      }}
                      leftIcon={<Icon as={FaUsers} />}
                    >
                      Join Meeting
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={8}>
                <Card bg={cardBgColor} borderRadius="xl" boxShadow="xl">
                  <CardBody>
                    <VStack spacing={4}>
                      <Icon as={FaVideo} w={8} h={8} color="blue.500" />
                      <Heading size="md" color={textColor}>Video Calls</Heading>
                      <Text color={textColor} textAlign="center">
                        High-quality video calls with sign language support
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
                <Card bg={cardBgColor} borderRadius="xl" boxShadow="xl">
                  <CardBody>
                    <VStack spacing={4}>
                      <Icon as={FaUsers} w={8} h={8} color="green.500" />
                      <Heading size="md" color={textColor}>Collaboration</Heading>
                      <Text color={textColor} textAlign="center">
                        Work together with real-time communication
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
                <Card bg={cardBgColor} borderRadius="xl" boxShadow="xl">
                  <CardBody>
                    <VStack spacing={4}>
                      <Icon as={FaVideo} w={8} h={8} color="purple.500" />
                      <Heading size="md" color={textColor}>Easy Sharing</Heading>
                      <Text color={textColor} textAlign="center">
                        Share meeting links with just one click
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </VStack>
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}