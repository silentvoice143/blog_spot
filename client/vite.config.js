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
  // server: {
  //   host: getLocalIP(), // Use the local IP address
  //   port: 5173, // You can change this
  // },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
