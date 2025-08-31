# Assignment1_FeelingCare

A comprehensive mental health support website designed to provide resources, guidance, and assistance for individuals seeking mental health support.

## 🌟 Features

### **Public Features**

- **🏠 Homepage**: Overview of services, key statistics, and quick access to support
- **🆘 Get Support**: Emergency contacts, crisis resources, and support services
- **📚 Information & Resources**: Educational content, blogs, podcasts, and videos
- **📱 Responsive Design**: Mobile-friendly interface across all devices
- **🔍 Search Functionality**: Find resources quickly and easily

### **User Authentication**

- **👥 Role-Based Access**: Two distinct user roles (User and Administrator)
- **🔐 Secure Login/Signup**: Form validation with Zod schema validation
- **💾 Session Management**: Persistent user sessions with localStorage
- **🛡️ Input Validation**: Client-side validation for all forms

### **Admin Dashboard**

- **👤 User Management**: View, edit, and delete user accounts
- **⚙️ System Settings**: Configure site preferences and security settings
- **📊 Administrative Actions**: Content management and analytics tools
- **🔒 Role-Based Permissions**: Admin-only access to sensitive features

### **Blog System**

- **📝 Interactive Blog Posts**: Detailed articles with first-person stories
- **⭐ Rating System**: User ratings and reviews for blog content
- **🏷️ Tag Filtering**: Filter blog posts by topics and categories
- **📱 Responsive Blog Layout**: Optimized reading experience on all devices

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### **Installation**

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

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint for code quality checks
```

## 👥 User Guide

### **For Regular Users**

#### **🏠 Homepage Navigation**

- **Hero Section**: Main call-to-action with "Login/Sign up" button
- **Statistics**: View impact numbers (Youth Helped, Volunteers, Partners)
- **Quick Access Cards**: Direct links to Support, Resources, and more

#### **🆘 Getting Support**

1. **Click "Get Support"** in the navigation menu
2. **Emergency Section**: View crisis contact information
3. **Services Section**: Browse available support services
4. **Guidance Section**: Access helpful resources and information

**Emergency Contacts:**

- **Emergency Services**: 000
- **Lifeline**: 13 11 14
- **Kids Helpline**: 1300 65 9467

#### **📚 Accessing Resources**

1. **Navigate to "Information & Resources"**
2. **Browse Content Sections:**
   - **📝 Blogs**: Mental health articles with personal stories
   - **🎧 Podcasts**: Audio content for mental wellbeing
   - **🎥 Videos**: Visual resources and tutorials
3. **Click "See More"** on any resource to access full content
4. **Use "See All"** buttons to explore complete collections

#### **📝 Blog Reading Experience**

1. **Browse Blog Posts**: View summaries and ratings
2. **Filter by Tags**: Use tag system to find relevant content
3. **Read Full Articles**: Click "Read More" for detailed stories
4. **Rate Content**: Provide feedback on articles you've read
5. **Navigate Easily**: Use breadcrumbs and navigation buttons

### **For Administrators**

#### **🔐 Login Credentials**

- **Email**: `admin@feelingcare.com`
- **Password**: `Admin123`

#### **📊 Admin Dashboard Features**

##### **User Management**

- **View Users**: See all registered user accounts
- **Edit Profiles**: Modify user information and roles
- **Delete Accounts**: Remove user accounts when necessary
- **Role Management**: Assign and manage user permissions

##### **System Settings**

- **Site Configuration**: Set site name and basic settings
- **Maintenance Mode**: Toggle site maintenance status
- **Session Management**: Configure session timeout settings
- **Security Policies**: Manage password and access policies

##### **Administrative Actions**

- **Content Management**: Manage blog posts and resources
- **Analytics**: View user engagement and site statistics
- **Security Settings**: Configure access controls and permissions
- **System Monitoring**: Monitor site performance and health

## 🛠️ Technical Details

### **Built With**

- **Frontend Framework**: Vue.js 3 with Composition API
- **Styling Framework**: Bootstrap 5 + Custom CSS
- **Validation Library**: Zod schema validation
- **Routing**: Vue Router 4
- **Build Tool**: Vite
- **Package Manager**: npm

### **Project Structure**

```
src/
├── assets/
│   ├── custom.css          # Main CSS entry point with imports
│   ├── variables.css       # CSS variables and color palette
│   ├── navbar.css          # Navigation component styles
│   ├── components.css      # Reusable component styles
│   ├── pages.css           # Page-specific styles
│   └── responsive.css      # Responsive design media queries
├── components/
│   └── Navbar.vue          # Main navigation component
├── services/
│   ├── authService.js      # Authentication and user management
│   └── blogService.js      # Blog data and content management
├── views/
│   ├── HomePage.vue        # Landing page
│   ├── GetSupport.vue      # Support and emergency resources
│   ├── InformationAndResources.vue  # Educational content
│   ├── LoginOrSignup.vue   # Authentication forms
│   ├── BlogPage.vue        # Blog listing and filtering
│   ├── BlogPostDetail.vue  # Individual blog post view
│   └── AdminDashboard.vue  # Administrative interface
├── router.js               # Vue Router configuration
└── main.js                 # Application entry point
```

### **Key Technologies**

- **Vue.js 3**: Modern reactive framework
- **Bootstrap 5**: Responsive UI components
- **Vue Router**: Client-side routing
- **Zod**: Schema validation
- **CSS3**: Custom styling with CSS variables
- **ES6+**: Modern JavaScript features

## 🎨 Design System

### **Color Palette**

- **Primary Color**: Dark muted green (#657166)
- **Secondary Colors**:
  - Light Blue (#99cdd8) - Accent and highlights
  - Pale Mint (#daebe1) - Backgrounds and cards
  - Light Peach (#fde8d3) - Warm accents
  - Muted Rose (#f3c3b2) - Soft highlights
  - Light Sage (#cfd8c4) - Natural elements
  - Pale Green (#ecf2ee) - Subtle backgrounds
  - Pale Pink (#f9f3ef) - Gentle highlights

### **Typography**

- **Font Family**: Tahoma, sans-serif
- **Responsive Design**: Mobile-first approach
- **Accessibility**: High contrast ratios and readable fonts

### **Component Design**

- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Consistent styling with hover effects
- **Forms**: Clean, accessible input fields
- **Navigation**: Clear, intuitive menu structure

## 🔐 Security Features

- **Role-Based Access Control**: Different permissions for users and admins
- **Form Validation**: Client-side validation with Zod schemas
- **Session Management**: Secure user session handling
- **Input Sanitization**: Protection against malicious input
- **Route Guards**: Protected routes for admin access

## 📱 Responsive Design

The website is fully responsive and optimized for all devices:

- **📱 Mobile phones** (< 576px): Touch-friendly interface
- **📱 Large phones** (576px - 767px): Optimized layouts
- **💻 Tablets** (768px - 991px): Enhanced navigation
- **🖥️ Desktop** (992px - 1199px): Full feature access
- **🖥️ Large screens** (≥ 1200px): Expanded layouts

### **Responsive Features**

- **Flexible Grid System**: Bootstrap-based responsive layouts
- **Mobile Navigation**: Collapsible hamburger menu
- **Touch-Friendly**: Optimized button sizes and spacing
- **Readable Text**: Scalable typography across devices

## 🚨 Emergency Support

### **Crisis Resources**

If you're in immediate danger or experiencing a crisis:

- **🚨 Emergency Services**: 000
- **📞 Lifeline**: 13 11 14 (24/7 crisis support)
- **👶 Kids Helpline**: 1300 65 9467 (5-25 years)
- **🏥 Beyond Blue**: 1300 22 4636 (Depression and anxiety)

### **Getting Help**

1. **Immediate Crisis**: Call emergency services (000)
2. **Mental Health Support**: Contact Lifeline or Kids Helpline
3. **Online Resources**: Use the "Get Support" page
4. **Professional Help**: Seek guidance from mental health professionals
