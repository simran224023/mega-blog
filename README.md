# Mega Blog

![Mega Blog](https://raw.githubusercontent.com/simran224023/mega-blog/main/public/mega-blog-logo.png)

## 📋 Overview

Mega Blog is a full-featured blogging platform built with React and Appwrite. It provides a modern, responsive interface for creating, editing, and managing blog posts with features like user authentication, rich text editing, and image uploads.

## ✨ Features

- **User Authentication**: Secure login and registration system
- **Create & Edit Posts**: Rich text editor for creating and editing blog posts
- **Image Upload**: Support for uploading and managing images in blog posts
- **Post Management**: Ability to create, edit, delete, and publish/unpublish posts
- **User Profiles**: Customizable user profiles
- **Responsive Design**: Mobile-friendly interface that works across all devices
- **Dark/Light Theme**: Toggle between dark and light modes for comfortable reading
- **CORS Handling**: Secure cross-origin resource sharing implementation

## 🛠️ Technologies Used

### Frontend
- **React**: JavaScript library for building user interfaces
- **React Router**: For navigation and routing
- **Redux Toolkit**: State management
- **CSS**: CSS for styling
- **React Hook Form**: For form handling and validation
- **Vite**: Next generation frontend tooling

### Backend
- **Appwrite**: Open-source backend server providing:
  - Authentication
  - Database
  - Storage for files and images

### Additional Libraries
- **TinyMCE**: Rich text editor integration
- **HTML-React-Parser**: For parsing HTML content
- **React Icons**: Icon library

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm
- Appwrite account and project setup

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/simran224023/mega-blog.git
   cd mega-blog
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_APPWRITE_URL=your_appwrite_endpoint
   VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
   VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
   VITE_APPWRITE_COLLECTION_ID=your_appwrite_collection_id
   VITE_APPWRITE_BUCKET_ID=your_appwrite_storage_bucket_id
   VITE_EDITOR_API_KEY=your_editor_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

## 📁 Project Structure

```
mega-blog/
├── public/            # Public assets
├── src/
│   ├── appwrite/      # Appwrite configuration and services
│   ├── components/    # Reusable UI components
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── PostCard/
│   │   └── ...
│   ├── pages/         # Page components
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── AddPost/
│   │   └── ...
│   ├── store/         # Redux store configuration
│   ├── assets/        # Static assets
│   ├── config/        # Configuration files
│   ├── hooks/         # Custom React hooks
│   └── utils/         # Utility functions
├── index.html
├── vite.config.js
└── package.json
```

## 🔐 Authentication Flow

The application uses Appwrite authentication with the following flow:
1. User registers or logs in through the login page
2. Appwrite handles authentication and returns a session token
3. The app stores the authentication state in Redux
4. Protected routes check authentication status before rendering

## 🌓 Dark and Light Theme

Mega Blog features a theme switching functionality that allows users to toggle between dark and light modes:

- **Theme Storage**: User preference is saved in local storage for persistence
- **System Preference**: Option to follow system theme preferences
- **Dynamic Switching**: Real-time theme switching without page reload
- **Styled Components**: Theme variables are applied throughout the application


## 🔄 Handling CORS

Cross-Origin Resource Sharing (CORS) is handled in this application to ensure secure communication between the frontend and Appwrite backend:

### Appwrite Configuration

1. In your Appwrite console, navigate to the project settings
2. Add your frontend domain to the allowed origins list:
   - Development: `http://localhost:5173`
   - Production: `https://mega-blog-one-phi.vercel.app`


## 🚀 Deployment to Vercel

Follow these steps to deploy your Mega Blog application to Vercel:

1. **Create a Vercel Account**: Sign up at [vercel.com](https://vercel.com) if you don't have an account

2. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

3. **Prepare Your Application**:
   - Ensure your environment variables are set in a `.env` file
   - Make sure your build script is properly configured in `package.json`

4. **Create a `vercel.json` File** in your project root:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "routes": [
       { "handle": "filesystem" },
       { "src": "/(.*)", "dest": "/index.html" }
     ]
   }
   ```

5. **Deploy Using Vercel Dashboard**:
   - Push your code to GitHub, GitLab, or Bitbucket
   - Log in to Vercel Dashboard
   - Click "New Project" and import your repository
   - Configure project settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Add all environment variables from your `.env` file
   - Click "Deploy"

6. **Deploy Using Vercel CLI** (alternative):
   ```bash
   # Login to Vercel
   vercel login
   
   # Deploy from your project directory
   cd mega-blog
   vercel
   
   # Follow the interactive prompts
   ```

7. **Configure Environment Variables in Vercel**:
   - Go to your project in the Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add all the variables from your `.env` file:
     ```
     VITE_APPWRITE_URL=your_appwrite_endpoint
     VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
     VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
     VITE_APPWRITE_COLLECTION_ID=your_appwrite_collection_id
     VITE_APPWRITE_BUCKET_ID=your_appwrite_storage_bucket_id
     VITE_EDITOR_API_KEY=your_editor_api_key
     ```

8. **Update Appwrite Platform Settings**:
   - Add your Vercel deployment URL to the allowed domains in Appwrite

Your Mega Blog application will be live at `https://your-project-name.vercel.app`.

## 💻 Development

### Available Scripts

- **dev**: Starts the development server
- **build**: Builds the app for production
- **preview**: Locally preview the production build
- **lint**: Lints the code using ESLint

### Coding Style

This project follows modern React practices including:
- Functional components with hooks
- Custom hooks for reusable logic
- Redux Toolkit for state management
- CSS for styling