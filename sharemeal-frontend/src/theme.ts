import { createTheme } from '@mui/material/styles';

const colors = {
  forest: '#20512F',
  forestDark: '#153A20',
  amber: '#F2A93B',
  amberDark: '#D98A1C',
  paper: '#FBF8F2',
  paperAlt: '#F1EBDD',
  ink: '#1E241D',
  inkSoft: '#4B5647',
  danger: '#B23B3B',
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.forest,
      dark: colors.forestDark,
      light: '#3D7A50',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: colors.amber,
      dark: colors.amberDark,
      contrastText: colors.ink,
    },
    error: {
      main: colors.danger,
    },
    background: {
      default: colors.paper,
      paper: '#FFFFFF',
    },
    text: {
      primary: colors.ink,
      secondary: colors.inkSoft,
    },
  },
  typography: {
    fontFamily: '"Manrope", "Segoe UI", sans-serif',
    h1: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h2: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h3: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h4: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h5: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h6: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingLeft: 22,
          paddingRight: 22,
          paddingTop: 10,
          paddingBottom: 10,
        },
        containedPrimary: {
          boxShadow: '0 8px 20px -8px rgba(32, 81, 47, 0.55)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          border: `1px solid ${colors.paperAlt}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;
export { colors };
