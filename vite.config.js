import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  define: {
    // eslint-disable-next-line no-undef
    "process.env.BUILD_MODE": JSON.stringify(process.env.BUILD_MODE),
  },
  plugins: [react()],
  server: {
    host: true, // Cho phép truy cập từ bất kỳ host nào
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok-free.app', // 👈 Cho phép TẤT CẢ subdomain của ngrok
      '.ngrok.io',
      '.ngrok.app'
    ],
  },
  resolve: {
    alias: [{ find: "~", replacement: "/src" }],
  },
})