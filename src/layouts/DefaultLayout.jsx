import { Box } from "@mui/material"
import { Outlet, Link } from "react-router-dom"
import Footer from "~/components/Footer"
import Header from "~/components/Header"

export default function DefaultLayout() {
  return (
    <div>
      <Header />

      <Box sx={{ pt: { xs: "64px", sm: "72px" } }}>
        <Outlet /> {/* Nơi render các page con */}
      </Box>

      <Footer />
    </div>
  )
}
