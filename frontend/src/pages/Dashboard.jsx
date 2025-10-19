import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import enquiryService from '../services/enquiryService';
import { toast } from 'react-hot-toast';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingInvoicesCount: 0,
    pendingInvoicesAmount: 0,
    totalRevenue: 0,
    openEnquiries: 0,
    pendingNominations: 0,
    upcomingClasses: 0,
    pendingLeaves: 0
  });
  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data } = await enquiryService.getEnquiryStats();
      setStats({
        pendingInvoicesCount: 0,
        pendingInvoicesAmount: 0,
        totalRevenue: 0,
        openEnquiries: data.openEnquiries || 0,
        pendingNominations: data.pendingNominations || 0,
        upcomingClasses: 0,
        pendingLeaves: 0
      });

      // Fetch recent enquiries
      const enquiriesResponse = await enquiryService.getEnquiries();
      const sorted = [...enquiriesResponse.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentEnquiries(sorted.slice(0, 5));
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Pending Invoices',
      value: stats.pendingInvoicesCount,
      subtitle: `(${stats.pendingInvoicesAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })})`,
      icon: 'fa-file-invoice-dollar',
      bgColor: '#f39c12',
      navigate: 'invoices'
    },
    {
      title: 'Total Revenue',
      value: stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      icon: 'fa-chart-line',
      bgColor: '#27ae60',
      navigate: 'revenue'
    },
    {
      title: 'Open Enquiries',
      value: stats.openEnquiries,
      icon: 'fa-file-alt',
      bgColor: '#3498db',
      navigate: 'pending_enquiries'
    },
    {
      title: 'Pending Nominations',
      value: stats.pendingNominations,
      icon: 'fa-user-check',
      bgColor: '#9b59b6',
      navigate: 'pending_nominations'
    },
    {
      title: 'Upcoming Classes (7d)',
      value: stats.upcomingClasses,
      icon: 'fa-calendar-alt',
      bgColor: '#16a085',
      navigate: 'schedule'
    },
    {
      title: 'Pending Leave Approvals',
      value: stats.pendingLeaves,
      icon: 'fa-calendar-times',
      bgColor: '#d7685b',
      navigate: 'trainer'
    }
  ];

  const handleCardClick = (page) => {
    // Navigation logic based on page ID
    if (page === 'pending_enquiries') {
      navigate('/enquiries/pending');
    } else if (page === 'pending_nominations') {
      navigate('/nomination/pending');
    } else {
      navigate(`/${page}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="text-sm font-normal">
          <span className="text-[#888] no-underline">Dashboard</span>
        </div>
      </div>

      {/* Dashboard Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white p-[15px] rounded-lg shadow-custom flex items-center gap-[15px] cursor-pointer transition-all duration-200 hover:-translate-y-[3px] hover:shadow-hover"
            onClick={() => handleCardClick(card.navigate)}
          >
            <div
              className={`text-2xl p-3 rounded-full text-white flex items-center justify-center w-[24px] h-[24px] ${
                card.icon === 'fa-file-invoice-dollar' ? 'bg-warning' :
                card.icon === 'fa-chart-line' ? 'bg-success' :
                card.icon === 'fa-file-alt' ? 'bg-peter-river' :
                card.icon === 'fa-user-check' ? 'bg-wisteria' :
                card.icon === 'fa-calendar-alt' ? 'bg-turquoise' :
                card.icon === 'fa-calendar-times' ? 'bg-danger' : ''
              }`}
            >
              <i className={`fas ${card.icon}`}></i>
            </div>
            <div className="flex-1">
              <div className="text-[1.6rem] font-bold">
                {loading ? <i className="fas fa-spinner fa-spin text-gray-400"></i> : card.value}
              </div>
              <div className="text-[0.8rem] text-[#666]">{card.title}</div>
              {card.subtitle && (
                <div className="text-[0.8rem] text-[#666] font-bold">{card.subtitle}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        {/* Today's Schedule */}
        <div className="bg-white p-5 rounded-lg shadow-custom">
          <h3 className="mt-0 mb-[15px] text-base font-semibold">Today's Schedule</h3>
          <div>
            {todaysSchedule.length > 0 ? (
              todaysSchedule.map((schedule, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-[10px] border-b border-border-color text-[0.85rem] last:border-b-0"
                >
                  <div>
                    <strong>{schedule.course}</strong>
                    <br />
                    <small>{schedule.client || 'Internal'} | {schedule.room}</small>
                  </div>
                  <span>{schedule.startTime} - {schedule.endTime}</span>
                </div>
              ))
            ) : (
              <p className="text-[#888] m-0">No classes scheduled for today.</p>
            )}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white p-5 rounded-lg shadow-custom">
          <h3 className="mt-0 mb-[15px] text-base font-semibold">Recent Enquiries</h3>
          <div>
            {recentEnquiries.length > 0 ? (
              recentEnquiries.map((enquiry) => (
                <div
                  key={enquiry._id}
                  className="flex justify-between items-center py-[10px] border-b border-border-color text-[0.85rem] last:border-b-0"
                >
                  <div>
                    <strong>{enquiry.enquiryId}</strong> - {enquiry.client?.name || 'N/A'}
                    <br />
                    <small>{enquiry.course?.name || 'N/A'}</small>
                  </div>
                  <div className="text-right">
                    <div
                      className={`px-[10px] py-1 rounded-xl text-[11px] font-medium text-white text-center whitespace-nowrap inline-block ${
                        enquiry.status === 'Draft' ? 'bg-slate-gray' :
                        enquiry.status === 'Quotation Sent' ? 'bg-warning' :
                        enquiry.status === 'Agreement Pending' ? 'bg-turquoise' :
                        enquiry.status === 'Agreement Sent' ? 'bg-carrot-orange' :
                        enquiry.status === 'Pending Nomination' ? 'bg-wisteria' :
                        enquiry.status === 'Nominated' ? 'bg-peter-river' :
                        enquiry.status === 'Scheduled' ? 'bg-success' :
                        enquiry.status === 'Completed' ? 'bg-wet-asphalt' : 'bg-slate-gray'
                      }`}
                    >
                      {enquiry.status}
                    </div>
                    <br />
                    <small className="text-[#999]">{formatDate(enquiry.createdAt)}</small>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#888] m-0">No recent enquiries.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
