import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminMaintenancePanel = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
      const res = await axios.get(`${API_BASE_URL}/api/maintenance`, {
        withCredentials: true,
      });
      setRequests(res.data);
    } catch (err) {
      setError('Failed to load maintenance requests.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setActionLoadingId(id);
    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
      await axios.put(`${API_BASE_URL}/api/maintenance/${id}/status`, { status }, {
        withCredentials: true,
      });
      setRequests(prev =>
        prev.map(r => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResolve = async (id) => {
    const resolutionNote = prompt('Enter resolution note:');
    if (resolutionNote) {
      setActionLoadingId(id);
      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
        await axios.put(`${API_BASE_URL}/api/maintenance/${id}/resolve`, { resolutionNote }, {
          withCredentials: true,
        });
        setRequests(prev =>
          prev.map(r =>
            r._id === id ? { ...r, status: 'Resolved', resolutionNotes: resolutionNote } : r
          )
        );
      } catch (err) {
        console.error('Resolve failed:', err);
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 p-6 bg-white rounded-lg border shadow">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Maintenance Requests</h2>

      {loading ? (
        <p className="text-gray-600">Loading requests...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <ul className="space-y-4">
          {requests.length === 0 ? (
            <p className="text-gray-500">No maintenance requests found.</p>
          ) : (
            requests.map(req => (
              <li key={req._id} className="border p-4 rounded shadow-sm">
                <h3 className="font-bold text-lg text-blue-800">{req.title}</h3>
                <p className="text-gray-700">{req.description}</p>
                <p className="text-sm text-gray-600">Status: <strong>{req.status}</strong></p>
                <p className="text-sm text-gray-600">By: {req.requestedBy?.name || 'Unknown'}</p>
                {req.resolutionNotes && (
                  <p className="text-green-600 mt-2">Resolution: {req.resolutionNotes}</p>
                )}
                {req.status !== 'Resolved' && (
                  <div className="space-x-2 mt-3">
                    <button
                      onClick={() => handleStatusUpdate(req._id, 'In Progress')}
                      disabled={actionLoadingId === req._id}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 disabled:opacity-50"
                    >
                      {actionLoadingId === req._id ? 'Updating...' : 'Mark In Progress'}
                    </button>
                    <button
                      onClick={() => handleResolve(req._id)}
                      disabled={actionLoadingId === req._id}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {actionLoadingId === req._id ? 'Resolving...' : 'Resolve'}
                    </button>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default AdminMaintenancePanel;
