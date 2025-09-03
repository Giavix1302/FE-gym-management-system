import { createTheme } from "@mui/material/styles"
import {} from "@mui/material/colors"

export const theme = createTheme({
  palette: {
    primary: {
      main: "#16697A", // Xanh đậm
    },
    secondary: {
      main: "#489FB5", // Xanh sáng
    },
    info: {
      main: "#82C0CC", // Xanh nhạt
    },
    warning: {
      main: "#FFA62B", // Cam nhấn mạnh
    },
    background: {
      default: "#EDE7E3", // Nền sáng
      paper: "#ffffff", // Card/box nền trắng
    },
    text: {
      primary: "#212121", // chữ chính
      secondary: "#555555", // chữ phụ
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "*::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "#dcdde1",
            borderRadius: "8px",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#888",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderWidth: "0.5px",
          "&:hover": {
            borderWidth: "0.5px",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: "0.875rem" },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          "&.MuiTypography-body1": { fontSize: "0.875rem" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          // '.MuiOutlinedInput-notchedOutline': {
          //   borderColor: theme.palette.primary.main
          // },
          // '&:hover': {
          //   '.MuiOutlinedInput-notchedOutline': {
          //     borderColor: theme.palette.primary.main
          //   }
          // },
          "& fieldset": { borderWidth: "0.5px !important" },
          "&:hover fieldset": { borderWidth: "1px !important" },
          "&:Mui-focused fieldset": { borderWidth: "1px !important" },
        },
      },
    },
  },
})
