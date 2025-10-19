import { useState, useEffect } from 'react';
import axios from 'axios';

const AllRecordsPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

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
          <h1 className="m-0 text-base font-bold">All Records</h1>
          <div className="text-sm font-normal">
            <span className="text-[#888] no-underline">Home</span>
            <span className="mx-2 text-[#aaa]">/</span>
            <span className="text-font-color font-bold">All Records</span>
          </div>
        </div>
        <div className="flex items-center gap-[15px]">
          <div className="flex gap-[10px] flex-wrap">
            {statusOptions.map(status => (
              <button
                key={status}
                className={`py-[5px] px-[10px] border border-[rgba(0,0,0,0.1)] rounded-[5px] cursor-pointer text-xs font-normal transition-all duration-200 text-white ${
                  status === 'all' ? 'bg-[#6c757d]' :
                  status === 'Draft' ? 'bg-slate-gray' :
                  status === 'Quotation Sent' ? 'bg-warning' :
                  status === 'Agreement Pending' ? 'bg-turquoise' :
                  status === 'Agreement Sent' ? 'bg-carrot-orange' :
                  status === 'Pending Nomination' ? 'bg-wisteria' :
                  status === 'Nominated' ? 'bg-peter-river' :
                  status === 'Scheduled' ? 'bg-success' :
                  status === 'Completed' ? 'bg-wet-asphalt' :
                  status === 'Cancelled' ? 'bg-[#95a5a6]' : ''
                } ${filterStatus === status ? 'border-[3px] border-black' : ''}`}
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
            <th className="p-[15px] text-left border-b border-border-color align-middle cursor-pointer relative pr-[25px] after:content-['\f0dc'] after:font-['Font_Awesome_6_Free'] after:font-black after:absolute after:right-2 after:top-1/2 after:-translate-y-1/2 after:text-[#ccc] after:transition-colors hover:after:text-[#888]">Enquiry ID</th>
            <th className="p-[15px] text-left border-b border-border-color align-middle cursor-pointer relative pr-[25px] after:content-['\f0dc'] after:font-['Font_Awesome_6_Free'] after:font-black after:absolute after:right-2 after:top-1/2 after:-translate-y-1/2 after:text-[#ccc] after:transition-colors hover:after:text-[#888]">Date</th>
            <th className="p-[15px] text-left border-b border-border-color align-middle cursor-pointer relative pr-[25px] after:content-['\f0dc'] after:font-['Font_Awesome_6_Free'] after:font-black after:absolute after:right-2 after:top-1/2 after:-translate-y-1/2 after:text-[#ccc] after:transition-colors hover:after:text-[#888]">Client</th>
            <th className="p-[15px] text-left border-b border-border-color align-middle cursor-pointer relative pr-[25px] after:content-['\f0dc'] after:font-['Font_Awesome_6_Free'] after:font-black after:absolute after:right-2 after:top-1/2 after:-translate-y-1/2 after:text-[#ccc] after:transition-colors hover:after:text-[#888]">Course</th>
            <th className="p-[15px] text-left border-b border-border-color align-middle">Students</th>
            <th className="p-[15px] text-left border-b border-border-color align-middle cursor-pointer relative pr-[25px] after:content-['\f0dc'] after:font-['Font_Awesome_6_Free'] after:font-black after:absolute after:right-2 after:top-1/2 after:-translate-y-1/2 after:text-[#ccc] after:transition-colors hover:after:text-[#888]">Status</th>
            <th className="p-[15px] text-left border-b border-border-color align-middle">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="7" className="text-center p-[15px]">Loading...</td></tr>
          ) : enquiries.length === 0 ? (
            <tr><td colSpan="7" className="text-center p-[15px]">No records found</td></tr>
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
                    enq.status === 'Agreement Pending' ? 'bg-turquoise' :
                    enq.status === 'Agreement Sent' ? 'bg-carrot-orange' :
                    enq.status === 'Pending Nomination' ? 'bg-wisteria' :
                    enq.status === 'Nominated' ? 'bg-peter-river' :
                    enq.status === 'Scheduled' ? 'bg-success' :
                    enq.status === 'Completed' ? 'bg-wet-asphalt' :
                    enq.status === 'Cancelled' ? 'bg-[#95a5a6]' : ''
                  }`}>
                    {enq.status}
                  </span>
                </td>
                <td className="py-2 px-[15px] text-left border-b border-border-color align-middle">
                  <div className="flex gap-[10px] justify-start flex-nowrap items-center">
                    <i className="fas fa-eye cursor-pointer text-[1.1rem] text-[#555] transition-all duration-200 hover:opacity-70 hover:scale-110" title="View"></i>
                    <i className="fas fa-edit cursor-pointer text-[1.1rem] text-[#555] transition-all duration-200 hover:opacity-70 hover:scale-110" title="Edit"></i>
                    <i className="fas fa-sticky-note cursor-pointer text-[1.1rem] text-[#555] transition-all duration-200 hover:opacity-70 hover:scale-110" title="Notes"></i>
                    <i className="fas fa-history cursor-pointer text-[1.1rem] text-[#555] transition-all duration-200 hover:opacity-70 hover:scale-110" title="Activity Log"></i>
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

export default AllRecordsPage;
