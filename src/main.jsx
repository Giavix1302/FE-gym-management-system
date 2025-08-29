import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import { ThemeProvider } from "@mui/material/styles"
import { theme } from "./theme.jsx"
import CssBaseline from "@mui/material/CssBaseline"
import { ToastContainer } from "react-toastify"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <ToastContainer autoClose={2000} />
    </ThemeProvider>
  </StrictMode>
)
