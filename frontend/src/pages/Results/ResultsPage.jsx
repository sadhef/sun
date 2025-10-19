import { useState, useEffect } from 'react';
import axios from 'axios';

const ResultsPage = () => {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [resultData, setResultData] = useState({
    attendance: '',
    assessmentScore: '',
    finalGrade: 'Pass',
    remarks: ''
  });

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      fetchBatchStudents();
    }
  }, [selectedBatch]);

  const fetchBatches = async () => {
    try {
      const { data } = await axios.get('/api/v1/batches');
      setBatches(data.data || []);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const fetchBatchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/v1/batches/${selectedBatch}`);
      setStudents(data.data?.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResultData(prev => ({ ...prev, [name]: value }));
  };

  const openResultModal = (student) => {
    setCurrentStudent(student);
    setResultData({
      attendance: student.attendance || '',
      assessmentScore: student.assessmentScore || '',
      finalGrade: student.finalGrade || 'Pass',
      remarks: student.remarks || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/v1/students/${currentStudent._id}/results`, resultData);
      fetchBatchStudents();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Failed to save results');
    }
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Results</h1>
          <div id="breadcrumb-container">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Results</span>
          </div>
        </div>
      </div>

      <div style={{backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px'}}>
        <div className="form-group">
          <label>Select Batch</label>
          <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
            <option value="">Select a batch</option>
            {batches.map(batch => (
              <option key={batch._id} value={batch._id}>
                {batch.batchId} - {batch.enquiry?.course || 'N/A'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedBatch && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Civil ID</th>
              <th>Attendance %</th>
              <th>Assessment Score</th>
              <th>Final Grade</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center">Loading...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan="7" className="text-center">No students found in this batch</td></tr>
            ) : (
              students.map(student => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.civilId}</td>
                  <td>{student.attendance || 'N/A'}</td>
                  <td>{student.assessmentScore || 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${student.finalGrade === 'Pass' ? 'status-active' : student.finalGrade === 'Fail' ? 'status-rejected' : 'status-certificate-issued'}`}>
                      {student.finalGrade || 'Pending'}
                    </span>
                  </td>
                  <td>{student.remarks || 'N/A'}</td>
                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => openResultModal(student)}>
                      Update Results
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal show">
          <div className="modal-content modal-md">
            <span className="modal-close" onClick={() => setShowModal(false)}>&times;</span>
            <h2 className="modal-title">Update Student Results - {currentStudent?.name}</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Attendance %</label>
                    <input type="number" name="attendance" value={resultData.attendance} onChange={handleInputChange} min="0" max="100" />
                  </div>
                  <div className="form-group">
                    <label>Assessment Score</label>
                    <input type="number" name="assessmentScore" value={resultData.assessmentScore} onChange={handleInputChange} min="0" max="100" />
                  </div>
                  <div className="form-group">
                    <label>Final Grade</label>
                    <select name="finalGrade" value={resultData.finalGrade} onChange={handleInputChange}>
                      <option value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                      <option value="Distinction">Distinction</option>
                      <option value="Merit">Merit</option>
                    </select>
                  </div>
                  <div className="form-group" style={{gridColumn: '1 / -1'}}>
                    <label>Remarks</label>
                    <textarea name="remarks" value={resultData.remarks} onChange={handleInputChange} rows="4"></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Results</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
