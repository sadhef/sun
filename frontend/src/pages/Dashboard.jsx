import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ appData = {}, appState = {} }) => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    openEnquiriesCount: 0,
    pendingNominationsCount: 0,
    upcomingClassesCount: 0,
    pendingLeavesCount: 0,
    pendingInvoicesCount: 0,
    pendingInvoicesAmount: 0,
    totalRevenue: 0
  });
  const [todaysClasses, setTodaysClasses] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);

  // Default empty data structure
  const defaultAppData = {
    enquiries: [],
    schedules: [],
    trainerLeaves: [],
    invoices: []
  };

  const toYYYYMMDD = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Memoize the data loading functions to prevent unnecessary re-renders
  const loadTodaysSchedule = useCallback(() => {
    const data = appData || defaultAppData;
    const todayStr = toYYYYMMDD(new Date());
    const schedules = data.schedules || [];
    const enquiries = data.enquiries || [];

    const todaysClasses = schedules
      .filter(s => s?.date === todayStr)
      .sort((a, b) => (a?.startTime || '').localeCompare(b?.startTime || ''))
      .map(schedule => {
        const enquiry = enquiries.find(e => e?.id === schedule?.enquiryId);
        return {
          ...schedule,
          client: enquiry ? enquiry.client : 'Internal',
          course: schedule?.course || 'Unknown Course'
        };
      });

    setTodaysClasses(todaysClasses);
  }, [appData]);

  const loadRecentEnquiries = useCallback(() => {
    const data = appData || defaultAppData;
    const enquiries = data.enquiries || [];
    const recentEnquiries = [...enquiries]
      .sort((a, b) => new Date(b?.date || 0) - new Date(a?.date || 0))
      .slice(0, 5);

    setRecentEnquiries(recentEnquiries);
  }, [appData]);

  const calculateMetrics = useCallback(() => {
    // Use default data if appData is undefined
    const data = appData || defaultAppData;
    
    // Safe array access with fallbacks
    const enquiries = data.enquiries || [];
    const schedules = data.schedules || [];
    const trainerLeaves = data.trainerLeaves || [];
    const invoices = data.invoices || [];

    // Open Enquiries
    const openEnquiriesCount = enquiries.filter(e => 
      ['Draft', 'Quotation Sent', 'Agreement Pending', 'Agreement Sent'].includes(e?.status)
    ).length;

    // Pending Nominations
    const pendingNominationsCount = enquiries.filter(e => 
      ['Pending Nomination', 'Nominated'].includes(e?.status)
    ).length;

    // Upcoming Classes (next 7 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);

    const upcomingClassesCount = schedules.filter(s => {
      if (!s?.date) return false;
      const scheduleDate = new Date(s.date);
      return scheduleDate >= today && scheduleDate <= sevenDaysLater;
    }).length;

    // Pending Leaves
    const pendingLeavesCount = trainerLeaves.filter(l => l?.status === 'Pending').length;

    // Pending Invoices
    const pendingInvoices = invoices.filter(inv => ['Draft', 'Sent'].includes(inv?.status));
    const pendingInvoicesCount = pendingInvoices.length;
    const pendingInvoicesAmount = pendingInvoices.reduce((sum, inv) => sum + (inv?.totalAmount || 0), 0);

    // Total Revenue
    const totalRevenue = invoices.filter(inv => inv?.status === 'Paid')
      .reduce((sum, inv) => sum + (inv?.totalAmount || 0), 0);

    setMetrics({
      openEnquiriesCount,
      pendingNominationsCount,
      upcomingClassesCount,
      pendingLeavesCount,
      pendingInvoicesCount,
      pendingInvoicesAmount,
      totalRevenue
    });

    // Load today's schedule and recent enquiries
    loadTodaysSchedule();
    loadRecentEnquiries();
  }, [appData, loadTodaysSchedule, loadRecentEnquiries]);

  useEffect(() => {
    calculateMetrics();
  }, [calculateMetrics]);

  const getDisplayStatus = (enq) => {
    if (!enq) return 'Unknown';
    
    if (enq.status === 'Completed') {
      if (enq.certificateIssued) {
        return 'Certificate Issued';
      }
      const invoice = (appData?.invoices || []).find(inv => inv?.id === enq.invoiceId);
      if (invoice) {
        if (invoice.status === 'Paid') {
          return 'Payment Received';
        }
        return 'Payment Pending';
      }
      return 'Certificate Pending';
    }
    return enq.status || 'Unknown';
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return 'status-unknown';
    const statusClass = status.toLowerCase().replace(/\s+/g, '-');
    return `status-badge status-${statusClass}`;
  };

  const handleStatCardClick = (page) => {
    navigate(`/${page}`);
  };

  const StatCard = ({ icon, backgroundColor, number, label, subLabel, navigateTo }) => (
    <div 
      className="flex items-center bg-white rounded-lg p-5 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={() => handleStatCardClick(navigateTo)}
    >
      <div 
        className="flex items-center justify-center w-12 h-12 rounded-lg text-white text-xl mr-4"
        style={{ backgroundColor }}
      >
        <i className={icon}></i>
      </div>
      <div className="flex flex-col">
        <div className="text-2xl font-semibold text-gray-800">{number}</div>
        <div className="text-sm font-medium text-gray-600">{label}</div>
        {subLabel && (
          <div className="text-xs font-bold text-gray-700 mt-1">{subLabel}</div>
        )}
      </div>
    </div>
  );

  const DashboardListItem = ({ children, onClick }) => (
    <div 
      className={`flex justify-between items-center p-3 border-b border-gray-100 last:border-b-0 ${
        onClick ? 'cursor-pointer hover:bg-gray-50' : ''
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );

  const StatusBadge = ({ status }) => {
    const badgeClass = getStatusBadgeClass(status);
    return (
      <span className={`status-badge ${badgeClass}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="text-gray-900 font-medium">Dashboard</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard
          icon="fas fa-file-invoice-dollar"
          backgroundColor="#f59e0b"
          number={metrics.pendingInvoicesCount}
          label="Pending Invoices"
          subLabel={`(${metrics.pendingInvoicesAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })})`}
          navigateTo="invoices"
        />
        
        <StatCard
          icon="fas fa-chart-line"
          backgroundColor="#10b981"
          number={metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          label="Total Revenue"
          navigateTo="revenue"
        />
        
        <StatCard
          icon="fas fa-file-alt"
          backgroundColor="#3498db"
          number={metrics.openEnquiriesCount}
          label="Open Enquiries"
          navigateTo="pending_enquiries"
        />
        
        <StatCard
          icon="fas fa-user-check"
          backgroundColor="#9b59b6"
          number={metrics.pendingNominationsCount}
          label="Pending Nominations"
          navigateTo="pending_nominations"
        />
        
        <StatCard
          icon="fas fa-calendar-alt"
          backgroundColor="#16a085"
          number={metrics.upcomingClassesCount}
          label="Upcoming Classes (7d)"
          navigateTo="schedule"
        />
        
        <StatCard
          icon="fas fa-calendar-times"
          backgroundColor="#ef4444"
          number={metrics.pendingLeavesCount}
          label="Pending Leave Approvals"
          navigateTo="trainer"
        />
      </div>

      {/* Today's Schedule and Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Today's Schedule</h3>
          </div>
          <div className="p-4">
            {todaysClasses.length > 0 ? (
              todaysClasses.map((schedule, index) => (
                <DashboardListItem key={index}>
                  <div>
                    <div className="font-semibold text-gray-800">{schedule.course}</div>
                    <div className="text-sm text-gray-500">
                      {schedule.client} | {schedule.room || 'No Room'}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {schedule.startTime || 'N/A'} - {schedule.endTime || 'N/A'}
                  </span>
                </DashboardListItem>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No classes scheduled for today.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Recent Enquiries</h3>
          </div>
          <div className="p-4">
            {recentEnquiries.length > 0 ? (
              recentEnquiries.map((enquiry, index) => (
                <DashboardListItem 
                  key={index}
                  onClick={() => navigate('/enquiries')}
                >
                  <div>
                    <div className="font-semibold text-gray-800">{enquiry?.client || 'Unknown Client'}</div>
                    <div className="text-sm text-gray-500">{enquiry?.course || 'Unknown Course'}</div>
                  </div>
                  <StatusBadge status={getDisplayStatus(enquiry)} />
                </DashboardListItem>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No recent enquiries found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;