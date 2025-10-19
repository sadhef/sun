import { useState, useEffect } from 'react';
import axios from 'axios';

const FeedbackPage = () => {
  const [batches, setBatches] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const { data } = await axios.get('/api/v1/batches');
      setBatches(data.data || []);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const fetchFeedback = async (batchId) => {
    setLoading(true);
    try {
      // Since we don't have a feedback API yet, this is placeholder
      // In real implementation, this would call /api/v1/feedback?batch=batchId
      setFeedbacks([]);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    setSelectedBatch(batchId);
    if (batchId) {
      fetchFeedback(batchId);
    } else {
      setFeedbacks([]);
    }
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Course Feedback</h1>
          <div id="breadcrumb-container">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Feedback</span>
          </div>
        </div>
      </div>

      <div style={{backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px'}}>
        <div className="form-group">
          <label>Select Batch to View Feedback</label>
          <select value={selectedBatch} onChange={handleBatchChange}>
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
        <div style={{backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          {loading ? (
            <p className="text-center">Loading feedback...</p>
          ) : feedbacks.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px'}}>
              <i className="fas fa-comments" style={{fontSize: '3rem', color: '#ccc', marginBottom: '20px'}}></i>
              <p style={{color: '#666', fontSize: '1.1rem'}}>No feedback submitted for this batch yet.</p>
              <p style={{color: '#999'}}>Feedback will appear here once students complete the course evaluation.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Rating</th>
                  <th>Comments</th>
                  <th>Submitted Date</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((feedback, idx) => (
                  <tr key={idx}>
                    <td>{feedback.studentName}</td>
                    <td>
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fas fa-star ${i < feedback.rating ? 'text-warning' : 'text-muted'}`}></i>
                      ))}
                    </td>
                    <td>{feedback.comments}</td>
                    <td>{new Date(feedback.submittedDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
