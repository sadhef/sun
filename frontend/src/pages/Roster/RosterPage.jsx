import { useState, useEffect } from 'react';
import axios from 'axios';

const RosterPage = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/v1/batches');
      setBatches(data.data || []);
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Class Roster</h1>
          <div id="breadcrumb-container">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Class Roster</span>
          </div>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Batch ID</th>
            <th>Course</th>
            <th>Client</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Students</th>
            <th>Trainer</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="8" className="text-center">Loading...</td></tr>
          ) : batches.length === 0 ? (
            <tr><td colSpan="8" className="text-center">No batches found</td></tr>
          ) : (
            batches.map(batch => (
              <tr key={batch._id}>
                <td>{batch.batchId}</td>
                <td>{batch.enquiry?.course || 'N/A'}</td>
                <td>{batch.enquiry?.client || 'N/A'}</td>
                <td>{formatDate(batch.startDate)}</td>
                <td>{formatDate(batch.endDate)}</td>
                <td className="text-center">{batch.students?.length || 0}/{batch.capacity || 0}</td>
                <td>{batch.trainer?.name || 'Not Assigned'}</td>
                <td>
                  <span className={`status-badge status-${batch.status.toLowerCase()}`}>
                    {batch.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RosterPage;
