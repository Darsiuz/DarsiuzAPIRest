export const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Estudiantes UTP",
            version: "1.0.2",
            description: "Una API documentada con Swagger para gestionar estudiantes.",
            contact: {
                name: "Soporte Tecnico Darsiuz",
                email: "spd@utp.pe",
            },
        },
        components: {
            securitySchemes: {
                SecretKeyAuth: {
                    type: "apiKey",
                    in: "header",
                    name: "x-secret-key",
                }
            }
        },
        security: [
            {
                SecretKeyAuth: []
            }
        ],
        servers: [
            {
                url: "http://localhost:4000",
                description: "Servidor Local de Desarrollo",
            },
        ],
    },
    apis: [
        "./src/index.ts",
        "./src/routes/*.ts"
    ]
};