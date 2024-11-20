import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext'; // Import the UserProvider

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SigninPage from './pages/SigninPage';
import ViewPosts from './pages/ViewPosts';
import CreatePostForm from './pages/CreatePostForm';
import PostPage from './pages/PostPage';

function App() {
  return (
    <UserProvider>  {/* Make sure UserProvider is wrapping the app */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/SigninPage" element={<SigninPage />} />
          <Route path="/ViewPosts" element={<ViewPosts />} />
          <Route path="/create" element={<CreatePostForm />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
