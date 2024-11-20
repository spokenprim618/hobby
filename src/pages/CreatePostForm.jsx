import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function CreatePostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    try {
      const { error } = await supabase.from('posts').insert([
        {
          title,
          content,
          image_url: imageUrl || null, // Optional image
        },
      ]);

      if (error) {
        throw error;
      }

      // Clear form and navigate back to the home page
      setTitle('');
      setContent('');
      setImageUrl('');
      navigate('/'); // Redirect to home
    } catch (error) {
      console.error('Error creating post:', error.message);
      setError('Failed to create the post. Please try again.');
    }
  };

  return (
    <div>
     <h1>Create a post</h1>
      <nav>
      <Link to="/ViewPosts" className='link'style={{paddingLeft:'20px'}}>View Posts</Link>

      <Link to="/" className='link' style={{paddingRight:'20px'}}>Home</Link>

      </nav>
      

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
        />
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL (optional)"
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePostForm;
