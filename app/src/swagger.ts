import path from "path";

// swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0", // Swagger version
    info: {
      title: "Blog Spot API",
      version: "1.0.0",
      description: "API documentation with Swagger",
    },
    servers: [
      {
        url: "http://localhost:5000", // your server URL
      },
    ],
  },
  // ✅ FIXED THIS LINE:
  apis: [path.join(__dirname, "./routes/**/*.ts")],
};

const swaggerSpec = swaggerJSDoc(options);
console.log("SWAGGER LOADED PATHS:", Object.keys(swaggerSpec.paths));
export default swaggerSpec;
