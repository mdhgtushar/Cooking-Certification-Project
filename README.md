# Cooking Certification Project

A comprehensive web application for managing cooking certification courses, applications, exams, and certificates. Built with React frontend and Node.js/Express backend with MongoDB database.

## 🚀 Features

### User Features
- **User Registration & Authentication** - Secure user registration and login system
- **Course Browsing** - Browse available cooking certification courses
- **Application Management** - Submit and track course applications
- **Exam Management** - Take exams and view results
- **Certificate Management** - View and download earned certificates
- **Profile Management** - Update personal information and preferences

### Admin Features
- **Dashboard Analytics** - Comprehensive system analytics and statistics
- **User Management** - Manage user accounts, roles, and permissions
- **Application Management** - Review and approve/reject course applications
- **Exam Management** - Create, schedule, and grade exams
- **Certificate Management** - Generate and manage certificates
- **Course Management** - Create and manage certification courses
- **Contact Management** - Handle user inquiries and support requests

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Redux Toolkit** - State management with RTK Query
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Router** - Client-side routing
- **React Toastify** - Toast notifications
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Cooking-Certification-Project/
├── api/                          # Backend API
│   ├── config/                   # Configuration files
│   ├── features/                 # Feature modules
│   │   ├── admin/               # Admin functionality
│   │   ├── application/         # Application management
│   │   ├── certificate/         # Certificate management
│   │   ├── contact/             # Contact management
│   │   ├── course/              # Course management
│   │   ├── exam/                # Exam management
│   │   └── user/                # User management
│   ├── middleware/              # Custom middleware
│   ├── utils/                   # Utility functions
│   └── index.js                 # Main server file
├── frontend/                     # React frontend
│   ├── public/                  # Static files
│   ├── src/                     # Source code
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   │   ├── admin/           # Admin pages
│   │   │   ├── applications/    # Application pages
│   │   │   ├── auth/            # Authentication pages
│   │   │   ├── certificates/    # Certificate pages
│   │   │   ├── courses/         # Course pages
│   │   │   ├── exams/           # Exam pages
│   │   │   └── user/            # User pages
│   │   ├── services/            # API services
│   │   ├── store/               # Redux store and slices
│   │   └── utils/               # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Cooking-Certification-Project
   ```

2. **Install backend dependencies**
   ```bash
   cd api
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the `api` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cooking-certification
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRE=30d
   ```

5. **Database Setup**
   - Start MongoDB service
   - The application will automatically create collections on first run

6. **Create Admin User**
   ```bash
   cd api
   node create-admin-user.js
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd api
   npm start
   ```
   The API will be available at `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   The application will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/applications` - Get all applications
- `GET /api/admin/exam-results` - Get all exam results
- `GET /api/admin/certificates` - Get all certificates
- `POST /api/admin/applications` - Create application (admin)
- `POST /api/admin/exam-results` - Create exam (admin)
- `POST /api/admin/certificates` - Create certificate (admin)

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/applications` - Get user applications
- `GET /api/users/exams` - Get user exams
- `GET /api/users/certificates` - Get user certificates

### Course Endpoints
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (admin/instructor)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

## 🔐 Authentication & Authorization

The application uses JWT (JSON Web Tokens) for authentication. Users are assigned roles:
- **user** - Regular users who can apply for courses and take exams
- **admin** - Administrators with full system access
- **instructor** - Course instructors (future feature)

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Modern UI** - Clean and intuitive interface using Tailwind CSS
- **Real-time Updates** - Live updates using Redux state management
- **Toast Notifications** - User-friendly feedback messages
- **Loading States** - Smooth loading indicators
- **Error Handling** - Comprehensive error handling and user feedback

## 🧪 Testing

### Backend Testing
```bash
cd api
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, Vercel, or your preferred platform

### Frontend Deployment
1. Build the production version:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `build` folder to Netlify, Vercel, or your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🔄 Version History

- **v1.0.0** - Initial release with basic functionality
- **v1.1.0** - Added admin panel and management features
- **v1.2.0** - Enhanced UI/UX and added certificate management
- **v1.3.0** - Added exam management and result tracking

---

**Note**: This is a development project. For production use, ensure proper security measures, environment configuration, and testing are implemented.
