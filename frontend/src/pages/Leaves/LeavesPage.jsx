import { useState, useEffect } from 'react';
import axios from 'axios';

const LeavesPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    trainer: '',
    leaveType: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    fetchLeaves();
    fetchTrainers();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/v1/leaves');
      setLeaves(data.data || []);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainers = async () => {
    try {
      const { data } = await axios.get('/api/v1/trainers');
      setTrainers(data.data || []);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/leaves', formData);
      fetchLeaves();
      closeModal();
    } catch (error) {
      console.error('Error creating leave:', error);
      alert('Failed to create leave request');
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/v1/leaves/${id}/approve`);
      fetchLeaves();
    } catch (error) {
      console.error('Error approving leave:', error);
      alert('Failed to approve leave');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await axios.put(`/api/v1/leaves/${id}/reject`, { reason });
      fetchLeaves();
    } catch (error) {
      console.error('Error rejecting leave:', error);
      alert('Failed to reject leave');
    }
  };

  const openNewModal = () => {
    setFormData({
      trainer: '',
      leaveType: 'Sick Leave',
      startDate: '',
      endDate: '',
      reason: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Management</h1>
          <div id="breadcrumb-container">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Leaves</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openNewModal}>
            <i className="fas fa-plus"></i> New Leave Request
          </button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Leave ID</th>
            <th>Trainer</th>
            <th>Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="8" className="text-center">Loading...</td></tr>
          ) : leaves.length === 0 ? (
            <tr><td colSpan="8" className="text-center">No leave requests found</td></tr>
          ) : (
            leaves.map(leave => (
              <tr key={leave._id}>
                <td>{leave.leaveId}</td>
                <td>{leave.trainer?.name || 'N/A'}</td>
                <td>{leave.leaveType}</td>
                <td>{formatDate(leave.startDate)}</td>
                <td>{formatDate(leave.endDate)}</td>
                <td>{leave.reason}</td>
                <td>
                  <span className={`status-badge status-${leave.status.toLowerCase().replace(' ', '-')}`}>
                    {leave.status}
                  </span>
                </td>
                <td>
                  <div className="action-icons-container">
                    {leave.status === 'Pending' && (
                      <>
                        <i className="fas fa-check action-icon" style={{color: '#27ae60'}} onClick={() => handleApprove(leave._id)} title="Approve"></i>
                        <i className="fas fa-times action-icon" data-action="delete" onClick={() => handleReject(leave._id)} title="Reject"></i>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal show">
          <div className="modal-content modal-md">
            <span className="modal-close" onClick={closeModal}>&times;</span>
            <h2 className="modal-title">New Leave Request</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Trainer *</label>
                    <select name="trainer" value={formData.trainer} onChange={handleInputChange} required>
                      <option value="">Select Trainer</option>
                      {trainers.map(trainer => (
                        <option key={trainer._id} value={trainer._id}>{trainer.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Leave Type *</label>
                    <select name="leaveType" value={formData.leaveType} onChange={handleInputChange} required>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Emergency Leave">Emergency Leave</option>
                      <option value="Unpaid Leave">Unpaid Leave</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>End Date *</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group" style={{gridColumn: '1 / -1'}}>
                    <label>Reason *</label>
                    <textarea name="reason" value={formData.reason} onChange={handleInputChange} rows="4" required></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavesPage;
