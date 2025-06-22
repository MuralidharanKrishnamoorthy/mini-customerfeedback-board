# Insightify - Customer Feedback Board

A full-stack web application for managing customer feedback with user authentication, real-time interactions, and admin dashboard functionality.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Application Workflow](#application-workflow)
- [API Documentation](#api-documentation)
- [Features](#features)

## Project Overview

Insightify is a customer feedback management system that allows users to submit, view, and interact with feedback items. The application features user authentication, role-based access control, real-time commenting, and an admin dashboard for feedback management.

### Key Features
- User registration and authentication
- Feedback submission and categorization
- Real-time commenting and replies
- Upvoting system with duplicate prevention
- Admin dashboard with search and management tools
- Responsive design with custom animations

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: ODM library for MongoDB
- **jsonwebtoken (JWT)**: User authentication
- **bcryptjs**: Password hashing
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Environment variables management

### Frontend
- **React.js**: Frontend JavaScript library
- **Vite**: Build tool and development server
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client for API requests
- **Lucide React**: Icon library
- **ESLint**: Code linting

## Project Structure

```
mini-customerfeedback-board/
├── backend/                          # Backend Node.js/Express application
│   ├── config/
│   │   └── db.js                     # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js         # Authentication logic (login/register)
│   │   └── feedbackController.js     # Feedback CRUD operations
│   ├── middlewares/
│   │   └── auth.js                   # JWT authentication middleware
│   ├── models/
│   │   ├── User.js                   # User schema and model
│   │   └── Feedback.js               # Feedback schema and model
│   ├── routes/
│   │   ├── authRoutes.js             # Authentication routes
│   │   └── feedbackRoutes.js         # Feedback API routes
│   ├── app.js                        # Express app configuration
│   ├── server.js                     # Server entry point
│   ├── package.json                  # Backend dependencies
│   └── README.md                     # Backend documentation
├── frontend/                         # Frontend React.js application
│   ├── public/
│   │   └── vite.svg                  # Application icon
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── CommentInput.jsx      # Comment input component
│   │   │   ├── FeedbackCard.jsx      # Individual feedback card
│   │   │   ├── FilterBar.jsx         # Filter and sort controls
│   │   │   ├── LoadingAnimation.jsx  # Custom loading spinner
│   │   │   ├── Navbar.jsx            # Navigation bar
│   │   │   └── UpvoteButton.jsx      # Upvote functionality
│   │   ├── pages/                    # Page components
│   │   │   ├── Admin.jsx             # Admin dashboard
│   │   │   ├── Detail.jsx            # Feedback detail view
│   │   │   ├── Home.jsx              # Main landing page
│   │   │   ├── Login.jsx             # User login
│   │   │   ├── Register.jsx          # User registration
│   │   │   ├── Submit.jsx            # Submit new feedback
│   │   │   └── UserFeedback.jsx      # User's own feedback
│   │   ├── services/
│   │   │   └── feedbackApi.js        # API endpoints and axios config
│   │   ├── assets/                   # Static assets
│   │   ├── App.jsx                   # Main application component
│   │   ├── main.jsx                  # Application entry point
│   │   ├── index.css                 # Global styles
│   │   └── App.css                   # App-specific styles
│   ├── index.html                    # HTML template
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── eslint.config.js              # ESLint configuration
│   └── README.md                     # Frontend documentation
└── README.md                         # This file
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a MongoDB Atlas cluster

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MuralidharanKrishnamoorthy/mini-customerfeedback-board.git
   cd mini-customerfeedback-board
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

## Configuration

### Backend Configuration
1. Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

### Frontend Configuration
1. Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

## Running the Application

### Backend Server
```bash
cd backend
npm run dev    # Development mode with auto-reload
# or
npm start      # Production mode
```
The backend server will run at `http://localhost:5000`

### Frontend Application
```bash
cd frontend
npm run dev    # Development mode
```
The frontend application will run at `http://localhost:5173`

## Application Workflow

### 1. User Authentication
- **Registration**: Users register via `/register` page with username and password
- **Login**: Users login via `/login` page (supports regular users and admin)
- **Session Management**: JWT tokens stored in localStorage with automatic refresh
- **Role-based Access**: Different features available for users vs admins

### 2. Main Application Flow
- **Home Page**: Displays all feedback items with filtering and sorting options
- **Feedback Submission**: Users can create new feedback with title, description, and category
- **Feedback Interaction**: Users can upvote, comment, and reply to feedback items
- **Detail View**: Complete feedback information with all comments and replies

### 3. Admin Dashboard
- **Universal Search**: Search across all feedback items
- **Status Management**: Update feedback status (Open, Planned, In Progress, Done)
- **Content Management**: Delete feedback with confirmation modal
- **Real-time Updates**: Immediate reflection of changes

### 4. Data Flow
- **API Layer**: Centralized API calls through axios interceptors
- **State Management**: React hooks for local component state
- **Database**: MongoDB with Mongoose ODM for data persistence
- **Authentication**: JWT-based authentication with middleware protection

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (supports admin/admin)

### Feedback Endpoints
- `GET /api/feedback` - Get all feedback (with optional filters)
- `POST /api/feedback` - Create new feedback
- `GET /api/feedback/:id` - Get specific feedback
- `DELETE /api/feedback/:id` - Delete feedback (admin only)
- `POST /api/feedback/:id/upvote` - Upvote feedback
- `PUT /api/feedback/:id/status` - Update status (admin only)
- `POST /api/feedback/:id/comments` - Add comment
- `POST /api/feedback/:id/comments/:commentId/reply` - Add reply to comment

### Query Parameters
- `status`: Filter by status (Open, Planned, In Progress, Done)
- `category`: Filter by category (Feature, Bug, UI)
- `sort`: Sort by upvotes
- `search`: Search by title (case-insensitive)
- `createdBy`: Filter by user ID

## Features

### User Features
- **Authentication**: Secure registration and login system
- **Feedback Management**: Create, view, and interact with feedback
- **Categorization**: Organize feedback by type (Feature, Bug, UI)
- **Voting System**: Upvote feedback with duplicate prevention
- **Comments**: Add comments and replies to feedback items
- **Filtering**: Filter and sort feedback by various criteria

### Admin Features
- **Dashboard**: Comprehensive admin interface
- **Search**: Universal search across all feedback
- **Status Management**: Update feedback status
- **Content Moderation**: Delete inappropriate feedback
- **User Management**: View and manage user-generated content

### Technical Features
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Immediate reflection of user actions
- **Loading Animations**: Custom blue bouncing dots animation
- **Error Handling**: Comprehensive error handling and user feedback
- **Security**: JWT authentication with bcrypt password hashing
- **CORS Support**: Properly configured for development and production

### Styling
- **Inline Styles**: All components use JavaScript style objects
- **Custom Animations**: CSS keyframes for loading and hover effects
- **Typography**: Poppins font family for consistent design
- **Color Scheme**: Professional blue and gray color palette
- **Responsive Layout**: Grid-based responsive design

## Development Notes

- Backend uses Express.js with MongoDB/Mongoose
- Frontend uses React 19 with modern hooks
- All styling done with inline styles for consistency
- Custom loading animations provide better UX
- JWT tokens handle authentication state
- Axios interceptors manage API requests automatically
- Environment variables configure API endpoints 