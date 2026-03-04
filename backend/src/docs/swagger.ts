import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GlowTips API",
      version: "1.0.0",
      description: "Versioned REST API for GlowTips tipping and alerts platform"
    },
    servers: [{ url: "http://localhost:5000" }]
  },
  apis: []
});