import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentForm = ({ payment, onClose, onSave, residents }) => {
  const [formData, setFormData] = useState({
    resident: '',
    category: '',
    amount: '',
    status: 'Pending',
    date: new Date().toISOString().slice(0, 10),
  });

  const isStatusOnly = payment?.statusOnly;

  useEffect(() => {
    if (payment) {
      setFormData({
        resident: payment.resident?._id || payment.resident || '',
        category: payment.category || '',
        amount: payment.amount || '',
        status: payment.status || 'Pending',
        date: payment.date ? new Date(payment.date).toISOString().slice(0, 10) : '',
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
      };
      if (payment?._id) {
        await axios.put(`/api/payments/${payment._id}`, payload);
      } else {
        await axios.post('/api/payments', payload);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('Failed to save payment. Check the console for more info.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{payment ? 'Edit Payment' : 'Add Payment'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isStatusOnly && (
            <>
              <div>
                <label className="block font-semibold mb-1">Resident</label>
                <select
                  name="resident"
                  value={formData.resident}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Select Resident</option>
                  {residents.map((res) => (
                    <option key={res._id} value={res._id}>
                      {res.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
            </>
          )}
          <div>
            <label className="block font-semibold mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
