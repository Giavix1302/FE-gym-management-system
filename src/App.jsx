import { Suspense, lazy } from "react"
import { Box, CircularProgress } from "@mui/material"
import { BrowserRouter as Router } from "react-router-dom"
import ChatbotProvider from "~/components/ChatbotProvider"

const AppRoutes = lazy(() => import("./routers"))

function App() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <Router>
        <ChatbotProvider>
          <AppRoutes />
        </ChatbotProvider>
      </Router>
    </Suspense>
  )
}

export default App
