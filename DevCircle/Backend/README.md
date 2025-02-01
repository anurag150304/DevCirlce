# Backend

## `app.js`

The main entry point for the backend application. It sets up the Express app, connects to the database, and configures middleware and routes.

## `server.js`

Creates an HTTP server and initializes Socket.IO for real-time communication.

## `socket.js`

Initializes Socket.IO and handles real-time communication, including user authentication and project-specific messaging.

## Controllers

- `genie.controller.js`: Handles requests related to the Genie AI service.
- `project.controller.js`: Manages project-related operations.
- `user.controller.js`: Manages user-related operations.

## Services

- `genie.service.js`: Interacts with the Google Generative AI API.
- `project.service.js`: Contains business logic for project management.
- `redis.service.js`: Manages Redis interactions.
- `user.service.js`: Contains business logic for user management.

## Models

- `project.model.js`: Defines the schema for projects.
- `user.model.js`: Defines the schema for users.

## Routes

- `genie.route.js`: Routes for Genie AI-related endpoints.
- `project.route.js`: Routes for project-related endpoints.
- `user.route.js`: Routes for user-related endpoints.

## Middlewares

- `user.auth.js`: Middleware for user authentication.

## Database

- `config.js`: Database connection configuration.