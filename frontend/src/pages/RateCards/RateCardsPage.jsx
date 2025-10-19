import { useState, useEffect } from 'react';
import axios from 'axios';

const RateCardsPage = () => {
  const [rateCards, setRateCards] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRateCard, setCurrentRateCard] = useState(null);
  const [formData, setFormData] = useState({
    clientRef: '',
    courses: [{ courseName: '', basePrice: '', discount: '', finalPrice: '' }]
  });

  useEffect(() => {
    fetchRateCards();
    fetchClients();
  }, []);

  const fetchRateCards = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/v1/rate-cards');
      setRateCards(data.data || []);
    } catch (error) {
      console.error('Error fetching rate cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data } = await axios.get('/api/v1/clients');
      setClients(data.data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCourseChange = (index, field, value) => {
    const newCourses = [...formData.courses];
    newCourses[index][field] = value;

    if (field === 'basePrice' || field === 'discount') {
      const basePrice = parseFloat(newCourses[index].basePrice) || 0;
      const discount = parseFloat(newCourses[index].discount) || 0;
      newCourses[index].finalPrice = (basePrice - (basePrice * discount / 100)).toFixed(3);
    }

    setFormData(prev => ({ ...prev, courses: newCourses }));
  };

  const addCourse = () => {
    setFormData(prev => ({
      ...prev,
      courses: [...prev.courses, { courseName: '', basePrice: '', discount: '', finalPrice: '' }]
    }));
  };

  const removeCourse = (index) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`/api/v1/rate-cards/${currentRateCard._id}`, formData);
      } else {
        await axios.post('/api/v1/rate-cards', formData);
      }

      fetchRateCards();
      closeModal();
    } catch (error) {
      console.error('Error saving rate card:', error);
      alert('Failed to save rate card');
    }
  };

  const handleEdit = (rateCard) => {
    setCurrentRateCard(rateCard);
    setFormData({
      clientRef: rateCard.clientRef._id,
      courses: rateCard.courses
    });
    setEditMode(true);
    setShowModal(true);
  };

  const openNewModal = () => {
    setEditMode(false);
    setCurrentRateCard(null);
    setFormData({
      clientRef: '',
      courses: [{ courseName: '', basePrice: '', discount: '', finalPrice: '' }]
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentRateCard(null);
  };

  const formatCurrency = (amount) => {
    return `KD ${parseFloat(amount).toFixed(3)}`;
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Rate Cards</h1>
          <div id="breadcrumb-container">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Rate Cards</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openNewModal}>
            <i className="fas fa-plus"></i> New Rate Card
          </button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Courses</th>
            <th>Valid Until</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="5" className="text-center">Loading...</td></tr>
          ) : rateCards.length === 0 ? (
            <tr><td colSpan="5" className="text-center">No rate cards found</td></tr>
          ) : (
            rateCards.map(rateCard => (
              <tr key={rateCard._id}>
                <td>{rateCard.clientRef?.name || 'N/A'}</td>
                <td>{rateCard.courses.length} course(s)</td>
                <td>{rateCard.validUntil ? new Date(rateCard.validUntil).toLocaleDateString() : 'No expiry'}</td>
                <td>
                  <span className={`status-badge status-${rateCard.isActive ? 'active' : 'inactive'}`}>
                    {rateCard.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="action-icons-container">
                    <i className="fas fa-edit action-icon" data-action="edit" onClick={() => handleEdit(rateCard)}></i>
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
            <h2 className="modal-title">{editMode ? 'Edit Rate Card' : 'New Rate Card'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Client *</label>
                  <select name="clientRef" value={formData.clientRef} onChange={handleInputChange} required>
                    <option value="">Select Client</option>
                    {clients.map(client => (
                      <option key={client._id} value={client._id}>{client.name}</option>
                    ))}
                  </select>
                </div>

                <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Courses</h3>
                {formData.courses.map((course, index) => (
                  <div key={index} style={{padding: '15px', border: '1px solid #e0e0e0', borderRadius: '5px', marginBottom: '15px'}}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Course Name *</label>
                        <input
                          type="text"
                          value={course.courseName}
                          onChange={(e) => handleCourseChange(index, 'courseName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Base Price (KD) *</label>
                        <input
                          type="number"
                          step="0.001"
                          value={course.basePrice}
                          onChange={(e) => handleCourseChange(index, 'basePrice', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Discount (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={course.discount}
                          onChange={(e) => handleCourseChange(index, 'discount', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Final Price (KD)</label>
                        <input
                          type="number"
                          step="0.001"
                          value={course.finalPrice}
                          readOnly
                          disabled
                        />
                      </div>
                    </div>
                    {formData.courses.length > 1 && (
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => removeCourse(index)}>
                        Remove Course
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn btn-secondary btn-sm" onClick={addCourse}>
                  <i className="fas fa-plus"></i> Add Course
                </button>
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

export default RateCardsPage;
