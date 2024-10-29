# TaskManager - Express, TypeScript, Firestore

## Description

TaskManager is a backend project built using **Express**, **TypeScript**, and **Firestore**. It provides an API for users to sign up, log in, and manage their tasks. The core functionalities include creating, editing, updating, deleting, and retrieving tasks. The code follows best practices such as SOLID principles, clean code, and adheres to a well-organized project structure.

## Features

- **User Authentication**: Sign-up and login functionality for users.
- **Task Management**: Users can create, edit, update, delete, and retrieve tasks.
- **Firestore Database**: Firestore is used for data storage and management.

## Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher) or yarn
- Google Cloud Project with Firestore enabled

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd taskmanager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. Set up Firestore credentials:
   - Create a Google Cloud service account with Firestore permissions.
   - Download the JSON key file.
   - Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the path of your JSON key file:
     ```bash
     export GOOGLE_APPLICATION_CREDENTIALS="path/to/your/serviceAccountKey.json"
     ```

## Scripts

- **Build**: Compiles TypeScript code to JavaScript.
  ```bash
  npm run build
  ```

- **Start**: Starts the server using the compiled JavaScript files.
  ```bash
  npm start
  ```

- **Development**: Runs the server in development mode using `nodemon` and `ts-node` for hot-reloading.
  ```bash
  npm run dev
  ```

- **Test**: Runs the test suite with `jest`.
  ```bash
  npm test
  ```

- **Coverage**: Generates test coverage report.
  ```bash
  npm run coverage
  ```

## Project Structure

```
├── src
│   ├── config
│   │   ├── authMiddleware.ts
│   │   └── firestore.ts
│   ├── controllers
│   │   ├── authController.ts
│   │   └── taskController.ts
│   ├── models
│   │   └── Task.ts
│   │   └── User.ts
│   ├── routes
│   │   ├── index.ts
│   │   └── taskRoutes.ts
│   │   └── userRoutes.ts
│   ├── services
│   │   ├── taskService.ts
│   │   └── userService.ts
│   ├── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## API Endpoints

### Authentication
- **POST /users** - Create a new user account
- **POST /users/:email** - Login an existing user

### Task Management
- **POST /tasks** - Create a new task
- **GET /tasks** - Retrieve all tasks
- **GET /tasks/:id** - Retrieve a task by ID
- **PUT /tasks/:id** - Update a task by ID
- **DELETE /tasks/:id** - Delete a task by ID

## Environment Variables

Make sure to create a `.env` file to store the following variables:

```
FIREBASE_SERVICE_ACCOUNT=path/to/your/serviceAccountKey.json
JWT_SECRET
```

## Running the Project

1. Compile the TypeScript files:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

The server will be running at `http://localhost:3000` by default.

## Running in Development Mode

Use the `dev` script to run the project in development mode with hot-reloading:
```bash
npm run dev
```

## Testing

To run the tests, use:
```bash
npm test
```
To generate the coverage report:
```bash
npm run coverage
```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

