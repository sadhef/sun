import React, { useState } from 'react';
import { format } from 'date-fns';
import EnquiryDetailsModal from './EnquiryDetailsModal';

function EnquiryTable({ enquiries, onStatusUpdate, onDelete, onRefresh }) {
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const getStatusBadge = (status) => {
    const statusClass = `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
    return (
      <span className={`status-badge ${statusClass}`}>
        {status}
      </span>
    );
  };

  const handleAction = (action, enquiry) => {
    switch (action) {
      case 'view':
        setSelectedEnquiry(enquiry);
        setIsDetailsModalOpen(true);
        break;
      case 'quotation':
        onStatusUpdate(enquiry._id, 'Quotation Sent');
        break;
      case 'agreement-pending':
        onStatusUpdate(enquiry._id, 'Agreement Pending');
        break;
      case 'agreement-sent':
        onStatusUpdate(enquiry._id, 'Agreement Sent');
        break;
      case 'pending-nomination':
        onStatusUpdate(enquiry._id, 'Pending Nomination');
        break;
      case 'delete':
        onDelete(enquiry._id);
        break;
      default:
        break;
    }
  };

  const getActionButtons = (enquiry) => {
    const buttons = [];

    if (enquiry.status === 'Draft') {
      buttons.push(
        <button
          key="quotation"
          onClick={() => handleAction('quotation', enquiry)}
          className="btn btn-primary btn-sm"
        >
          <i className="fas fa-file-invoice"></i> Generate Quotation
        </button>
      );
    }

    if (enquiry.status === 'Quotation Sent') {
      buttons.push(
        <button
          key="agreement"
          onClick={() => handleAction('agreement-pending', enquiry)}
          className="btn btn-primary btn-sm"
        >
          <i className="fas fa-handshake"></i> Request Agreement
        </button>
      );
    }

    if (enquiry.status === 'Agreement Pending') {
      buttons.push(
        <button
          key="send-agreement"
          onClick={() => handleAction('agreement-sent', enquiry)}
          className="btn btn-primary btn-sm"
        >
          <i className="fas fa-paper-plane"></i> Send Agreement
        </button>
      );
    }

    if (enquiry.status === 'Agreement Sent') {
      buttons.push(
        <button
          key="nomination"
          onClick={() => handleAction('pending-nomination', enquiry)}
          className="btn btn-primary btn-sm"
        >
          <i className="fas fa-user-check"></i> Mark Pending Nomination
        </button>
      );
    }

    buttons.push(
      <button
        key="view"
        onClick={() => handleAction('view', enquiry)}
        className="btn btn-secondary btn-sm"
      >
        <i className="fas fa-eye"></i> View
      </button>
    );

    if (enquiry.status === 'Draft') {
      buttons.push(
        <button
          key="delete"
          onClick={() => handleAction('delete', enquiry)}
          className="btn btn-danger btn-sm"
        >
          <i className="fas fa-trash"></i>
        </button>
      );
    }

    return buttons;
  };

  if (enquiries.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <i className="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
        <p className="text-gray-500 text-lg">No enquiries found</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Enquiry ID</th>
              <th>Batch No.</th>
              <th>Client</th>
              <th>Course</th>
              <th className="text-center">Training Date</th>
              <th className="text-center">Nominated / Requested</th>
              <th className="text-center">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry, index) => (
              <tr key={enquiry._id}>
                <td>{index + 1}</td>
                <td className="font-medium text-blue-600">{enquiry.enquiryId}</td>
                <td>{enquiry.batchNumber || '-'}</td>
                <td>{enquiry.client}</td>
                <td>{enquiry.course}</td>
                <td className="text-center">
                  {format(new Date(enquiry.startDate), 'dd/MM/yyyy')}
                </td>
                <td className="text-center">
                  <span className="font-medium">
                    {enquiry.nominated} / {enquiry.requested}
                  </span>
                </td>
                <td className="text-center">{getStatusBadge(enquiry.status)}</td>
                <td>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {getActionButtons(enquiry)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDetailsModalOpen && selectedEnquiry && (
        <EnquiryDetailsModal
          enquiry={selectedEnquiry}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedEnquiry(null);
          }}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
}

export default EnquiryTable;
