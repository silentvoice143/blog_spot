import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// @ts-ignore
import os from "os";
// @ts-ignore
import path from "path";

// function getLocalIP() {
//   const interfaces = os.networkInterfaces();
//   for (const interfaceName in interfaces) {
//     const networkInterface = interfaces[interfaceName];
//     for (const iface of networkInterface || []) {
//       if (iface.family === "IPv4" && !iface.internal) {
//         return iface.address;
//       }
//     }
//   }
//   return "localhost";
// }

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 3000,
    allowedHosts: ["blog-spot-client.onrender.com"],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
