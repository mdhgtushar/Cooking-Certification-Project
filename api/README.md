# Cooking Certification API

A comprehensive Express.js API for managing cooking certification courses, applications, exams, certificates, and complete admin management system.

## 🚀 Main Features

- **AUTH** - User authentication and management with role-based access control
- **Apply Online** - Complete course application system with document upload
- **Offline Exam** - Exam scheduling, management, and grading system
- **View Certificate** - Certificate generation and viewing with QR codes
- **Verify Online** - Public certificate verification system

## 👨‍💼 Admin Management Features

- **User Management** - Complete user oversight and control
- **Certificate Management** - Certificate oversight and verification control
- **Application Management** - Application review and processing system
- **Exam Result Management** - Exam results and grading oversight
- **Contact Management** - Contact inquiry and response system

## 📁 Project Structure

```
api/
├── config/
│   ├── app.config.js           # Global config values
│   └── cors.config.js          # CORS settings
├── features/
│   ├── user/                   # User authentication & management
│   │   ├── user.controller.js
│   │   ├── user.model.js
│   │   ├── user.routes.js
│   │   └── index.js
│   ├── course/                 # Course management
│   │   ├── course.controller.js
│   │   ├── course.model.js
│   │   ├── course.routes.js
│   │   └── index.js
│   ├── application/            # Course applications
│   │   ├── application.controller.js
│   │   ├── application.model.js
│   │   ├── application.routes.js
│   │   └── index.js
│   ├── exam/                   # Exam management
│   │   ├── exam.controller.js
│   │   ├── exam.model.js
│   │   ├── exam.routes.js
│   │   └── index.js
│   ├── certificate/            # Certificate management
│   │   ├── certificate.controller.js
│   │   ├── certificate.model.js
│   │   ├── certificate.routes.js
│   │   └── index.js
│   ├── contact/                # Contact management
│   │   ├── contact.controller.js
│   │   ├── contact.model.js
│   │   ├── contact.routes.js
│   │   └── index.js
│   ├── admin/                  # Admin management
│   │   ├── admin.controller.js
│   │   ├── admin.routes.js
│   │   └── index.js
│   └── routes.js               # All feature routes combined
├── middleware/
│   ├── auth.middleware.js      # Token & role auth
│   └── errorHandler.js         # Global error handler
├── utils/
│   ├── db.js                   # MongoDB connection
│   ├── generateToken.js        # JWT generator
│   └── validateInput.js        # Input validator
├── index.js                    # Main server entry
└── package.json
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cooking-certification-project/api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the api directory:
   ```env
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   MONGO_URI=mongodb://localhost:27017/cooking-certification
   CORS_ORIGIN=http://localhost:3000
   BASE_URL=http://localhost:5000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)

### Course Management
- `GET /api/courses` - Get all published courses (Public)
- `GET /api/courses/:id` - Get course by ID (Public)
- `POST /api/courses` - Create new course (Instructor/Admin)
- `PUT /api/courses/:id` - Update course (Instructor/Admin)
- `DELETE /api/courses/:id` - Delete course (Instructor/Admin)
- `GET /api/courses/instructor/my-courses` - Get instructor's courses (Instructor)

### Course Applications
- `POST /api/applications` - Apply for a course (Student)
- `GET /api/applications/my-applications` - Get user's applications (Student)
- `GET /api/applications/:id` - Get application by ID (Student)
- `PUT /api/applications/:id` - Update application (Student)
- `DELETE /api/applications/:id` - Cancel application (Student)
- `GET /api/applications` - Get all applications (Admin/Instructor)
- `PUT /api/applications/:id/review` - Review application (Admin/Instructor)

### Exam Management
- `POST /api/exams` - Schedule exam (Admin/Instructor)
- `GET /api/exams/my-exams` - Get student's exams (Student)
- `GET /api/exams/:id` - Get exam by ID (Student)
- `PUT /api/exams/:id/start` - Start exam (Student)
- `PUT /api/exams/:id/submit` - Submit exam (Student)
- `GET /api/exams` - Get all exams (Admin/Instructor)
- `PUT /api/exams/:id/grade` - Grade exam (Admin/Instructor)

### Certificate Management
- `POST /api/certificates` - Generate certificate (Admin/Instructor)
- `GET /api/certificates/my-certificates` - Get user's certificates (Student)
- `GET /api/certificates/:id` - Get certificate by ID (Student)
- `GET /api/certificates/:id/download` - Download certificate (Student)
- `GET /api/certificates/verify/:code` - Verify certificate (Public)
- `GET /api/certificates` - Get all certificates (Admin/Instructor)
- `PUT /api/certificates/:id/revoke` - Revoke certificate (Admin)

### Contact Management
- `POST /api/contacts` - Submit contact form (Public)
- `GET /api/contacts` - Get all contacts (Admin)
- `GET /api/contacts/stats` - Get contact statistics (Admin)
- `GET /api/contacts/:id` - Get contact by ID (Admin)
- `PUT /api/contacts/:id/status` - Update contact status (Admin)
- `PUT /api/contacts/:id/respond` - Respond to contact (Admin)
- `PUT /api/contacts/:id/spam` - Mark as spam (Admin)

### Admin Management
- `GET /api/admin/dashboard` - Get admin dashboard statistics (Admin)
- `GET /api/admin/users` - Get user management data (Admin)
- `PUT /api/admin/users/:id` - Update user role/status (Admin)
- `GET /api/admin/certificates` - Get certificate management data (Admin)
- `GET /api/admin/applications` - Get application management data (Admin)
- `GET /api/admin/exam-results` - Get exam result management data (Admin)
- `GET /api/admin/analytics` - Get system analytics (Admin)

### Health Check
- `GET /api/health` - API health status

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

- **student**: Can apply for courses, take exams, view certificates
- **instructor**: Can create courses, manage applications, grade exams, generate certificates
- **admin**: Full access to all features including admin management system

## 🎯 Core Features Explained

### 1. AUTH
- Complete user registration and login system
- Role-based access control (student, instructor, admin)
- JWT token authentication
- Profile management

### 2. Apply Online
- Comprehensive course application system
- Document upload support (ID proof, education certificates, photos)
- Personal information collection
- Education and experience details
- Payment integration
- Application status tracking

### 3. Offline Exam
- Exam scheduling and management
- Support for both online and offline exams
- Question bank with multiple question types
- Automatic and manual grading
- Exam proctoring
- Retake functionality

### 4. View Certificate
- Automatic certificate generation after passing exams
- Multiple certificate types (completion, achievement, excellence)
- QR code integration for easy verification
- Certificate download functionality
- Certificate expiry management

### 5. Verify Online
- Public certificate verification system
- QR code scanning support
- Verification code system
- Certificate status checking
- Anti-fraud measures

## 👨‍💼 Admin Management Features Explained

### 1. User Management
- Complete user oversight and control
- Role assignment and modification
- User status management (active/inactive)
- User search and filtering
- User activity tracking

### 2. Certificate Management
- Certificate oversight and verification control
- Certificate generation monitoring
- Certificate revocation system
- Certificate expiry management
- Certificate verification tracking

### 3. Application Management
- Application review and processing system
- Application status management
- Document verification
- Payment tracking
- Application approval/rejection workflow

### 4. Exam Result Management
- Exam results and grading oversight
- Performance analytics
- Grade distribution analysis
- Exam completion tracking
- Result verification system

### 5. Contact Management
- Contact inquiry and response system
- Spam detection and filtering
- Priority-based ticket management
- Response tracking
- Contact analytics and reporting

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevents abuse
- **XSS Protection**: Cross-site scripting protection
- **Input Sanitization**: MongoDB query injection protection
- **Parameter Pollution Protection**: Prevents HTTP parameter pollution
- **JWT Authentication**: Secure token-based authentication
- **Role-based Authorization**: Granular access control

## 📊 Database Models

### User Model
- Personal information
- Role-based access
- Certification history
- Profile management

### Course Model
- Course details and syllabus
- Instructor assignment
- Exam configuration
- Pricing and enrollment

### Application Model
- Complete application data
- Document management
- Payment tracking
- Status management

### Exam Model
- Exam scheduling
- Question bank
- Answer tracking
- Grading system

### Certificate Model
- Certificate generation
- QR code integration
- Verification system
- Expiry management

### Contact Model
- Contact form submissions
- Response management
- Spam detection
- Priority tracking

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/cooking-certification` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `BASE_URL` | Base URL for QR codes | `http://localhost:5000` |

## 🚀 Getting Started

1. **Install dependencies**: `npm install`
2. **Set up environment**: Create `.env` file
3. **Start MongoDB**: Ensure MongoDB is running
4. **Run the server**: `npm run dev`
5. **Test the API**: Visit `http://localhost:5000/api/health`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 