import { useState, useEffect } from 'react';
import './index.css';

const API_URL = "/api";

function App() {
  // State for storing blog posts
  const [posts, setPosts] = useState([]);
  // State for creating or editing a new post
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
  });

  // State to track if we're editing a post
  const [editingPostId, setEditingPostId] = useState(null);

  // Fetch posts from the "database" on component mount
  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  // Handle changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  // Handle form submission to create a new post or edit an existing post
  const handleSubmit = (e) => {
    e.preventDefault();

    const requestOptions = {
      method: editingPostId !== null ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    };

    const url = editingPostId !== null ? `${API_URL}/posts/${editingPostId}` : `${API_URL}/posts`;

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (editingPostId !== null) {
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === editingPostId ? data : post
            )
          );
          console.log('Post updated:', data);
        } else {
          setPosts((prevPosts) => [...prevPosts, data]);
          console.log('Post saved:', data);
        }
      })
      .catch((error) => console.error('Error saving post:', error));

    setNewPost({ title: '', content: '' });
    setEditingPostId(null); // Reset the editing state
  };

  // Handle editing a post
  const handleEdit = (post) => {
    setNewPost({
      title: post.title,
      content: post.content,
    });
    setEditingPostId(post.id);
  };

  // Handle deleting a post
  const handleDelete = (postId) => {
    fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        console.log('Post deleted');
      })
      .catch((error) => console.error('Error deleting post:', error));
  };

  return (
    <div className="app-container">
      <div className="posts-list">
        <h2>All Blog Posts</h2>
        {posts.length === 0 ? (
          <p>No posts available</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-item">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <button className='editButton' onClick={() => handleEdit(post)}>Edit</button>
              <button className='deleteButton' onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
          ))
        )}
      </div>

      <div className="new-post-form">
        <h2>{editingPostId ? 'Edit Post' : 'Create a New Post'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Post Title"
            value={newPost.title}
            onChange={handleChange}
          />
          <textarea
            name="content"
            placeholder="Post Content"
            value={newPost.content}
            onChange={handleChange}
          />
          <button type="submit">{editingPostId ? 'Update Post' : 'Create Post'}</button>
        </form>
      </div>
    </div>
  );
}

export default App;