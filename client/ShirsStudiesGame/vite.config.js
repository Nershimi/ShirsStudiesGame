// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import million from "million/compiler";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// export default defineConfig({
//   plugins: [million.vite({ auto: true }), react()],
// });
export default defineConfig({
  plugins: [million.vite({ auto: true }), react()],
  build: {
    outDir: "dist", // ודא שהתיקייה היא 'dist'
  },
  server: {
    host: "0.0.0.0", // Allow access from outside the container
    port: 3000, // Match the Dockerfile and docker-compose.yml ports
  },
});
