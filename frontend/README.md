# Frontend Documentation for Insightify

This document provides instructions for setting up and running the frontend React.js application for the Insightify customer feedback board.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Software Workflow](#software-workflow)
- [Key Features](#key-features)
- [Styling Approach](#styling-approach)
- [API Integration](#api-integration)

## Tech Stack

- **React.js**: Frontend JavaScript library for building user interfaces
- **Vite**: Build tool and development server
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client for API requests
- **Lucide React**: Icon library
- **ESLint**: Code linting

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Backend server running (see backend README for setup)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MuralidharanKrishnamoorthy/mini-customerfeedback-board.git
   cd mini-customerfeedback-board/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the `frontend` directory
2. Add the following environment variable:

   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

   - `VITE_API_BASE_URL`: The base URL for your backend API

## Running the Application

- **Development Mode:**
  ```bash
  npm run dev
  ```
  The application will be available at `http://localhost:5173` (or the next available port)

- **Build for Production:**
  ```bash
  npm run build
  ```

- **Preview Production Build:**
  ```bash
  npm run preview
  ```

- **Lint Code:**
  ```bash
  npm run lint
  ```

## Project Structure

```
frontend/
├── public/
│   └── vite.svg                 # Application icon
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── CommentInput.jsx     # Comment input component
│   │   ├── FeedbackCard.jsx     # Individual feedback card
│   │   ├── FilterBar.jsx        # Filter and sort controls
│   │   ├── LoadingAnimation.jsx # Custom loading spinner
│   │   ├── Navbar.jsx           # Navigation bar
│   │   └── UpvoteButton.jsx     # Upvote functionality
│   ├── pages/                   # Page components
│   │   ├── Admin.jsx            # Admin dashboard
│   │   ├── Detail.jsx           # Feedback detail view
│   │   ├── Home.jsx             # Main landing page
│   │   ├── Login.jsx            # User login
│   │   ├── Register.jsx         # User registration
│   │   ├── Submit.jsx           # Submit new feedback
│   │   └── UserFeedback.jsx     # User's own feedback
│   ├── services/                # API service layer
│   │   └── feedbackApi.js       # API endpoints and axios config
│   ├── assets/                  # Static assets
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # Application entry point
│   ├── index.css                # Global styles
│   └── App.css                  # App-specific styles
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── vite.config.js               # Vite configuration
└── eslint.config.js             # ESLint configuration
```

## Software Workflow

### Application Initialization
1. **Entry Point**: `main.jsx` renders the root App component
2. **App Component**: `App.jsx` sets up React Router with protected and public routes
3. **Layout Structure**: All pages (except login/register) use a common layout with Navbar

### User Authentication Flow
1. **Registration**: Users can register via `/register` page
   - Form validation for username and password
   - API call to `/auth/register` endpoint
   - Redirects to login on success

2. **Login**: Users can login via `/login` page
   - Supports both regular users and admin (admin/admin)
   - JWT token stored in localStorage
   - Automatic redirect to home page

3. **Authentication State**: 
   - User data stored in localStorage
   - Axios interceptors automatically add JWT token to requests
   - 401 errors trigger automatic logout and redirect

### Main Application Flow
1. **Home Page** (`Home.jsx`):
   - Fetches all feedback from API on component mount
   - Displays feedback cards in responsive grid
   - Provides filtering and sorting options
   - Handles upvoting with duplicate prevention

2. **Feedback Submission** (`Submit.jsx`):
   - Form for creating new feedback (title, description, category)
   - Category validation (Feature, Bug, UI)
   - Loading animation during submission
   - Redirects to home page on success

3. **Feedback Detail** (`Detail.jsx`):
   - Shows complete feedback information
   - Displays all comments and replies
   - Comment input with loading animation
   - Reply functionality for comments

### Admin Dashboard Flow
1. **Admin Access** (`Admin.jsx`):
   - Universal search across all feedback
   - Status update functionality
   - Delete feedback with confirmation modal
   - Real-time filtering and display

### Component Interactions
1. **Navbar**: 
   - Shows different links based on user role
   - Handles logout functionality
   - Responsive navigation

2. **FeedbackCard**: 
   - Displays individual feedback items
   - Handles upvote interactions
   - Shows status and category badges

3. **LoadingAnimation**: 
   - Custom blue bouncing dots animation
   - Used across all loading states
   - Configurable size and color

4. **CommentInput**: 
   - Reusable comment submission component
   - Loading state management
   - Form validation

### Data Flow
1. **API Layer**: `feedbackApi.js` centralizes all API calls
2. **State Management**: React hooks manage local component state
3. **Data Persistence**: User session stored in localStorage
4. **Real-time Updates**: Optimistic updates for better UX

## Key Features

### User Authentication
- User registration and login
- JWT token-based authentication
- Role-based access control (user/admin)
- Automatic token refresh and error handling

### Feedback Management
- Create, view, and manage feedback items
- Categorize feedback (Feature, Bug, UI)
- Status tracking (Open, Planned, In Progress, Done)
- Upvoting system with duplicate prevention

### Interactive Features
- Real-time comment system
- Reply functionality for comments
- Admin replies with special styling
- Loading animations for better UX

### Filtering and Sorting
- Filter by status, category, and user
- Sort by upvotes, date, and other criteria
- Search functionality
- Responsive grid layout

### Admin Dashboard
- Universal search across all feedback
- Bulk status updates
- Delete feedback with confirmation modal
- Comprehensive feedback overview

## Styling Approach

The application uses a comprehensive inline styling approach:

### Internal CSS (Inline Styles)
- All components use inline styles with JavaScript objects
- Consistent design system with reusable style objects
- Responsive design patterns
- Custom animations (e.g., loading dots animation with CSS keyframes)

### Typography
- Poppins font family from Google Fonts
- Consistent font weights and sizes
- Responsive typography

### Color Scheme
- Primary: Blue (#2563eb, #4f46e5)
- Secondary: Gray scale (#111827, #374151, #4b5563, #6b7280)
- Success: Green (#10b981)
- Error: Red (#ef4444)
- Background: Light gray (#f9fafb)

### Custom Animations
- Loading dots animation with CSS keyframes
- Hover effects and transitions
- Smooth state transitions

## API Integration

### Service Layer
- Centralized API configuration in `services/feedbackApi.js`
- Axios interceptors for authentication
- Automatic token handling
- Error handling and 401 redirects

### Key API Endpoints
- **Authentication**: `/auth/login`, `/auth/register`
- **Feedback**: `/feedback` (GET, POST, PUT, DELETE)
- **Comments**: `/feedback/:id/comments`
- **Replies**: `/feedback/:id/comments/:commentId/reply`
- **Upvotes**: `/feedback/:id/upvote`
- **Status Updates**: `/feedback/:id/status`

### State Management
- React hooks for local state management
- localStorage for user session persistence
- Optimistic updates for better UX
- Error boundaries and loading states

## Development Notes

- The application uses React 19 with modern hooks
- All styling is done with inline styles for consistency
- Custom loading animations provide better user feedback
- Responsive design works on desktop and mobile
- CORS is properly configured for development and production
- Environment variables are used for API configuration
