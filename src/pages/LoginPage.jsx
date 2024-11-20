import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Step 1: Query the user table to find a user with the provided email and password
      const { data, error: queryError } = await supabase
        .from('user')
        .select('*')
        .eq('email', email)
        .eq('password', password) // In production, remember to hash and compare passwords securely
        .single(); // We assume each email is unique, so we get only one user

      if (queryError) throw queryError;

      // Step 2: If the user exists, navigate to the home page
      if (data) {
        console.log('User logged in:', data);
        
        // Redirect to home page after successful login
        navigate('/');  // This will redirect to the home page ("/")
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <nav>
        <Link to="/ViewPosts" className="link" style={{ paddingLeft: '20px' }}>
          View Posts
        </Link>
        <Link to="/" className="link" style={{ paddingRight: '20px' }}>
          Home
        </Link>
      </nav>

      <form onSubmit={handleSubmit}>
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

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
