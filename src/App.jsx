// App.jsx
import { Suspense, lazy } from "react"
import { Box, CircularProgress } from "@mui/material"
import { BrowserRouter as Router } from "react-router-dom"

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
        <AppRoutes />
      </Router>
    </Suspense>
  )
}

export default App
