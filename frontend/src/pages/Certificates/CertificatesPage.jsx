import { useState, useEffect } from 'react';
import axios from 'axios';

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [students, setStudents] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    student: '',
    course: '',
    trainer: '',
    issueDate: new Date().toISOString().split('T')[0],
    grade: 'Pass',
    status: 'Active'
  });

  useEffect(() => {
    fetchCertificates();
    fetchStudents();
    fetchTrainers();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/v1/certificates');
      setCertificates(data.data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get('/api/v1/students');
      setStudents(data.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
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
      await axios.post('/api/v1/certificates', formData);
      fetchCertificates();
      closeModal();
    } catch (error) {
      console.error('Error creating certificate:', error);
      alert('Failed to create certificate');
    }
  };

  const openNewModal = () => {
    setFormData({
      student: '',
      course: '',
      trainer: '',
      issueDate: new Date().toISOString().split('T')[0],
      grade: 'Pass',
      status: 'Active'
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
          <h1 className="page-title">Certificates</h1>
          <div id="breadcrumb-container">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Certificates</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openNewModal}>
            <i className="fas fa-plus"></i> Issue Certificate
          </button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Certificate #</th>
            <th>Student</th>
            <th>Course</th>
            <th>Trainer</th>
            <th>Issue Date</th>
            <th>Grade</th>
            <th>Verification Code</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="8" className="text-center">Loading...</td></tr>
          ) : certificates.length === 0 ? (
            <tr><td colSpan="8" className="text-center">No certificates found</td></tr>
          ) : (
            certificates.map(cert => (
              <tr key={cert._id}>
                <td>{cert.certificateNumber}</td>
                <td>{cert.student?.name || 'N/A'}</td>
                <td>{cert.course}</td>
                <td>{cert.trainer?.name || 'N/A'}</td>
                <td>{formatDate(cert.issueDate)}</td>
                <td>
                  <span className={`status-badge ${cert.grade === 'Pass' ? 'status-active' : cert.grade === 'Distinction' ? 'status-certificate-issued' : 'status-inactive'}`}>
                    {cert.grade}
                  </span>
                </td>
                <td><code>{cert.verificationCode}</code></td>
                <td>
                  <span className={`status-badge status-${cert.status.toLowerCase()}`}>
                    {cert.status}
                  </span>
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
            <h2 className="modal-title">Issue Certificate</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Student *</label>
                    <select name="student" value={formData.student} onChange={handleInputChange} required>
                      <option value="">Select Student</option>
                      {students.map(student => (
                        <option key={student._id} value={student._id}>{student.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Course *</label>
                    <input type="text" name="course" value={formData.course} onChange={handleInputChange} required />
                  </div>
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
                    <label>Issue Date *</label>
                    <input type="date" name="issueDate" value={formData.issueDate} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Grade *</label>
                    <select name="grade" value={formData.grade} onChange={handleInputChange} required>
                      <option value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                      <option value="Distinction">Distinction</option>
                      <option value="Merit">Merit</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status *</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} required>
                      <option value="Active">Active</option>
                      <option value="Revoked">Revoked</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Issue Certificate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
