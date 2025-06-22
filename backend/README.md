# Backend Documentation for Insightify

This document provides instructions for setting up and running the backend server for the Insightify customer feedback board application.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Feedback](#feedback)
- [Database Schema](#database-schema)
  - [User Schema](#user-schema)
  - [Feedback Schema](#feedback-schema)

## Tech Stack

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: ODM library for MongoDB
- **jsonwebtoken (JWT)**: For user authentication
- **bcryptjs**: For password hashing
- **cors**: For handling Cross-Origin Resource Sharing
- **dotenv**: For managing environment variables

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a MongoDB Atlas cluster.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/MuralidharanKrishnamoorthy/mini-customerfeedback-board.git
    cd mini-customerfeedback-board/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Configuration

1.  Create a `.env` file in the `backend` directory.
2.  Add the following environment variables to the `.env` file:

    ```env
    PORT=5000
    MONGODB_URL
    JWT_SECRET
    ```

    - `PORT`: The port on which the server will run (defaults to 5000).
    - `MONGODB_URL`: Your MongoDB connection URI.
    - `JWT_SECRET`: A secret key for signing JWTs.

## Running the Server

-   **Development Mode (with auto-reloading):**
    This command uses `nodemon` to automatically restart the server when file changes are detected.

    ```bash
    npm run dev
    ```

-   **Production Mode:**

    ```bash
    npm start
    ```

The server will be running at `http://localhost:5000` (or your specified `PORT`).

## API Endpoints

The base URL for all API endpoints is `/api`.

### Authentication

-   **`POST /auth/register`**: Register a new user.
    -   **Request Body**: `{ "username": "testuser", "password": "password123" }`
    -   **Response**: `{ "message": "User registered successfully" }`

-   **`POST /auth/login`**: Log in a user or admin.
    -   **Admin Login**: Use the hardcoded credentials (`username: "admin"`, `password: "admin"`).
    -   **User Login**: Use the credentials you registered with.
    -   **Request Body**: `{ "username": "user_or_admin", "password": "password" }`
    -   **Response**: `{ "userId": "...", "username": "...", "role": "...", "token": "..." }`

### Feedback

All feedback routes (except `GET`) require a valid JWT `token` in the `Authorization` header (`Bearer <token>`).

-   **`GET /feedback`**: Get all feedback items.
    -   **Query Params (Optional)**:
        -   `status`: Filter by status (`Open`, `Planned`, `In Progress`, `Done`)
        -   `category`: Filter by category (`Feature`, `Bug`, `UI`)
        -   `sort`: Sort by `upvotes`
        -   `search`: Search by title (case-insensitive)
        -   `createdBy`: Filter by user ID

-   **`POST /feedback`**: Create a new feedback item.
    -   **Request Body**: `{ "title": "New Feature", "description": "Details here", "category": "Feature" }`

-   **`GET /feedback/:id`**: Get a single feedback item by its ID.

-   **`DELETE /feedback/:id`**: Delete a feedback item (Admin only).

-   **`POST /feedback/:id/upvote`**: Upvote a feedback item.

-   **`PUT /feedback/:id/status`**: Update the status of a feedback item (Admin only).
    -   **Request Body**: `{ "status": "Planned" }`

-   **`POST /feedback/:id/comments`**: Add a comment to a feedback item.
    -   **Request Body**: `{ "text": "This is a comment." }`

-   **`POST /feedback/:id/comments/:commentId/reply`**: Add a reply to a comment.
    -   **Request Body**: `{ "text": "This is a reply." }`


## Database Schema

### User Schema

| Field    | Type     | Constraints              | Description                  |
| :------- | :------- | :----------------------- | :--------------------------- |
| `username` | `String` | `required`, `unique`     | The user's username.         |
| `password` | `String` | `required`               | The user's hashed password.  |
| `role`     | `String` | `enum: ['user', 'admin']`, `default: 'user'` | The user's role. |

### Feedback Schema

| Field         | Type       | Constraints/Description                                      |
| :------------ | :--------- | :----------------------------------------------------------- |
| `title`       | `String`   | `required`                                                   |
| `description` | `String`   | `required`                                                   |
| `category`    | `String`   | `required`, `enum: ['Feature', 'Bug', 'UI']`                 |
| `status`      | `String`   | `default: 'Open'`, `enum: ['Open', 'Planned', 'In Progress', 'Done']` |
| `upvotes`     | `Number`   | `default: 0`                                                 |
| `upvotedBy`   | `[ObjectId]` | `ref: 'User'`. Stores users who have upvoted.                |
| `createdAt`   | `Date`     | `default: Date.now`                                          |
| `createdBy`   | `ObjectId` | `ref: 'User'`. The user who created the feedback.            |
| `comments`    | `[CommentSchema]` | An array of comments on the feedback.               |

#### Comment Schema

| Field     | Type          | Description                                    |
| :-------- | :------------ | :--------------------------------------------- |
| `user`    | `ObjectId`    | `ref: 'User'`. The user who made the comment.  |
| `text`    | `String`      | `required`. The content of the comment.        |
| `author`  | `String`      | Stores the username for display purposes.      |
| `date`    | `Date`        | `default: Date.now`.                           |
| `replies` | `[ReplySchema]` | An array of replies to the comment.            |

#### Reply Schema

| Field       | Type       | Description                                  |
| :---------- | :--------- | :------------------------------------------- |
| `text`      | `String`   | `required`. The content of the reply.        |
| `createdBy` | `ObjectId` | `ref: 'User'`. The user who created the reply. |
| `author`    | `String`   | `default: 'Admin'` if an admin replies.      |
| `createdAt` | `Date`     | `default: Date.now`.                         |
