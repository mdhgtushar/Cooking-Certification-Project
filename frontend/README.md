# Cooking Certification Frontend

A React-based frontend for the Cooking Certification platform with user authentication, course management, and certification features.

## Features

### Authentication
- **User Registration**: Complete registration form with validation
  - First name, last name, email, password, and role selection
  - Password strength validation (uppercase, lowercase, number required)
  - Email format validation
  - Terms and conditions agreement
- **User Login**: Secure login with email and password
  - Form validation
  - Error handling with toast notifications
  - Redirect to intended page after login
  - Demo accounts available for testing

### Demo Accounts
For testing purposes, the following demo accounts are available:

- **Student**: student@example.com / password123
- **Instructor**: instructor@example.com / password123  
- **Admin**: admin@example.com / password123

### User Roles
- **Student**: Can apply for courses, take exams, view certificates
- **Instructor**: Can manage courses and exams
- **Admin**: Full system access and user management

### 📚 Course Management
- Browse available courses
- Course details and information
- Course search and filtering
- Instructor course management

### 📝 Application System
- Online course applications
- Application status tracking
- Document upload support
- Application review system

### 📋 Exam Management
- Exam scheduling and management
- Online and offline exam support
- Exam taking interface
- Results and grading system

### 🏆 Certificate System
- Certificate generation and viewing
- Certificate verification (public)
- Certificate download
- Certificate management (admin)

### 📞 Contact Management
- Contact form submission
- Inquiry management system
- Response tracking
- Spam detection

### 👨‍💼 Admin Panel
- Comprehensive dashboard
- User management
- Certificate oversight
- Application processing
- Exam result management
- Contact inquiry management
- System analytics

## Tech Stack

- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **CSS3** - Styling

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.jsx
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── LoadingSpinner.jsx
├── pages/              # Page components
│   ├── Home.jsx
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── user/
│   │   └── UserDashboard.jsx
│   ├── admin/
│   │   └── AdminPanel.jsx
│   ├── courses/
│   │   ├── CourseList.jsx
│   │   └── CourseDetail.jsx
│   ├── applications/
│   │   ├── ApplicationForm.jsx
│   │   └── MyApplications.jsx
│   ├── exams/
│   │   ├── MyExams.jsx
│   │   └── ExamDetail.jsx
│   └── certificates/
│       ├── MyCertificates.jsx
│       ├── CertificateDetail.jsx
│       └── VerifyCertificate.jsx
├── store/              # Redux store and slices
│   ├── store.js
│   ├── userSlice.js
│   ├── courseSlice.js
│   ├── applicationSlice.js
│   ├── examSlice.js
│   ├── certificateSlice.js
│   ├── contactSlice.js
│   └── adminSlice.js
├── services/           # API service functions
│   ├── userService.js
│   ├── courseService.js
│   ├── applicationService.js
│   ├── examService.js
│   ├── certificateService.js
│   ├── contactService.js
│   └── adminService.js
├── constants/          # Constants and configurations
│   └── apiConstants.js
├── hooks/              # Custom React hooks
│   └── useAuth.js
├── utils/              # Utility functions
│   └── formatDate.js
├── App.js              # Main app component
├── index.js            # App entry point
└── index.css           # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on port 5001

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5001/api
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## API Integration

The frontend communicates with the backend API through service functions located in the `services/` directory. Each service handles specific API endpoints:

- **userService** - Authentication and user management
- **courseService** - Course operations
- **applicationService** - Application management
- **examService** - Exam operations
- **certificateService** - Certificate management
- **contactService** - Contact form handling
- **adminService** - Admin panel operations

## State Management

The application uses Redux Toolkit for state management with the following slices:

- **userSlice** - User authentication and profile
- **courseSlice** - Course data and management
- **applicationSlice** - Application data
- **examSlice** - Exam data and operations
- **certificateSlice** - Certificate data
- **contactSlice** - Contact form data
- **adminSlice** - Admin panel data

## Routing

The application uses React Router v6 with protected routes based on user roles:

- **Public Routes**: Home, Login, Register, Course List, Course Details, Certificate Verification, Contact
- **Student Routes**: Dashboard, Applications, Exams, Certificates
- **Instructor Routes**: Course Management, Exam Management
- **Admin Routes**: Admin Panel, User Management, System Management

## Components

### Reusable Components

- **Button** - Configurable button component with variants
- **Header** - Navigation header with user menu
- **Footer** - Application footer
- **LoadingSpinner** - Loading indicator

### Page Components

Each page component is organized by feature and includes:
- Data fetching and state management
- Form handling and validation
- Error handling and user feedback
- Responsive design

## Styling

The application uses CSS3 with:
- Responsive design principles
- CSS Grid and Flexbox
- Custom utility classes
- Component-specific styles

## Error Handling

- Global error handling with React Toastify
- API error interceptors
- Form validation
- User-friendly error messages

## Security

- JWT token authentication
- Protected routes
- Role-based access control
- Secure API communication

## Performance

- Code splitting with React Router
- Optimized Redux state management
- Efficient re-rendering
- Lazy loading for components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository. 