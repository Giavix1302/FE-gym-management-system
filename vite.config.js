import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  define: {
    // eslint-disable-next-line no-undef
    "process.env.BUILD_MODE": JSON.stringify(process.env.BUILD_MODE),
  },
  plugins: [react()],
  // base: './'
  resolve: {
    alias: [{ find: "~", replacement: "/src" }],
  },
})
