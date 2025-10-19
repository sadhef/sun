import { useState } from 'react';
import axios from 'axios';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('enquiries');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const generateReport = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      alert('Please select both start and end dates');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(`/api/v1/reports/${reportType}`, {
        params: dateRange
      });
      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount) => {
    return `KD ${parseFloat(amount).toFixed(3)}`;
  };

  const exportToCSV = () => {
    if (!reportData || !reportData.data) return;

    let csvContent = '';
    const headers = Object.keys(reportData.data[0] || {});
    csvContent += headers.join(',') + '\n';

    reportData.data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'object' ? JSON.stringify(value) : value;
      });
      csvContent += values.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <div id="breadcrumb-container">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Reports</span>
          </div>
        </div>
      </div>

      <div style={{backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px'}}>
        <div className="form-grid">
          <div className="form-group">
            <label>Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="enquiries">Enquiries Report</option>
              <option value="schedules">Schedules Report</option>
              <option value="revenue">Revenue Report</option>
              <option value="certificates">Certificates Report</option>
            </select>
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" name="startDate" value={dateRange.startDate} onChange={handleDateChange} />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input type="date" name="endDate" value={dateRange.endDate} onChange={handleDateChange} />
          </div>
          <div className="form-group" style={{display: 'flex', alignItems: 'flex-end'}}>
            <button className="btn btn-primary" onClick={generateReport} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {reportData && (
        <>
          <div style={{marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <h3 style={{margin: 0}}>Report Results</h3>
              <p style={{margin: '5px 0', color: '#666'}}>Total Records: {reportData.count}</p>
              {reportType === 'revenue' && (
                <div style={{marginTop: '10px'}}>
                  <p style={{margin: '5px 0', fontSize: '1.1rem'}}><strong>Total Revenue:</strong> {formatCurrency(reportData.totalRevenue || 0)}</p>
                  <p style={{margin: '5px 0', fontSize: '1.1rem'}}><strong>Total Tax:</strong> {formatCurrency(reportData.totalTax || 0)}</p>
                </div>
              )}
            </div>
            <button className="btn btn-success" onClick={exportToCSV}>
              <i className="fas fa-download"></i> Export to CSV
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                {reportType === 'enquiries' && (
                  <>
                    <th>Enquiry ID</th>
                    <th>Client</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Status</th>
                  </>
                )}
                {reportType === 'schedules' && (
                  <>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Course</th>
                    <th>Trainer</th>
                    <th>Room</th>
                    <th>Status</th>
                  </>
                )}
                {reportType === 'revenue' && (
                  <>
                    <th>Invoice #</th>
                    <th>Client</th>
                    <th>Paid Date</th>
                    <th>Subtotal</th>
                    <th>Tax</th>
                    <th>Total</th>
                  </>
                )}
                {reportType === 'certificates' && (
                  <>
                    <th>Certificate #</th>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Trainer</th>
                    <th>Issue Date</th>
                    <th>Grade</th>
                    <th>Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {reportData.data.length === 0 ? (
                <tr><td colSpan="10" className="text-center">No data found for selected criteria</td></tr>
              ) : (
                reportData.data.map((row, idx) => (
                  <tr key={idx}>
                    {reportType === 'enquiries' && (
                      <>
                        <td>{row.enquiryId}</td>
                        <td>{row.client}</td>
                        <td>{row.course}</td>
                        <td>{formatDate(row.date)}</td>
                        <td><span className={`status-badge status-${row.status.toLowerCase().replace(' ', '-')}`}>{row.status}</span></td>
                      </>
                    )}
                    {reportType === 'schedules' && (
                      <>
                        <td>{formatDate(row.date)}</td>
                        <td>{row.startTime} - {row.endTime}</td>
                        <td>{row.enquiry?.course || 'N/A'}</td>
                        <td>{row.trainer?.name || 'N/A'}</td>
                        <td>{row.room?.name || 'N/A'}</td>
                        <td><span className={`status-badge status-${row.status.toLowerCase()}`}>{row.status}</span></td>
                      </>
                    )}
                    {reportType === 'revenue' && (
                      <>
                        <td>{row.invoiceNumber}</td>
                        <td>{row.client}</td>
                        <td>{formatDate(row.paidDate)}</td>
                        <td>{formatCurrency(row.subtotal)}</td>
                        <td>{formatCurrency(row.tax?.amount || 0)}</td>
                        <td><strong>{formatCurrency(row.totalAmount)}</strong></td>
                      </>
                    )}
                    {reportType === 'certificates' && (
                      <>
                        <td>{row.certificateNumber}</td>
                        <td>{row.student?.name || 'N/A'}</td>
                        <td>{row.course}</td>
                        <td>{row.trainer?.name || 'N/A'}</td>
                        <td>{formatDate(row.issueDate)}</td>
                        <td><span className={`status-badge ${row.grade === 'Pass' ? 'status-active' : 'status-inactive'}`}>{row.grade}</span></td>
                        <td><span className={`status-badge status-${row.status.toLowerCase()}`}>{row.status}</span></td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ReportsPage;
