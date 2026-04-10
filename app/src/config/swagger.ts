import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog Spot API",
      version: "1.0.0",
      description: "API documentation with Swagger",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: [
    `${__dirname}/../routes/**/*.ts`,
    `${__dirname}/../routes/**/*.js`,
  ],
};

const swaggerSpec = swaggerJSDoc(options);

console.log("SWAGGER LOADED PATHS:", Object.keys(swaggerSpec.paths || {}));

export default swaggerSpec;