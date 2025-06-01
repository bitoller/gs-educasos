import { theme as baseTheme } from '@chakra-ui/theme';

const theme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    brand: {
      50: '#E6F6FF',
      100: '#BAE3FF',
      200: '#7CC4FA',
      300: '#47A3F3',
      400: '#2186EB',
      500: '#0967D2',
      600: '#0552B5',
      700: '#03449E',
      800: '#01337D',
      900: '#002159',
    },
    warning: {
      50: '#FFFBEA',
      100: '#FFF3C4',
      200: '#FCE588',
      300: '#FADB5F',
      400: '#F7C948',
      500: '#F0B429',
      600: '#DE911D',
      700: '#CB6E17',
      800: '#B44D12',
      900: '#8D2B0B',
    },
    danger: {
      50: '#FFE3E3',
      100: '#FFBDBD',
      200: '#FF9B9B',
      300: '#F86A6A',
      400: '#EF4E4E',
      500: '#E12D39',
      600: '#CF1124',
      700: '#AB091E',
      800: '#8A041A',
      900: '#610316',
    },
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        outline: {
          border: '2px solid',
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
          },
        },
      },
    },
  },
};

export default theme; 