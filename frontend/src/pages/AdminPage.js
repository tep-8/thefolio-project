import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]); // NEW: Message state
  const [tab, setTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Admin Dashboard: Fetching data...");
        
        // Fetch all three data sets simultaneously
        const [usersRes, postsRes, messagesRes] = await Promise.all([
          API.get('/admin/users'),
          API.get('/admin/posts'),
          API.get('/messages') // Ensure this route is accessible to admins
        ]);
        
        setUsers(usersRes.data);
        setPosts(postsRes.data);
        setMessages(messagesRes.data);
      } catch (err) {
        console.error("Admin data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/status`, {});
      setUsers(users.map(u => u._id === id ? data.user : u));
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update user status");
    }
  };

  const removePost = async (id) => {
    if (!window.confirm("Are you sure you want to remove this post?")) return;
    try {
      await API.put(`/admin/posts/${id}/remove`, {});
      setPosts(posts.map(p => p._id === id ? { ...p, status: 'removed' } : p));
    } catch (err) {
      console.error("Post removal failed:", err);
      alert("Failed to remove post");
    }
  };

  // NEW: Delete Message Logic
  const deleteMessage = async (id) => {
    if (!window.confirm("Permanently delete this message?")) return;
    try {
      await API.delete(`/messages/${id}`);
      setMessages(messages.filter(m => m._id !== id));
    } catch (err) {
      console.error("Message deletion failed:", err);
      alert("Failed to delete message");
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500 italic">Unfolding the Command Center...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-white">
      {/* Header & Navigation */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Admin Dashboard</h1>
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setTab('users')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'users' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Members ({users.length})
          </button>
          <button 
            onClick={() => setTab('posts')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'posts' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            All Posts ({posts.length})
          </button>
          <button 
            onClick={() => setTab('messages')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'messages' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Inbox ({messages.length})
          </button>
        </div>
      </div>

      {/* 1. Users Management Table */}
      {tab === 'users' && (
        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(u => (
                <tr key={u._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button 
                      onClick={() => toggleStatus(u._id)}
                      className={`font-medium ${u.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-indigo-600 hover:text-indigo-900'}`}
                    >
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. Posts Management Table */}
      {tab === 'posts' && (
        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-400">No posts found in database.</td>
                </tr>
              ) : (
                posts.map(p => (
                  <tr key={p._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-xs">{p.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.author?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.status === 'published' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {p.status !== 'removed' ? (
                        <button onClick={() => removePost(p._id)} className="text-red-600 hover:text-red-900 font-medium">Remove</button>
                      ) : (
                        <span className="text-gray-400 italic">Hidden</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. NEW: Inbox / Messages Table */}
      {tab === 'messages' && (
        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Sender</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Message</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-400">Your inbox is currently empty.</td>
                </tr>
              ) : (
                messages.map(m => (
                  <tr key={m._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{m.name}</div>
                      <div className="text-sm text-gray-500">{m.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                      <p className="line-clamp-2">{m.message}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                     <a 
  href={`mailto:${m.email}?subject=Regarding your message on Stephanie's Folio&body=Hi ${m.name},%0D%0A%0D%0A`} 
  className="text-indigo-600 hover:text-indigo-900 mr-4 font-medium"
>
  Reply
</a>
                      <button 
                        onClick={() => deleteMessage(m._id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;