import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import { ThemeProvider } from "@mui/material/styles"
import { theme } from "./theme.jsx"
import CssBaseline from "@mui/material/CssBaseline"
import { ToastContainer } from "react-toastify"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Tạo QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
        <ToastContainer autoClose={2000} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
