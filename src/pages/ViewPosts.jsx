import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function ViewPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [sortByLikes, setSortByLikes] = useState(false); // State to toggle sorting by likes

  useEffect(() => {
    let isMounted = true; // Ensure no state update after unmount

    // Function to fetch posts
    async function fetchPosts() {
      try {
        const { data, error } = await supabase.from('posts').select('*');
        if (error) throw error;
        if (isMounted) {
          setPosts(data || []);
        }
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPosts();

    // Real-time subscription for changes in the 'posts' table
    const subscription = supabase
      .channel('posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPosts((prev) => [...prev, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
          setPosts((prev) =>
            prev.map((post) => (post.id === payload.new.id ? payload.new : post))
          );
        } else if (payload.eventType === 'DELETE') {
          setPosts((prev) => prev.filter((post) => post.id !== payload.old.id));
        }
      })
      .subscribe();

    // Cleanup function to remove the subscription when component unmounts
    return () => {
      isMounted = false;
      supabase.removeChannel(subscription); // Clean up the subscription
    };
  }, []); // Empty dependency array ensures this effect runs only once

  // Effect to filter and sort the posts based on search term and sort toggle
  useEffect(() => {
    const search = searchTerm.toLowerCase();

    const filtered = posts
      .filter(
        (post) =>
          post.title.toLowerCase().includes(search) ||
          post.content.toLowerCase().includes(search)
      )
      .sort((a, b) =>
        sortByLikes ? b.upvotes - a.upvotes : a.title.localeCompare(b.title) // Sorting by likes or alphabetically
      );

    setFilteredPosts(filtered);
  }, [searchTerm, posts, sortByLikes]);

  if (loading) return <div>Loading...</div>;

  if (!posts || posts.length === 0) {
    return (
      <div>
        <h1>Here are the posts</h1>
        <nav>
        <Link to="/create" className='link'>Create a post here</Link>
        <Link to="/" className='link'>Home</Link>
        </nav>
        
        <p>No posts available.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Here are the posts</h1>
      <nav>
      <Link to="/create" className='link'>Create a post here</Link>
      <Link to="/" className='link'>Home</Link>
      </nav>
      

      <div style={{ margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '100%' }}
        />
      </div>

      <div style={{ margin: '10px 0' }}>
        <button onClick={() => setSortByLikes((prev) => !prev)}>
          {sortByLikes ? 'Sort Alphabetically' : 'Sort by Likes'}
        </button>
      </div>
      <div className='post-container'>
      {filteredPosts.map((post) => (
        <div key={post.id} style={{ marginBottom: '20px', maxWidth: '70%'}} className='post-card'>
          <Link to={`/post/${post.id}`}>
            <h3>Title: {post.title}</h3>
          </Link>
          {post.image_url && (
            <img
              src={post.image_url}
              alt="Post thumbnail"
              style={{ maxWidth: '60%', height: 'auto' }}
            />
          )}
            <p>Upvotes: {post.upvotes}</p>

        </div>
      ))}
    </div>

      </div>
      
  );
}
