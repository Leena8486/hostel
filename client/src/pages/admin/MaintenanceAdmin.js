import { useEffect, useState } from 'react';
import axios from 'axios';
import MaintenanceCard from '../../components/MaintenanceCard';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export default function MaintenanceAdmin() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTickets = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(`${API_BASE_URL}/maintenance`, {
        withCredentials: true,
      });
      setTickets(data);
    } catch (err) {
      setError('Failed to fetch maintenance tickets.');
    } finally {
      setLoading(false);
    }
  };

  const assignTicket = async (ticketId) => {
    try {
      await axios.put(
        `${API_BASE_URL}/maintenance/${ticketId}/assign`,
        {},
        { withCredentials: true }
      );
      toast.success('Ticket assigned');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to assign ticket');
    }
  };

  const updateStatus = async (ticketId) => {
    const resolutionNote = prompt('Add a resolution note (optional)');
    try {
      await axios.put(
        `${API_BASE_URL}/maintenance/${ticketId}/resolve`,
        { resolutionNote },
        { withCredentials: true }
      );
      toast.success('Ticket resolved');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to resolve ticket');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">All Maintenance Requests</h1>

      {loading && <p className="text-gray-500">Loading tickets...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && tickets.length === 0 && (
        <p className="text-gray-400">No maintenance requests found.</p>
      )}

      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <MaintenanceCard
            key={ticket._id}
            ticket={ticket}
            onAssign={() => assignTicket(ticket._id)}
            onUpdate={() => updateStatus(ticket._id)}
          />
        ))}
      </div>
    </div>
  );
}
