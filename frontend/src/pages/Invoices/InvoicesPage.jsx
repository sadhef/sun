import { useState, useEffect } from 'react';
import axios from 'axios';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const { data } = await axios.get('/api/v1/invoices', { params });
      setInvoices(data.data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      await axios.put(`/api/v1/invoices/${id}/paid`, {
        paymentDate: new Date(),
        paymentMethod: 'Bank Transfer'
      });
      fetchInvoices();
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      alert('Failed to mark invoice as paid');
    }
  };

  const formatCurrency = (amount) => {
    return `KD ${parseFloat(amount).toFixed(3)}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Invoices</h1>
          <div id="breadcrumb-container">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Invoices</span>
          </div>
        </div>
        <div className="header-actions">
          <div id="status-filters-container" style={{display: 'flex', gap: '10px'}}>
            <button className={`btn btn-sm ${filter === 'all' ? 'active-filter' : ''}`} data-status="all" onClick={() => setFilter('all')}>All</button>
            <button className={`btn btn-sm status-draft ${filter === 'Draft' ? 'active-filter' : ''}`} onClick={() => setFilter('Draft')}>Draft</button>
            <button className={`btn btn-sm status-sent ${filter === 'Sent' ? 'active-filter' : ''}`} onClick={() => setFilter('Sent')}>Sent</button>
            <button className={`btn btn-sm status-paid ${filter === 'Paid' ? 'active-filter' : ''}`} onClick={() => setFilter('Paid')}>Paid</button>
          </div>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Client</th>
            <th>Issue Date</th>
            <th>Due Date</th>
            <th>Subtotal</th>
            <th>Tax</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="9" className="text-center">Loading...</td></tr>
          ) : invoices.length === 0 ? (
            <tr><td colSpan="9" className="text-center">No invoices found</td></tr>
          ) : (
            invoices.map(invoice => (
              <tr key={invoice._id}>
                <td>{invoice.invoiceNumber}</td>
                <td>{invoice.client}</td>
                <td>{formatDate(invoice.issueDate)}</td>
                <td>{formatDate(invoice.dueDate)}</td>
                <td>{formatCurrency(invoice.subtotal)}</td>
                <td>{formatCurrency(invoice.tax?.amount || 0)}</td>
                <td><strong>{formatCurrency(invoice.totalAmount)}</strong></td>
                <td>
                  <span className={`status-badge status-${invoice.status.toLowerCase()}`}>
                    {invoice.status}
                  </span>
                </td>
                <td>
                  <div className="action-icons-container">
                    {invoice.status !== 'Paid' && (
                      <button className="btn btn-sm btn-success" onClick={() => handleMarkAsPaid(invoice._id)}>
                        Mark as Paid
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicesPage;
