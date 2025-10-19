import { useState, useEffect } from 'react';
import axios from 'axios';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    location: '',
    facilities: '',
    status: 'Available'
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/v1/rooms');
      setRooms(data.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
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
        facilities: formData.facilities.split(',').map(f => f.trim())
      };

      if (editMode) {
        await axios.put(`/api/v1/rooms/${currentRoom._id}`, payload);
      } else {
        await axios.post('/api/v1/rooms', payload);
      }

      fetchRooms();
      closeModal();
    } catch (error) {
      console.error('Error saving room:', error);
      alert('Failed to save room');
    }
  };

  const handleEdit = (room) => {
    setCurrentRoom(room);
    setFormData({
      name: room.name,
      capacity: room.capacity,
      location: room.location || '',
      facilities: room.facilities?.join(', ') || '',
      status: room.status
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await axios.delete(`/api/v1/rooms/${id}`);
        fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
        alert('Failed to delete room');
      }
    }
  };

  const openNewModal = () => {
    setEditMode(false);
    setCurrentRoom(null);
    setFormData({
      name: '',
      capacity: '',
      location: '',
      facilities: '',
      status: 'Available'
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentRoom(null);
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Rooms</h1>
          <div id="breadcrumb-container">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Rooms</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openNewModal}>
            <i className="fas fa-plus"></i> Add Room
          </button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Room Name</th>
            <th>Capacity</th>
            <th>Location</th>
            <th>Facilities</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="6" className="text-center">Loading...</td></tr>
          ) : rooms.length === 0 ? (
            <tr><td colSpan="6" className="text-center">No rooms found</td></tr>
          ) : (
            rooms.map(room => (
              <tr key={room._id}>
                <td>{room.name}</td>
                <td>{room.capacity}</td>
                <td>{room.location || 'N/A'}</td>
                <td>{room.facilities?.join(', ') || 'N/A'}</td>
                <td>
                  <span className={`status-badge status-${room.status.toLowerCase()}`}>
                    {room.status}
                  </span>
                </td>
                <td>
                  <div className="action-icons-container">
                    <i className="fas fa-edit action-icon" data-action="edit" onClick={() => handleEdit(room)}></i>
                    <i className="fas fa-trash action-icon" data-action="delete" onClick={() => handleDelete(room._id)}></i>
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
            <h2 className="modal-title">{editMode ? 'Edit Room' : 'Add New Room'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Room Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Capacity *</label>
                    <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange}>
                      <option value="Available">Available</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                  </div>
                  <div className="form-group" style={{gridColumn: '1 / -1'}}>
                    <label>Facilities (comma separated)</label>
                    <input type="text" name="facilities" value={formData.facilities} onChange={handleInputChange} placeholder="Projector, Whiteboard, AC" />
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

export default RoomsPage;
