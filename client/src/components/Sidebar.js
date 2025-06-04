import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar({ role }) {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed');
      console.error('Logout error:', err);
    }
  };

  const linkClasses = `
    flex items-center justify-center gap-3
    px-5 py-3 rounded-xl font-semibold
    text-white bg-teal-600
    hover:bg-teal-400 hover:text-gray-900
    transition duration-300
    shadow-md
    focus:outline-none focus:ring-2 focus:ring-teal-300
  `;

  return (
    <aside className="w-64 min-h-screen bg-gray-900 p-6 flex flex-col justify-between rounded-tr-3xl rounded-br-3xl shadow-lg">
      <div>
        <h2 className="text-3xl font-extrabold text-white text-center mb-8 drop-shadow-lg">
          Dashboard
        </h2>

        <nav className="flex flex-col gap-5">
          <Link to="/" className={linkClasses}>
            <span role="img" aria-label="home">🏠</span> Home
          </Link>

          <Link to="/admin" className={linkClasses}>
            <span role="img" aria-label="admin">👑</span> Admin Panel
          </Link>

          <Link to="/staff" className={linkClasses}>
            <span role="img" aria-label="staff">🛠</span> Staff Panel
          </Link>

          <Link to="/resident" className={linkClasses}>
            <span role="img" aria-label="resident">👤</span> Resident Panel
          </Link>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg transition focus:outline-none focus:ring-4 focus:ring-red-400 flex items-center justify-center gap-2"
      >
        <span role="img" aria-label="logout">🔓</span> Logout
      </button>
    </aside>
  );
}
