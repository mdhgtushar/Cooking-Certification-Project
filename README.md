# Cooking Certification Project

A comprehensive web application for managing cooking certification courses, applications, exams, and certificates. Built with React frontend and Node.js/Express backend with MongoDB database. Features a warm, cooking-inspired design with professional certificate generation capabilities.

## 🚀 Features

### User Features
- **User Registration & Authentication** - Secure user registration and login system
- **Course Browsing** - Browse available cooking certification courses
- **Application Management** - Submit and track course applications
- **Exam Management** - Take exams and view results
- **Certificate Management** - View and download earned certificates as PDF
- **Profile Management** - Update personal information and preferences
- **Certificate Verification** - Verify certificate authenticity with QR codes

### Admin Features
- **Dashboard Analytics** - Comprehensive system analytics and statistics
- **User Management** - Manage user accounts, roles, and permissions
- **Application Management** - Review and approve/reject course applications
- **Exam Management** - Create, schedule, and grade exams with user/course selection
- **Certificate Management** - Generate and manage certificates with PDF download
- **Course Management** - Create and manage certification courses
- **Contact Management** - Handle user inquiries and support requests
- **Fixed Admin Sidebar** - Professional fixed sidebar navigation

## 🎨 Design & UI

### Cooking-Themed Color Scheme
- **Primary Colors**: Warm orange tones representing culinary passion and energy
- **Secondary Colors**: Golden yellow tones reflecting delicious, golden food
- **Additional Palettes**: 
  - Cooking browns for rich, earthy ingredients
  - Spice reds for bold flavors and excitement
  - Cream tones for comfort and elegance
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### UI/UX Features
- **Modern Interface** - Clean and intuitive design using Tailwind CSS
- **Fixed Admin Layout** - Professional fixed sidebar with proper navigation
- **Real-time Updates** - Live updates using Redux state management
- **Toast Notifications** - User-friendly feedback messages
- **Loading States** - Smooth loading indicators and skeleton screens
- **Error Handling** - Comprehensive error handling and user feedback
- **PDF Generation** - Professional certificate generation with QR codes

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Redux Toolkit** - State management with RTK Query
- **Tailwind CSS** - Utility-first CSS framework with cooking-themed colors
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
- **PDFKit** - PDF generation for certificates
- **QRCode** - QR code generation for certificate verification

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
│   │   ├── pdfGenerator.js      # PDF certificate generation
│   │   └── generateToken.js     # JWT token generation
│   └── index.js                 # Main server file
├── frontend/                     # React frontend
│   ├── public/                  # Static files
│   ├── src/                     # Source code
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   │   ├── admin/           # Admin pages with fixed sidebar
│   │   │   ├── applications/    # Application pages
│   │   │   ├── auth/            # Authentication pages
│   │   │   ├── certificates/    # Certificate pages with PDF download
│   │   │   ├── courses/         # Course pages
│   │   │   ├── exams/           # Exam pages
│   │   │   └── user/            # User pages
│   │   ├── services/            # API services
│   │   ├── store/               # Redux store and slices
│   │   └── utils/               # Utility functions
│   ├── tailwind.config.js       # Cooking-themed color configuration
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
   BASE_URL=http://localhost:5000
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

### Certificate Endpoints
- `GET /api/certificates/:id` - Get certificate by ID
- `GET /api/certificates/:id/pdf` - Download certificate as PDF
- `GET /api/verify/:code` - Verify certificate with QR code

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

- **Cooking-Themed Design** - Warm, food-inspired color palette
- **Fixed Admin Sidebar** - Professional fixed navigation sidebar
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Modern UI** - Clean and intuitive interface using Tailwind CSS
- **Real-time Updates** - Live updates using Redux state management
- **Toast Notifications** - User-friendly feedback messages
- **Loading States** - Smooth loading indicators and skeleton screens
- **Error Handling** - Comprehensive error handling and user feedback
- **PDF Certificate Generation** - Professional certificate downloads
- **QR Code Verification** - Certificate authenticity verification

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
- **v1.4.0** - Cooking-themed design, fixed admin sidebar, PDF certificate generation
- **v1.4.1** - Enhanced exam creation with user/course selection
- **v1.4.2** - Improved certificate management and QR code verification

## 🆕 Recent Updates

### v1.4.2 (Latest)
- ✅ **Cooking-Themed Color Scheme** - Warm orange, yellow, and brown tones
- ✅ **Fixed Admin Sidebar** - Professional fixed navigation sidebar
- ✅ **PDF Certificate Generation** - Professional certificate downloads with QR codes
- ✅ **Enhanced Exam Management** - User and course dropdown selection
- ✅ **Improved Certificate Management** - Better UI and PDF generation
- ✅ **QR Code Verification** - Certificate authenticity verification system
- ✅ **Responsive Design Improvements** - Better mobile and tablet experience

---

**Note**: This is a development project. For production use, ensure proper security measures, environment configuration, and testing are implemented.
