import { Box } from "@mui/material"
import { Outlet } from "react-router-dom"
import Header from "~/components/Header"

export default function UserLayout() {
  console.log("🔍 UserLayout rendering...")

  return (
    <div>
      <Header />
      <Box sx={{ pt: { xs: "64px", sm: "72px" } }}>
        <Outlet />
      </Box>
    </div>
  )
}
