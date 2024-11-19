import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import ViewPosts from './pages/ViewPosts';
import CreatePostForm from './pages/CreatePostForm';
import PostPage from './pages/PostPage';
import HomePage from './pages/HomePage';


function App() {
  const [posts, setPosts] = useState([]);

  // Load posts from Supabase
  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase.from('posts').select('*');
      setPosts(data);
    }
    fetchPosts();
  }, []);

  const addPost = async (newPost) => {
    const { data, error } = await supabase.from('posts').insert(newPost).single();
    if (error) {
      console.error("Error adding post:", error.message);
      return;
    }
    setPosts([data, ...posts]);
  };
  

  return (
    <Router>
      <Routes>
      <Route path="/" element={<HomePage />} />

        <Route path="/ViewPosts" element={<ViewPosts posts={posts} />} />
        <Route path="/create" element={<CreatePostForm addPost={addPost} />} />
        <Route path="/post/:id" element={<PostPage />} />
      </Routes>
    </Router>
  );
}

export default App;
