import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import enquiryService from '../../services/enquiryService';

function PendingNominationsPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('table');
  const [currentStatusFilter, setCurrentStatusFilter] = useState('all');

  useEffect(() => {
    fetchPendingNominations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [enquiries, currentStatusFilter]);

  const fetchPendingNominations = async () => {
    try {
      setLoading(true);
      const { data } = await enquiryService.getEnquiries();
      // Filter for Pending Nomination and Nominated status
      const pending = data.filter(enq =>
        ['Pending Nomination', 'Nominated'].includes(enq.status)
      );
      setEnquiries(pending);
    } catch (error) {
      toast.error('Failed to fetch pending nominations');
    } finally {
      setLoading(false);
    }
  };

  const getNominationDisplayStatus = (enquiry) => {
    if (enquiry.status === 'Scheduled') return 'Scheduled';
    const classCapacity = enquiry.course?.classCapacity || enquiry.requested;
    if (enquiry.nominated >= classCapacity) return 'Fully Nominated';
    if (enquiry.nominated > 0) return 'Partially Nominated';
    return 'Pending Nomination';
  };

  const applyFilters = () => {
    let filtered = [...enquiries];

    if (currentStatusFilter !== 'all') {
      filtered = filtered.filter(enq => getNominationDisplayStatus(enq) === currentStatusFilter);
    }

    setFilteredEnquiries(filtered);
  };

  // Calculate status counts
  const statusCounts = {};
  enquiries.forEach(enq => {
    const status = getNominationDisplayStatus(enq);
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleConfirmNomination = async (enquiryId) => {
    const enquiry = enquiries.find(e => e._id === enquiryId);
    if (!enquiry) return;

    if (enquiry.nominated === 0) {
      toast.error('Cannot confirm a nomination with 0 nominees.');
      return;
    }

    if (!enquiry.startDate) {
      toast.error('Please set the Training Dates for this enquiry before confirming.');
      return;
    }

    const confirmAction = async () => {
      try {
        await enquiryService.updateEnquiryStatus(enquiryId, 'Scheduled');
        toast.success('Nomination confirmed and marked as scheduled');
        fetchPendingNominations();
      } catch (error) {
        toast.error('Failed to confirm nomination');
      }
    };

    if (enquiry.nominated < enquiry.requested) {
      if (window.confirm(`This is a partial nomination (${enquiry.nominated}/${enquiry.requested}). Are you sure you want to confirm?`)) {
        confirmAction();
      }
    } else {
      confirmAction();
    }
  };

  const renderTableView = () => {
    if (filteredEnquiries.length === 0) {
      return (
        <tr>
          <td colSpan="11" className="p-5 text-center text-[#888]">
            No pending nominations found.
          </td>
        </tr>
      );
    }

    return filteredEnquiries.map((enq, index) => {
      const pending = (enq.requested || 0) - (enq.nominated || 0);
      const displayStatus = getNominationDisplayStatus(enq);
      const startDate = formatDate(enq.startDate);
      const createdDate = formatDate(enq.createdAt);

      return (
        <tr key={enq._id}>
          <td className="p-[15px] text-left border-b border-border-color">{index + 1}</td>
          <td className="p-[15px] text-left border-b border-border-color">{enq.enquiryId}</td>
          <td className="p-[15px] text-left border-b border-border-color">{enq.batchNumber || '-'}</td>
          <td className="p-[15px] text-left border-b border-border-color">
            <strong>{enq.client?.name || enq.client}</strong>
          </td>
          <td className="p-[15px] text-left border-b border-border-color">{enq.course?.name || enq.course}</td>
          <td className="p-[15px] text-left border-b border-border-color text-center">
            {pending > 0 ? pending : '-'}
            <i
              className="fas fa-info-circle ml-2 text-primary cursor-pointer"
              title={`Requested: ${enq.requested}, Nominated: ${enq.nominated}, Pending: ${pending}`}
            ></i>
          </td>
          <td className="p-[15px] text-left border-b border-border-color">
            <div className="text-[11px] leading-[1.4]">
              <div>Date: {startDate}</div>
            </div>
          </td>
          <td className="p-[15px] text-left border-b border-border-color text-center text-[11px]">
            {createdDate}
          </td>
          <td className="p-[15px] text-left border-b border-border-color text-center">
            <span
              className="px-[10px] py-1 rounded-xl text-[11px] font-medium text-white inline-block"
              style={{
                backgroundColor:
                  displayStatus === 'Pending Nomination' ? '#8e44ad' :
                  displayStatus === 'Partially Nominated' ? '#f39c12' :
                  displayStatus === 'Fully Nominated' ? '#3498db' :
                  displayStatus === 'Scheduled' ? '#27ae60' : '#778899'
              }}
            >
              {displayStatus}
            </span>
          </td>
          <td className="p-[15px] text-left border-b border-border-color">
            <div className="flex gap-2 items-center">
              {displayStatus !== 'Scheduled' && (
                <button
                  onClick={() => handleConfirmNomination(enq._id)}
                  className="px-[10px] py-[5px] border-none rounded-[5px] cursor-pointer text-xs font-normal bg-success text-white hover:bg-opacity-90"
                >
                  Confirm Nomination
                </button>
              )}
              <span className="cursor-pointer text-primary hover:text-opacity-80" title="View Details">
                <i className="fas fa-eye"></i>
              </span>
              <span className="cursor-pointer text-primary hover:text-opacity-80" title="View Notes">
                <i className="fas fa-sticky-note"></i>
              </span>
            </div>
          </td>
        </tr>
      );
    });
  };

  const renderByClientView = () => {
    const groupedByClient = {};
    filteredEnquiries.forEach(enq => {
      const clientName = enq.client?.name || enq.client;
      if (!groupedByClient[clientName]) {
        groupedByClient[clientName] = [];
      }
      groupedByClient[clientName].push(enq);
    });

    const clients = Object.keys(groupedByClient).sort();

    return clients.map(client => {
      const clientEnquiries = groupedByClient[client];
      const totalPending = clientEnquiries.reduce((sum, enq) => sum + ((enq.requested || 0) - (enq.nominated || 0)), 0);

      return (
        <>
          <tr key={`client-${client}`}>
            <td colSpan="3" className="p-[15px] text-left border-b border-border-color font-bold bg-[#f9f9f9]">
              {client}
            </td>
            <td className="p-[15px] text-center border-b border-border-color font-bold bg-[#f9f9f9]">
              <span className="px-[8px] py-[4px] bg-warning text-white rounded-[12px] text-xs font-medium">
                {totalPending}
              </span>
            </td>
            <td colSpan="6" className="p-[15px] text-left border-b border-border-color bg-[#f9f9f9]"></td>
          </tr>
          {clientEnquiries.map((enq, index) => {
            const pending = (enq.requested || 0) - (enq.nominated || 0);
            const displayStatus = getNominationDisplayStatus(enq);
            const startDate = formatDate(enq.startDate);
            const createdDate = formatDate(enq.createdAt);

            return (
              <tr key={enq._id}>
                <td className="p-[15px] text-left border-b border-border-color">{index + 1}</td>
                <td className="p-[15px] text-left border-b border-border-color">{enq.enquiryId}</td>
                <td className="p-[15px] text-left border-b border-border-color">{enq.batchNumber || '-'}</td>
                <td className="p-[15px] text-left border-b border-border-color">{enq.course?.name || enq.course}</td>
                <td className="p-[15px] text-left border-b border-border-color text-center">
                  {pending > 0 ? pending : '-'}
                </td>
                <td className="p-[15px] text-left border-b border-border-color">
                  <div className="text-[11px] leading-[1.4]">
                    <div>Date: {startDate}</div>
                  </div>
                </td>
                <td className="p-[15px] text-left border-b border-border-color text-center text-[11px]">
                  {createdDate}
                </td>
                <td className="p-[15px] text-left border-b border-border-color text-center">
                  <span
                    className="px-[10px] py-1 rounded-xl text-[11px] font-medium text-white inline-block"
                    style={{
                      backgroundColor:
                        displayStatus === 'Pending Nomination' ? '#8e44ad' :
                        displayStatus === 'Partially Nominated' ? '#f39c12' :
                        displayStatus === 'Fully Nominated' ? '#3498db' :
                        displayStatus === 'Scheduled' ? '#27ae60' : '#778899'
                    }}
                  >
                    {displayStatus}
                  </span>
                </td>
                <td className="p-[15px] text-left border-b border-border-color">
                  <div className="flex gap-2 items-center">
                    {displayStatus !== 'Scheduled' && (
                      <button
                        onClick={() => handleConfirmNomination(enq._id)}
                        className="px-[10px] py-[5px] border-none rounded-[5px] cursor-pointer text-xs font-normal bg-success text-white hover:bg-opacity-90"
                      >
                        Confirm
                      </button>
                    )}
                    <span className="cursor-pointer text-primary hover:text-opacity-80">
                      <i className="fas fa-eye"></i>
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </>
      );
    });
  };

  const renderByCourseView = () => {
    const groupedByCourse = {};
    filteredEnquiries.forEach(enq => {
      const courseName = enq.course?.name || enq.course;
      if (!groupedByCourse[courseName]) {
        groupedByCourse[courseName] = [];
      }
      groupedByCourse[courseName].push(enq);
    });

    const courses = Object.keys(groupedByCourse).sort();

    return courses.map(course => {
      const courseEnquiries = groupedByCourse[course];
      const totalPending = courseEnquiries.reduce((sum, enq) => sum + ((enq.requested || 0) - (enq.nominated || 0)), 0);

      return (
        <>
          <tr key={`course-${course}`}>
            <td colSpan="3" className="p-[15px] text-left border-b border-border-color font-bold bg-[#f9f9f9]">
              {course}
            </td>
            <td className="p-[15px] text-center border-b border-border-color font-bold bg-[#f9f9f9]">
              <span className="px-[8px] py-[4px] bg-warning text-white rounded-[12px] text-xs font-medium">
                {totalPending}
              </span>
            </td>
            <td colSpan="6" className="p-[15px] text-left border-b border-border-color bg-[#f9f9f9]"></td>
          </tr>
          {courseEnquiries.map((enq, index) => {
            const pending = (enq.requested || 0) - (enq.nominated || 0);
            const displayStatus = getNominationDisplayStatus(enq);
            const startDate = formatDate(enq.startDate);
            const createdDate = formatDate(enq.createdAt);

            return (
              <tr key={enq._id}>
                <td className="p-[15px] text-left border-b border-border-color">{index + 1}</td>
                <td className="p-[15px] text-left border-b border-border-color">{enq.enquiryId}</td>
                <td className="p-[15px] text-left border-b border-border-color">{enq.batchNumber || '-'}</td>
                <td className="p-[15px] text-left border-b border-border-color">
                  <strong>{enq.client?.name || enq.client}</strong>
                </td>
                <td className="p-[15px] text-left border-b border-border-color text-center">
                  {pending > 0 ? pending : '-'}
                </td>
                <td className="p-[15px] text-left border-b border-border-color">
                  <div className="text-[11px] leading-[1.4]">
                    <div>Date: {startDate}</div>
                  </div>
                </td>
                <td className="p-[15px] text-left border-b border-border-color text-center text-[11px]">
                  {createdDate}
                </td>
                <td className="p-[15px] text-left border-b border-border-color text-center">
                  <span
                    className="px-[10px] py-1 rounded-xl text-[11px] font-medium text-white inline-block"
                    style={{
                      backgroundColor:
                        displayStatus === 'Pending Nomination' ? '#8e44ad' :
                        displayStatus === 'Partially Nominated' ? '#f39c12' :
                        displayStatus === 'Fully Nominated' ? '#3498db' :
                        displayStatus === 'Scheduled' ? '#27ae60' : '#778899'
                    }}
                  >
                    {displayStatus}
                  </span>
                </td>
                <td className="p-[15px] text-left border-b border-border-color">
                  <div className="flex gap-2 items-center">
                    {displayStatus !== 'Scheduled' && (
                      <button
                        onClick={() => handleConfirmNomination(enq._id)}
                        className="px-[10px] py-[5px] border-none rounded-[5px] cursor-pointer text-xs font-normal bg-success text-white hover:bg-opacity-90"
                      >
                        Confirm
                      </button>
                    )}
                    <span className="cursor-pointer text-primary hover:text-opacity-80">
                      <i className="fas fa-eye"></i>
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </>
      );
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="text-sm font-normal">
          <a href="#" className="text-[#888] no-underline hover:underline">Nomination</a>
          <span className="mx-2 text-[#aaa]">/</span>
          <span className="text-font-color font-bold">Pending Nominations</span>
        </div>
        <div className="flex items-center gap-[15px]">
          <div className="inline-flex border border-border-color rounded-[5px] overflow-hidden">
            <button
              onClick={() => setCurrentView('table')}
              className={`px-[15px] py-[10px] border-none cursor-pointer font-inter text-sm border-l border-border-color first:border-l-0 ${
                currentView === 'table'
                  ? 'shadow-[inset_0_0_0_1px_#4a90e2] text-primary bg-transparent'
                  : 'bg-transparent'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setCurrentView('client')}
              className={`px-[15px] py-[10px] border-none cursor-pointer font-inter text-sm border-l border-border-color ${
                currentView === 'client'
                  ? 'shadow-[inset_0_0_0_1px_#4a90e2] text-primary bg-transparent'
                  : 'bg-transparent'
              }`}
            >
              By Client
            </button>
            <button
              onClick={() => setCurrentView('course')}
              className={`px-[15px] py-[10px] border-none cursor-pointer font-inter text-sm border-l border-border-color ${
                currentView === 'course'
                  ? 'shadow-[inset_0_0_0_1px_#4a90e2] text-primary bg-transparent'
                  : 'bg-transparent'
              }`}
            >
              By Course
            </button>
          </div>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-5 pb-[15px] border-b border-border-color">
        <button
          onClick={() => setCurrentStatusFilter('all')}
          className={`px-[10px] py-[5px] border-none rounded-[5px] cursor-pointer text-xs font-normal transition-colors duration-200 ${
            currentStatusFilter === 'all'
              ? 'bg-primary text-white'
              : 'bg-[#ccc] text-font-color'
          }`}
        >
          All ({enquiries.length})
        </button>
        {Object.keys(statusCounts).sort().map(status => (
          <button
            key={status}
            onClick={() => setCurrentStatusFilter(status)}
            className={`px-[10px] py-[5px] border-none rounded-[5px] cursor-pointer text-xs font-normal transition-colors duration-200 ${
              currentStatusFilter === status
                ? 'opacity-100'
                : 'opacity-80 hover:opacity-100'
            }`}
            style={{
              backgroundColor:
                status === 'Pending Nomination' ? '#8e44ad' :
                status === 'Partially Nominated' ? '#f39c12' :
                status === 'Fully Nominated' ? '#3498db' :
                status === 'Scheduled' ? '#27ae60' : '#778899',
              color: 'white'
            }}
          >
            {status} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <i className="fas fa-spinner fa-spin text-4xl text-primary"></i>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
            <thead>
              <tr>
                <th className="p-[15px] text-left border-b border-border-color">#</th>
                <th className="p-[15px] text-left border-b border-border-color">Enquiry ID</th>
                <th className="p-[15px] text-left border-b border-border-color">Batch No.</th>
                {currentView === 'table' && (
                  <>
                    <th className="p-[15px] text-left border-b border-border-color">Client</th>
                    <th className="p-[15px] text-left border-b border-border-color">Course</th>
                  </>
                )}
                {currentView === 'client' && (
                  <th className="p-[15px] text-left border-b border-border-color">Course</th>
                )}
                {currentView === 'course' && (
                  <th className="p-[15px] text-left border-b border-border-color">Client</th>
                )}
                <th className="p-[15px] text-left border-b border-border-color text-center">Pending</th>
                <th className="p-[15px] text-left border-b border-border-color">Training Date</th>
                <th className="p-[15px] text-left border-b border-border-color text-center">Created Date</th>
                <th className="p-[15px] text-left border-b border-border-color text-center">Status</th>
                <th className="p-[15px] text-left border-b border-border-color">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentView === 'table' && renderTableView()}
              {currentView === 'client' && renderByClientView()}
              {currentView === 'course' && renderByCourseView()}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PendingNominationsPage;
