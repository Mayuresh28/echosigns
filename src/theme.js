import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#18181b',
      100: '#27272a',
      200: '#3f3f46',
      300: '#52525b',
      400: '#71717a',
      500: '#a1a1aa',
      600: '#d4d4d8',
      700: '#e4e4e7',
      800: '#f4f4f5',
      900: '#fafafa',
    },
    background: '#18181b',
    text: '#fff',
  },
  styles: {
    global: () => ({
      body: {
        bg: '#18181b',
        color: '#fff',
      },
      '*': {
        borderColor: '#27272a',
      },
    }),
  },
})

export default theme 