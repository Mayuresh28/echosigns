import { Box, Flex, useColorMode, IconButton, Link, Text } from '@chakra-ui/react'
import { Outlet, useNavigate } from 'react-router-dom'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <Box minH="100vh">
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bg={colorMode === 'dark' ? 'gray.700' : 'white'}
        color={colorMode === 'dark' ? 'white' : 'gray.800'}
        boxShadow="sm"
      >
        <Text fontSize="xl" fontWeight="bold">
          Echosigns
        </Text>
        <Flex align="center">
          <Link
            href="/meetings"
            mr={4}
            color={colorMode === 'dark' ? 'white' : 'gray.800'}
          >
            Meetings
          </Link>
          <Link
            href="/schedule"
            mr={4}
            color={colorMode === 'dark' ? 'white' : 'gray.800'}
          >
            Schedule
          </Link>
          <Link
            href="/learn"
            mr={4}
            color={colorMode === 'dark' ? 'white' : 'gray.800'}
          >
            Learn
          </Link>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
            mr={4}
          />
          <Link
            onClick={handleLogout}
            color={colorMode === 'dark' ? 'white' : 'gray.800'}
            cursor="pointer"
          >
            Logout
          </Link>
        </Flex>
      </Flex>
      <Box p={8}>
        <Outlet />
      </Box>
    </Box>
  )
}