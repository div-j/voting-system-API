const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Voting App API',
      version: '1.0.0',
      description: 'API documentation for the Voting App',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['fullName', 'email', 'password'],
          properties: {
            id: {
              type: 'string',
              description: 'The auto-generated id of the user',
            },
            fullName: {
              type: 'string',
              description: 'User\'s full name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User\'s email address',
            },
            role: {
              type: 'string',
              enum: ['USER', 'SUPER_ADMIN'],
              description: 'User\'s role',
            },
            profilePicture: {
              type: 'string',
              description: 'URL to user\'s profile picture',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the user was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the user was last updated',
            },
          },
        },
        UserUpdate: {
          type: 'object',
          properties: {
            fullName: {
              type: 'string',
              description: 'User\'s full name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User\'s email address',
            },
            password: {
              type: 'string',
              description: 'User\'s password',
            },
            profilePicture: {
              type: 'string',
              format: 'binary',
              description: 'User\'s profile picture (JPEG, JPG, or PNG, max 2MB)',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs; 