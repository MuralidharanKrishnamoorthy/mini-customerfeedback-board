# FeedbackHub Frontend

A modern, responsive frontend for the Mini Product Feedback Board built with React.js, TailwindCSS, and Axios.

## 🚀 Features

### 🏠 Home Page
- **Hero Section**: Welcome message with brand logo and call-to-action
- **Feedback Cards**: Display all feedback items with category badges, status indicators, and upvote counts
- **Filtering & Search**: Filter by category and status, search by title/description
- **Responsive Grid**: Clean card layout that adapts to different screen sizes
- **Status Grouping**: Separate "Active Feedback" and "Recently Resolved" sections

### 📝 Submit Feedback Page
- **Modern Form**: Clean, accessible form with validation
- **Category Selection**: Radio button interface for Feature, Bug, and UI categories
- **Real-time Validation**: Character counters and field validation
- **Success Feedback**: Automatic redirect with success notification

### 💬 Feedback Detail Page
- **Full Information**: Complete feedback details with metadata
- **Upvote Functionality**: Interactive upvote button with loading states
- **Comments Section**: Add and view comments (local state management)
- **Responsive Design**: Optimized for all device sizes

### 🎨 Design System
- **Modern UI**: Inspired by Canny.io and Productboard
- **TailwindCSS**: Utility-first styling with custom components
- **Typography**: Poppins for headings, Inter for body text
- **Color Scheme**: Indigo primary with gray neutrals
- **Animations**: Smooth transitions and loading states

## 🛠️ Technology Stack

- **React 19**: Latest React with hooks and modern patterns
- **React Router**: Client-side routing
- **TailwindCSS 4**: Utility-first CSS framework
- **Axios**: HTTP client for API communication
- **Vite**: Fast build tool and development server

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- Backend server running (see backend setup below)

### Backend Setup
1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create .env file** in backend root:
   ```env
   PORT=8000
   MONGODB_URL=mongodb://localhost:27017/feedback-board
   ```

4. **Start backend server**:
   ```bash
   npm start
   ```

### Frontend Setup
1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Backend API
The frontend connects to the backend API at `http://localhost:8000/api/feedbacks`. The backend server runs on port 8000 by default.

### Environment Variables
Create a `.env` file in the frontend root (optional):
```env
VITE_API_BASE_URL=http://localhost:8000/api/feedbacks
```

## 📁 Project Structure

```
mini-feedback-board/
├── backend/                 # Backend server
│   ├── config/
│   │   └── db.js           # Database configuration
│   │   └── feedbackController.js
│   │   └── Feedback.js
│   │   └── feedbackRoutes.js
│   │   └── app.js          # Express app setup
│   └── server.js           # Server entry point
└── frontend/               # Frontend application
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── pages/         # Page components
    │   ├── services/      # API services
    │   ├── App.jsx        # Main app component
    │   ├── main.jsx       # Entry point
    │   └── index.css      # Global styles
    ├── tailwind.config.js # TailwindCSS configuration
    └── package.json
```

## 🎯 API Integration

The frontend integrates with the following backend endpoints:

- `GET /api/feedbacks` - Fetch all feedbacks
- `GET /api/feedbacks/:id` - Fetch single feedback
- `POST /api/feedbacks` - Create new feedback
- `PATCH /api/feedbacks/:id/upvote` - Upvote feedback
- `PATCH /api/feedbacks/:id/status` - Update feedback status

## 🎨 Design Features

### Color Palette
- **Primary**: Indigo (#4f46e5)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)
- **Neutral**: Gray scale (#f9fafb to #111827)

### Typography
- **Headings**: Poppins (300, 400, 500, 600, 700)
- **Body**: Inter (300, 400, 500, 600)

### Components
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Primary and secondary variants with loading states
- **Forms**: Clean inputs with focus states and validation
- **Badges**: Category and status indicators with color coding

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🚀 Performance Features

- **Code Splitting**: Route-based code splitting
- **Optimized Images**: SVG icons and optimized assets
- **Lazy Loading**: Components load as needed
- **Efficient State Management**: Local state with React hooks

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- ESLint configuration for React
- Prettier formatting
- Consistent component structure

## 🔮 Future Enhancements

- [ ] User authentication and profiles
- [ ] Real-time notifications
- [ ] Advanced filtering and sorting
- [ ] Export functionality
- [ ] Dark mode support
- [ ] PWA capabilities
- [ ] Internationalization (i18n)

## 📄 License

This project is part of the Mini Product Feedback Board assignment.
