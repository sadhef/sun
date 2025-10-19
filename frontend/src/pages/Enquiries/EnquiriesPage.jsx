import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EnquiriesPage = ({ filter }) => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState(filter === 'pending' ? 'Pending' : 'all');

  useEffect(() => {
    fetchEnquiries();
  }, [filterStatus]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      const { data } = await axios.get('/api/v1/enquiries', { params });
      setEnquiries(data.data || []);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const statusOptions = ['all', 'Draft', 'Quotation Sent', 'Agreement Pending', 'Agreement Sent', 'Pending Nomination', 'Nominated', 'Scheduled', 'Completed', 'Cancelled'];

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="m-0 text-base font-bold">Pending Enquiries</h1>
          <div className="text-sm font-normal">
            <span className="text-[#888] no-underline">Home</span>
            <span className="mx-2 text-[#aaa]">/</span>
            <span className="text-font-color font-bold">Enquiries</span>
          </div>
        </div>
        <div className="flex items-center gap-[15px]">
          <button className="py-[10px] px-5 border-0 rounded-[5px] cursor-pointer text-sm font-bold transition-colors duration-200 ease inline-flex items-center justify-center gap-2 bg-primary text-white hover:opacity-90" onClick={() => navigate('/enquiries/new')}>
            <i className="fas fa-plus"></i> New Enquiry
          </button>
          <div className="flex gap-[10px] flex-wrap">
            {statusOptions.map(status => (
              <button
                key={status}
                className={`py-[5px] px-[10px] border-0 rounded-[5px] cursor-pointer text-xs font-normal transition-colors duration-200 ease inline-flex items-center justify-center gap-2 ${
                  status === 'all' ? 'bg-gray-300 text-font-color' :
                  status === 'Draft' ? 'bg-slate-gray text-white' :
                  status === 'Quotation Sent' ? 'bg-warning text-white' :
                  status === 'Agreement Pending' ? 'bg-turquoise text-white' :
                  status === 'Agreement Sent' ? 'bg-carrot-orange text-white' :
                  status === 'Pending Nomination' ? 'bg-wisteria text-white' :
                  status === 'Nominated' ? 'bg-peter-river text-white' :
                  status === 'Scheduled' ? 'bg-success text-white' :
                  status === 'Completed' ? 'bg-wet-asphalt text-white' :
                  status === 'Cancelled' ? 'bg-gray-400 text-white' : ''
                } ${filterStatus === status ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                onClick={() => setFilterStatus(status)}
              >
                {status === 'all' ? 'All' : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <table className="w-full border-collapse bg-white shadow-custom">
        <thead className="bg-[#f9f9f9]">
          <tr>
            <th className="p-[15px] text-left border-b border-border-color align-middle cursor-pointer">Enquiry ID</th>
            <th className="p-[15px] text-left border-b border-border-color align-middle cursor-pointer">Date</th>
            <th className="p-[15px] text-left border-b border-border-color align-middle cursor-pointer">Client</th>
            <th className="p-[15px] text-left border-b border-border-color align-middle cursor-pointer">Course</th>
            <th className="p-[15px] text-left border-b border-border-color align-middle">Students</th>
            <th className="p-[15px] text-left border-b border-border-color align-middle cursor-pointer">Status</th>
            <th className="p-[15px] text-left border-b border-border-color align-middle">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="7" className="text-center p-[15px]">Loading...</td></tr>
          ) : enquiries.length === 0 ? (
            <tr><td colSpan="7" className="text-center p-[15px]">No enquiries found</td></tr>
          ) : (
            enquiries.map(enq => (
              <tr key={enq._id} data-id={enq._id} className="hover:bg-[#f9f9f9]">
                <td className="py-2 px-[15px] text-left border-b border-border-color align-middle">{enq.enquiryId}</td>
                <td className="py-2 px-[15px] text-left border-b border-border-color align-middle">{formatDate(enq.date)}</td>
                <td className="py-2 px-[15px] text-left border-b border-border-color align-middle">
                  <div>{enq.client}</div>
                  <div className="text-xs text-[#666] mt-1 leading-[1.4]">
                    {enq.contactPerson} | {enq.contactEmail}
                  </div>
                </td>
                <td className="py-2 px-[15px] text-left border-b border-border-color align-middle">{enq.course}</td>
                <td className="py-2 px-[15px] text-center border-b border-border-color align-middle">{enq.numberOfStudents || 0}</td>
                <td className="py-2 px-[15px] text-left border-b border-border-color align-middle">
                  <span className={`py-1 px-[10px] rounded-xl text-[11px] font-medium text-white text-center whitespace-nowrap inline-block ${
                    enq.status === 'Draft' ? 'bg-slate-gray' :
                    enq.status === 'Quotation Sent' ? 'bg-warning' :
                    enq.status === 'Sent' ? 'bg-warning' :
                    enq.status === 'Agreement Pending' ? 'bg-turquoise' :
                    enq.status === 'Agreement Sent' ? 'bg-carrot-orange' :
                    enq.status === 'Pending' ? 'bg-danger' :
                    enq.status === 'Pending Nomination' ? 'bg-wisteria' :
                    enq.status === 'Nominated' ? 'bg-peter-river' :
                    enq.status === 'Scheduled' ? 'bg-success' :
                    enq.status === 'Completed' ? 'bg-wet-asphalt' :
                    enq.status === 'Active' ? 'bg-success' :
                    enq.status === 'Inactive' ? 'bg-slate-gray' :
                    enq.status === 'Rejected' ? 'bg-pomegranate' :
                    enq.status === 'Paid' ? 'bg-success' :
                    enq.status === 'Certificate Issued' ? 'bg-belize-hole' :
                    enq.status === 'Cancelled' ? 'bg-gray-400' : ''
                  }`}>
                    {enq.status}
                  </span>
                </td>
                <td className="py-2 px-[15px] text-left border-b border-border-color align-middle">
                  <div className="flex gap-[10px] justify-start flex-nowrap items-center">
                    <i className="fas fa-eye cursor-pointer text-[1.1rem] text-[#555] transition-all duration-200 hover:opacity-70 hover:scale-110" data-action="view" title="View"></i>
                    <i className="fas fa-edit cursor-pointer text-[1.1rem] text-[#555] transition-all duration-200 hover:opacity-70 hover:scale-110" data-action="edit" title="Edit"></i>
                    <i className="fas fa-sticky-note cursor-pointer text-[1.1rem] text-[#555] transition-all duration-200 hover:opacity-70 hover:scale-110" data-action="notes" title="Notes"></i>
                    <i className="fas fa-history cursor-pointer text-[1.1rem] text-[#555] transition-all duration-200 hover:opacity-70 hover:scale-110" data-action="view-log" title="Activity Log"></i>
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

export default EnquiriesPage;
