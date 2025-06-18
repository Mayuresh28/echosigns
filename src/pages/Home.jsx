import React from 'react'
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useColorMode,
  SimpleGrid,
  Icon,
  Flex,
  Image,
  useColorModeValue,
  IconButton,
  HStack,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaVideo, FaCalendarAlt, FaBook, FaGithub, FaTwitter, FaLinkedin, FaHands } from 'react-icons/fa'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)
const MotionFlex = motion(Flex)

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

export default function Home() {
  const { colorMode } = useColorMode()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  const features = [
    {
      icon: FaVideo,
      title: 'Video Meetings',
      description: 'Join or create video meetings with sign language support',
      gradient: 'linear(to-r, blue.400, purple.500)',
    },
    {
      icon: FaCalendarAlt,
      title: 'Schedule',
      description: 'Schedule meetings and manage your calendar',
      gradient: 'linear(to-r, green.400, teal.500)',
    },
    {
      icon: FaBook,
      title: 'Learn',
      description: 'Learn American Sign Language through interactive lessons',
      gradient: 'linear(to-r, orange.400, red.500)',
    },
  ]

  return (
    <Box bgGradient="linear(to-br, #1e002e, #000000)" minH="100vh" width="100vw" overflowX="hidden">
      {/* Animated background shapes */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.1"
        backgroundImage="radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2) 0%, transparent 50%)"
      />

      {/* Hero Content Section */}
      <Box
        minH="100vh" // Ensure content area is full height
        width="100vw" // Ensure content area is full width to house the centered content
        position="relative"
        zIndex="1"
      >
        <Box maxW="container.xl" mx="auto" px={8}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align="center"
            justify="space-between"
            minH="100vh"
            py={20}
            gap={8}
          >
            <VStack
              spacing={8}
              align={{ base: 'center', md: 'flex-start' }}
              textAlign={{ base: 'center', md: 'left' }}
              maxW="2xl"
              animation={`${fadeIn} 1s ease-out`}
            >
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
              <Heading
                  size="3xl"
                fontWeight="extrabold"
                  bgGradient="linear(to-r, white, blue.100)"
                bgClip="text"
                  lineHeight="1.2"
                >
                  Breaking Barriers with Sign Language
                </Heading>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Text fontSize="xl" color="whiteAlpha.900" maxW="xl">
                  Experience seamless communication through our innovative video calling platform,
                  designed specifically for the deaf and hard of hearing community.
              </Text>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <HStack spacing={6}>
                <Button
                  as={RouterLink}
                  to="/register"
                  size="lg"
                  px={8}
                  bg="white"
                  color="blue.600"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    transition="all 0.2s"
                >
                  Get Started
                </Button>
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="outline"
                  size="lg"
                  px={8}
                  borderColor="white"
                  color="white"
                    _hover={{ bg: 'whiteAlpha.200', transform: 'translateY(-2px)' }}
                    transition="all 0.2s"
                >
                  Login
                </Button>
              </HStack>
              </MotionBox>
            </VStack>

            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              animation={`${floatAnimation} 6s ease-in-out infinite`}
            >
              <Box
                position="relative"
                w={{ base: '300px', md: '400px' }}
                h={{ base: '300px', md: '400px' }}
                borderRadius="full"
                bgGradient="linear(to-br, whiteAlpha.200, whiteAlpha.100)"
                backdropFilter="blur(10px)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="2xl"
              >
                  <Icon
                  as={FaHands}
                  w={{ base: '150px', md: '200px' }}
                  h={{ base: '150px', md: '200px' }}
                  color="whiteAlpha.900"
                />
              </Box>
            </MotionBox>
          </Flex>
        </Box>
      </Box>

      {/* Features Section */}
    </Box>
  )
}