import { useState, useEffect } from 'react';
import axios from 'axios';

const RevenuePage = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    monthlyRevenue: []
  });
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchRevenueData();
  }, [dateRange]);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/v1/reports/revenue', {
        params: dateRange
      });

      const allInvoices = await axios.get('/api/v1/invoices');
      const invoicesData = allInvoices.data.data || [];

      const paidInvoices = invoicesData.filter(inv => inv.status === 'Paid');
      const pendingInvoices = invoicesData.filter(inv => inv.status !== 'Paid');

      setStats({
        totalRevenue: data.totalRevenue || 0,
        pendingAmount: pendingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
        paidInvoices: paidInvoices.length,
        pendingInvoices: pendingInvoices.length,
        totalTax: data.totalTax || 0
      });

      setInvoices(data.data || []);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
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
          <h1 className="page-title">Revenue Dashboard</h1>
          <div id="breadcrumb-container">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Revenue</span>
          </div>
        </div>
      </div>

      <div style={{backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px'}}>
        <div className="form-grid">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card" style={{backgroundColor: '#fff'}}>
          <div className="icon" style={{backgroundColor: '#27ae60'}}>
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="info">
            <div className="number">{formatCurrency(stats.totalRevenue)}</div>
            <div className="label">Total Revenue</div>
          </div>
        </div>

        <div className="stat-card" style={{backgroundColor: '#fff'}}>
          <div className="icon" style={{backgroundColor: '#f39c12'}}>
            <i className="fas fa-clock"></i>
          </div>
          <div className="info">
            <div className="number">{formatCurrency(stats.pendingAmount)}</div>
            <div className="label">Pending Amount</div>
          </div>
        </div>

        <div className="stat-card" style={{backgroundColor: '#fff'}}>
          <div className="icon" style={{backgroundColor: '#4a90e2'}}>
            <i className="fas fa-file-invoice"></i>
          </div>
          <div className="info">
            <div className="number">{stats.paidInvoices}</div>
            <div className="label">Paid Invoices</div>
          </div>
        </div>

        <div className="stat-card" style={{backgroundColor: '#fff'}}>
          <div className="icon" style={{backgroundColor: '#d7685b'}}>
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div className="info">
            <div className="number">{stats.pendingInvoices}</div>
            <div className="label">Pending Invoices</div>
          </div>
        </div>
      </div>

      <div className="dashboard-section" style={{marginTop: '20px'}}>
        <h3>Revenue Breakdown</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th>Paid Date</th>
              <th>Subtotal</th>
              <th>Tax</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center">Loading...</td></tr>
            ) : invoices.length === 0 ? (
              <tr><td colSpan="6" className="text-center">No revenue data for selected period</td></tr>
            ) : (
              invoices.map(invoice => (
                <tr key={invoice._id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.client}</td>
                  <td>{formatDate(invoice.paidDate)}</td>
                  <td>{formatCurrency(invoice.subtotal)}</td>
                  <td>{formatCurrency(invoice.tax?.amount || 0)}</td>
                  <td><strong>{formatCurrency(invoice.totalAmount)}</strong></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RevenuePage;
