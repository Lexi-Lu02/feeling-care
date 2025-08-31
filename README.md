# Assignment1_FeelingCare

A comprehensive mental health support website designed to provide resources, guidance, and assistance for individuals seeking mental health support.

## 🌟 Features

### **Public Features**

- **Homepage**: Overview of services and key statistics
- **Get Support**: Emergency contacts and support services
- **Information & Resources**: Educational content, blogs, podcasts, and videos
- **Responsive Design**: Mobile-friendly interface

### **User Authentication**

- **Role-Based Access**: Two user roles (User and Administrator)
- **Secure Login/Signup**: Form validation with Zod schema
- **Session Management**: Persistent user sessions

### **Admin Dashboard**

- **User Management**: View, edit, and delete user accounts
- **System Settings**: Configure site preferences and security
- **Administrative Actions**: Content management and analytics
- **Role-Based Permissions**: Admin-only access to sensitive features

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd Assignment1_FeelingCare
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 👥 User Guide

### **For Regular Users**

#### **Navigation**

- **Home**: Overview of Feeling Care services
- **Get Support**: Access emergency contacts and support services
- **Information & Resources**: Browse educational content
- **Login/Signup**: Access your account

#### **Getting Support**

1. Click "Get Support" in the navigation
2. View emergency contact information
3. Browse available services and guidance resources
4. Contact emergency services if needed (000, Lifeline, Kids Helpline)

#### **Accessing Resources**

1. Navigate to "Information & Resources"
2. Browse through:
   - **Blogs**: Mental health articles and guides
   - **Podcasts**: Audio content for mental wellbeing
   - **Videos**: Visual resources and tutorials
3. Click "See More" on any resource to access full content

### **For Administrators**

#### **Login Credentials**

- **Email**: `admin@feelingcare.com`
- **Password**: `Admin123`

#### **Admin Dashboard Features**

1. **User Management**
   - View all registered users
   - Edit user information
   - Delete user accounts
   - Monitor user roles

2. **System Settings**
   - Configure site name
   - Toggle maintenance mode
   - Set session timeout
   - Manage password policies

3. **Administrative Actions**
   - Content management
   - Analytics and reports
   - Security settings
   - System monitoring

## 🛠️ Technical Details

### **Built With**

- **Frontend**: Vue.js 3 with Composition API
- **Styling**: Bootstrap 5 + Custom CSS
- **Validation**: Zod schema validation
- **Routing**: Vue Router 4
- **Build Tool**: Vite

### **Project Structure**

```
src/
├── assets/
│   ├── custom.css          # Main CSS entry point
│   ├── variables.css       # CSS variables and colors
│   ├── navbar.css          # Navigation styles
│   ├── components.css      # Reusable component styles
│   ├── pages.css           # Page-specific styles
│   └── responsive.css      # Responsive design
├── components/
│   └── Navbar.vue          # Navigation component
├── services/
│   └── authService.js      # Authentication service
├── views/
│   ├── HomePage.vue        # Homepage
│   ├── GetSupport.vue      # Support page
│   ├── InformationAndResources.vue  # Resources page
│   ├── LoginOrSignup.vue   # Authentication page
│   └── AdminDashboard.vue  # Admin dashboard
└── router.js               # Route configuration
```

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🎨 Design System

### **Color Palette**

- **Primary**: Dark muted green (#657166)
- **Secondary Colors**:
  - Light Blue (#99cdd8)
  - Pale Mint (#daebe1)
  - Light Peach (#fde8d3)
  - Muted Rose (#f3c3b2)
  - Light Sage (#cfd8c4)
  - Pale Green (#ecf2ee)
  - Pale Pink (#f9f3ef)

### **Typography**

- **Font Family**: Tahoma, sans-serif
- **Responsive Design**: Mobile-first approach

## 🔐 Security Features

- **Role-Based Access Control**: Different permissions for users and admins
- **Form Validation**: Client-side validation with Zod
- **Session Management**: Secure user session handling
- **Input Sanitization**: Protection against malicious input

## 📱 Responsive Design

The website is fully responsive and optimized for:

- **Mobile phones** (< 576px)
- **Tablets** (576px - 991px)
- **Desktop** (≥ 992px)
- **Large screens** (≥ 1200px)

## 🚨 Emergency Support

If you're in immediate danger or experiencing a crisis:

- **Emergency Services**: 000
- **Lifeline**: 13 11 14
- **Kids Helpline**: 1300 65 9467

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for educational purposes as part of FIT5032 Assignment 1.

## 📞 Support

For technical support or questions about the website:

- Check the documentation in `/src/assets/README.md`
- Review the code comments
- Contact the development team

---

**Note**: This is a demonstration website created for educational purposes.
