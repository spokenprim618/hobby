import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function SigninPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); // Initialize navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Step 1: Insert user information directly into the 'user' table in Supabase
      const { data, error: insertError } = await supabase.from('user').insert([
        {
          name,
          email,
          password, // In production, hash the password for security
          posts: [], // Initialize posts as an empty array (if applicable)
          image_url: imageUrl || null, // Optional profile picture URL
        },
      ]);

      if (insertError) throw insertError;

      setSuccess('Account created successfully!');
      
      // Reset form fields
      setName('');
      setEmail('');
      setPassword('');
      setImageUrl('');

      // Navigate to the Login page after successfully inserting the user data
      setTimeout(() => navigate('/LoginPage'), 2000); // Delay to show success message
    } catch (error) {
      setError(error.message || 'Something went wrong while inserting data.');
    }
  };

  return (
    <div>
      <h1>Create Your Account</h1>
      <nav>
        <Link to="/ViewPosts" className="link" style={{ paddingLeft: '20px' }}>
          View Posts
        </Link>
        <Link to="/LoginPage" className="link" style={{ paddingLeft: '20px' }}>
          Login
        </Link>
        <Link to="/" className="link" style={{ paddingRight: '20px' }}>
          Home
        </Link>
      </nav>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Profile Picture URL"
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
