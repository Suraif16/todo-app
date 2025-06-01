# Todo Application - CoverageX Assessment

A modern full-stack todo application built with **React**, **Spring Boot**, and **MariaDB**. This project implements all requirements specified in the CoverageX take-home assessment with additional features including user authentication, task statistics, and comprehensive testing.

## 🏗️ **Architecture Overview**

```
┌─────────────┐    HTTP/REST API    ┌─────────────┐    JPA/JDBC    ┌─────────────┐
│   Frontend  │◄──────────────────►│   Backend   │◄──────────────►│  Database   │
│   (React)   │                    │(Spring Boot)│                │  (MariaDB)  │
└─────────────┘                    └─────────────┘                └─────────────┘
```

### **Technology Stack**
- **Frontend**: React 18.2, React Router DOM, Axios, React Toastify
- **Backend**: Spring Boot 3.2, Spring Security, Spring Data JPA, JWT Authentication
- **Database**: MariaDB 10.11
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest, React Testing Library, JUnit 5, Mockito, Spring Boot Test

## ✨ **Features Implemented**

### **Core Requirements ✅**
- ✅ Create todo tasks with title and description
- ✅ Display most recent 5 incomplete tasks only
- ✅ Mark tasks as completed with "Done" button
- ✅ Completed tasks disappear from UI
- ✅ REST API backend with proper HTTP methods
- ✅ MariaDB database with relational schema
- ✅ Full Docker containerization
- ✅ Comprehensive unit and integration tests

### **Additional Features 🚀**
- 🔐 User authentication and registration
- 📊 Task statistics dashboard
- 🔍 Search functionality
- 📱 Responsive modern UI
- 🧪 Comprehensive test coverage
- 🔒 JWT-based security
- 📝 Input validation
- 🎨 Modern UX with toast notifications

## 🚀 **Quick Start**

### **Prerequisites**
- Docker Desktop installed and running
- Git installed
- (Optional) Node.js 18+ and Java 17+ for local development

### **Method 1: Docker Compose (Recommended)**

```bash
# 1. Clone and navigate to project
git clone <your-repository-url>
cd todo-app

# 2. Start all services
docker-compose up --build -d

# 3. Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

### **Method 2: Local Development**

```bash
# 1. Start Database Only
docker-compose -f docker-compose-db-only.yml up -d

# 2. Start Backend (Terminal 1)
cd backend
mvn spring-boot:run

# 3. Start Frontend (Terminal 2)  
cd frontend
npm install
npm start

# 4. Access at http://localhost:3000
```

## 🔌 **API Endpoints**

### **Authentication (Public)**
```http
POST /auth/register    # Register new user
POST /auth/login       # User login  
GET  /auth/health      # Health check
```

### **Tasks (Protected - Requires JWT)**
```http
GET    /tasks/recent           # Get 5 most recent incomplete tasks
GET    /tasks                  # Get all tasks (paginated)
GET    /tasks/{id}             # Get specific task
POST   /tasks                  # Create new task
PUT    /tasks/{id}             # Update task
PUT    /tasks/{id}/complete    # Mark task as completed (Done button)
PUT    /tasks/{id}/pending     # Mark task as pending
DELETE /tasks/{id}             # Delete task
GET    /tasks/search?q={term}  # Search tasks
GET    /tasks/stats            # Get task statistics
```

## 🧪 **Testing**

### **Run Backend Tests**
```bash
cd backend

# Run all tests
mvn test

# Run tests with coverage report
mvn test jacoco:report

# View coverage report
open target/site/jacoco/index.html
```

### **Run Frontend Tests**
```bash
cd frontend

# Run all tests
npm test -- --watchAll=false

# Run tests with coverage
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

## 🧑‍💻 **User Guide**

### **Getting Started**
1. **Register Account**: Create new account or use test user
   - Test Username: `testuser`
   - Test Password: `password123`

2. **Create Tasks**: Click "Create New Task" button
   - Enter title (required)
   - Add description (optional)
   - Click "Create Task"

3. **Manage Tasks**: 
   - View 5 most recent incomplete tasks
   - Click "✅ Done" to mark complete (task disappears)
   - Click "🗑️ Delete" to remove task
   - View statistics dashboard

### **Key Features**
- **Dashboard**: Overview with task statistics
- **Real-time Updates**: UI updates immediately after actions
- **Responsive Design**: Works on desktop, tablet, mobile
- **Toast Notifications**: Success/error feedback
- **Form Validation**: Real-time input validation

## 📁 **Project Structure**

```
todo-app/
├── README.md                    # This file
├── docker-compose.yml           # Multi-container setup
├── docker-compose-db-only.yml   # Database only setup
│
├── backend/                     # Spring Boot API
│   ├── Dockerfile
│   ├── pom.xml                  # Maven dependencies
│   ├── src/main/java/com/coveragex/todobackend/
│   │   ├── TodoBackendApplication.java
│   │   ├── controller/          # REST endpoints
│   │   ├── service/             # Business logic
│   │   ├── repository/          # Data access
│   │   ├── entity/              # JPA entities
│   │   ├── dto/                 # Data transfer objects
│   │   ├── security/            # JWT & authentication
│   │   └── config/              # Spring configuration
│   ├── src/test/java/           # Unit & integration tests
│   └── src/main/resources/
│       └── application.yml      # App configuration
│
├── frontend/                    # React application
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json             # NPM dependencies
│   ├── public/index.html
│   └── src/
│       ├── index.js             # App entry point
│       ├── App.js               # Main app component
│       ├── components/          # React components
│       │   ├── Auth/            # Login/Register
│       │   ├── Dashboard/       # Main dashboard
│       │   └── Common/          # Shared components
│       ├── contexts/            # React contexts
│       ├── services/            # API services
│       ├── utils/               # Utility functions
│       └── hooks/               # Custom React hooks
│
└── database/
    └── init.sql                 # Database initialization
```

## 📊 **Performance & Security**

### **Security Features**
- 🔒 JWT token-based authentication
- 🔐 BCrypt password hashing
- 🛡️ CORS protection
- 📝 Input validation & sanitization
- 🚫 SQL injection prevention with JPA
- 👤 User isolation (users only see their own tasks)

### **Performance Optimizations**
- 📦 Docker multi-stage builds
- 🗃️ Database connection pooling
- 📄 Pagination for large datasets
- 🎯 Efficient database queries with indexes
- ⚡ React component optimization
