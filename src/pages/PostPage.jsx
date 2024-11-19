import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editing, setEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedImageUrl, setUpdatedImageUrl] = useState('');

  useEffect(() => {
    async function fetchPostAndComments() {
      try {
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', id);

        if (postError) throw postError;
        if (commentsError) throw commentsError;

        setPost(postData);
        setComments(commentsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchPostAndComments();
  }, [id]);

  const handleUpvote = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({ upvotes: post.upvotes + 1 })
        .eq('id', id)
        .select();

      if (error) throw error;
      setPost(data[0]);
    } catch (error) {
      console.error('Error updating upvote:', error);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      return; // Don't submit if the comment is empty
    }

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{ post_id: id, content: newComment }])
        .single();

      if (error) throw error;
      setComments([...comments, data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUpdatePost = async () => {
    try {
      // Prepare the update object
      const updatedFields = {};

      if (updatedTitle.trim()) {
        updatedFields.title = updatedTitle;
      }
      if (updatedDescription.trim()) {
        updatedFields.content = updatedDescription;
      }
      if (updatedImageUrl.trim()) {
        updatedFields.image_url = updatedImageUrl;
      }

      // Check if there are fields to update
      if (Object.keys(updatedFields).length === 0) {
        alert('No changes to update.');
        return;
      }

      // Perform the update
      const { data, error } = await supabase
        .from('posts')
        .update(updatedFields)
        .eq('id', id)
        .select();

      if (error) throw error;

      // Update state with the new post data
      setPost(data[0]);
      setEditing(false); // Exit editing mode
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async () => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Redirect to the homepage after deletion
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className='post-details'>
      <nav>
           <Link to="/" className='link'>Home</Link>
      </nav>
      <h2>Title: {post.title}</h2>
      {post.image_url && <img src={post.image_url} alt={post.title} />}
      <p>Desc: {post.content}</p>
      <p>Upvotes: {post.upvotes}</p>
      <button onClick={handleUpvote}>Upvote</button>

      <button onClick={() => setEditing(true)}>Edit</button>
      <button onClick={handleDeletePost}>Delete</button>

      {editing && (
        <div>
          <h4>Edit Post</h4>
          <input
            type="text"
            placeholder="Update title"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
          <textarea
            placeholder="Update description"
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Update image URL"
            value={updatedImageUrl}
            onChange={(e) => setUpdatedImageUrl(e.target.value)}
          />
          <button onClick={handleUpdatePost}>Update</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      )}

      <h4>Comments</h4>
      {comments.map((comment) =>
        comment ? <p key={comment.id}>{comment.content}</p> : null
      )}

      <form onSubmit={addComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Comment</button>
      </form>
    </div>
  );
}

export default PostPage;
