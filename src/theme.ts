import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea',
    },
    secondary: {
      main: '#03dac6',
    },
    background: {
      default: '#f9f9f9',
    },
  },
  typography: {
    fontFamily: `'Poppins', 'Roboto', sans-serif`,
  },
});

export default theme;
