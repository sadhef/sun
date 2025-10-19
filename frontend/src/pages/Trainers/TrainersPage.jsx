import { useState, useEffect } from 'react';
import axios from 'axios';

const TrainersPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTrainer, setCurrentTrainer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    civilId: '',
    specializations: '',
    languages: [],
    qualifications: '',
    certifications: '',
    hourlyRate: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/v1/trainers');
      setTrainers(data.data || []);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        specializations: formData.specializations.split(',').map(s => s.trim()),
        languages: Array.isArray(formData.languages) ? formData.languages : formData.languages.split(',').map(l => l.trim())
      };

      if (editMode) {
        await axios.put(`/api/v1/trainers/${currentTrainer._id}`, payload);
      } else {
        await axios.post('/api/v1/trainers', payload);
      }

      fetchTrainers();
      closeModal();
    } catch (error) {
      console.error('Error saving trainer:', error);
      alert('Failed to save trainer');
    }
  };

  const handleEdit = (trainer) => {
    setCurrentTrainer(trainer);
    setFormData({
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      civilId: trainer.civilId,
      specializations: trainer.specializations?.join(', ') || '',
      languages: trainer.languages || [],
      qualifications: trainer.qualifications || '',
      certifications: trainer.certifications || '',
      hourlyRate: trainer.hourlyRate || '',
      status: trainer.status
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        await axios.delete(`/api/v1/trainers/${id}`);
        fetchTrainers();
      } catch (error) {
        console.error('Error deleting trainer:', error);
        alert('Failed to delete trainer');
      }
    }
  };

  const openNewModal = () => {
    setEditMode(false);
    setCurrentTrainer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      civilId: '',
      specializations: '',
      languages: [],
      qualifications: '',
      certifications: '',
      hourlyRate: '',
      status: 'Active'
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentTrainer(null);
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Trainers</h1>
          <div id="breadcrumb-container">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Trainers</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openNewModal}>
            <i className="fas fa-plus"></i> Add Trainer
          </button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Specializations</th>
            <th>Languages</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="7" className="text-center">Loading...</td></tr>
          ) : trainers.length === 0 ? (
            <tr><td colSpan="7" className="text-center">No trainers found</td></tr>
          ) : (
            trainers.map(trainer => (
              <tr key={trainer._id}>
                <td>{trainer.name}</td>
                <td>{trainer.email}</td>
                <td>{trainer.phone}</td>
                <td>{trainer.specializations?.join(', ') || 'N/A'}</td>
                <td>{trainer.languages?.join(', ') || 'N/A'}</td>
                <td>
                  <span className={`status-badge status-${trainer.status.toLowerCase()}`}>
                    {trainer.status}
                  </span>
                </td>
                <td>
                  <div className="action-icons-container">
                    <i className="fas fa-edit action-icon" data-action="edit" onClick={() => handleEdit(trainer)}></i>
                    <i className="fas fa-trash action-icon" data-action="delete" onClick={() => handleDelete(trainer._id)}></i>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal show">
          <div className="modal-content modal-lg">
            <span className="modal-close" onClick={closeModal}>&times;</span>
            <h2 className="modal-title">{editMode ? 'Edit Trainer' : 'Add New Trainer'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Civil ID *</label>
                    <input type="text" name="civilId" value={formData.civilId} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Specializations (comma separated)</label>
                    <input type="text" name="specializations" value={formData.specializations} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Languages (comma separated)</label>
                    <input type="text" name="languages" value={formData.languages} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Hourly Rate</label>
                    <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Qualifications</label>
                    <textarea name="qualifications" value={formData.qualifications} onChange={handleInputChange} rows="3"></textarea>
                  </div>
                  <div className="form-group">
                    <label>Certifications</label>
                    <textarea name="certifications" value={formData.certifications} onChange={handleInputChange} rows="3"></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainersPage;
