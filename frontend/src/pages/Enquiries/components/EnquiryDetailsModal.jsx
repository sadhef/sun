import React, { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import enquiryService from '../../../services/enquiryService';

function EnquiryDetailsModal({ enquiry, isOpen, onClose, onRefresh }) {
  const [activeTab, setActiveTab] = useState('details');
  const [noteContent, setNoteContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddNote = async () => {
    if (!noteContent.trim()) {
      toast.error('Please enter a note');
      return;
    }

    try {
      setLoading(true);
      await enquiryService.addNoteToEnquiry(enquiry._id, noteContent);
      toast.success('Note added successfully');
      setNoteContent('');
      onRefresh();
    } catch (error) {
      toast.error('Failed to add note');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show">
      <div className="modal-content modal-xl">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
          <div className="modal-title">Enquiry Details - {enquiry.enquiryId}</div>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'details'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <i className="fas fa-info-circle mr-2"></i>
              Details
            </button>
            <button
              onClick={() => setActiveTab('nominees')}
              className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'nominees'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <i className="fas fa-users mr-2"></i>
              Nominees ({enquiry.nominees?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'activity'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <i className="fas fa-history mr-2"></i>
              Activity Log
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'notes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <i className="fas fa-sticky-note mr-2"></i>
              Notes ({enquiry.notes?.length || 0})
            </button>
          </div>
        </div>

        <div className="modal-body">
          {activeTab === 'details' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="form-group">
                <label>Enquiry ID</label>
                <input type="text" value={enquiry.enquiryId} disabled />
              </div>
              <div className="form-group">
                <label>Status</label>
                <input type="text" value={enquiry.status} disabled />
              </div>
              <div className="form-group">
                <label>Client</label>
                <input type="text" value={enquiry.client} disabled />
              </div>
              <div className="form-group">
                <label>Course</label>
                <input type="text" value={enquiry.course} disabled />
              </div>
              <div className="form-group">
                <label>Contact Name</label>
                <input type="text" value={enquiry.contactName} disabled />
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input type="text" value={enquiry.contactEmail} disabled />
              </div>
              <div className="form-group">
                <label>Contact Phone</label>
                <input type="text" value={enquiry.contactPhone} disabled />
              </div>
              <div className="form-group">
                <label>Training Date</label>
                <input
                  type="text"
                  value={format(new Date(enquiry.startDate), 'dd/MM/yyyy')}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Cost per Person</label>
                <input type="text" value={`KD ${enquiry.cost.toFixed(2)}`} disabled />
              </div>
              <div className="form-group">
                <label>Requested</label>
                <input type="text" value={enquiry.requested} disabled />
              </div>
              <div className="form-group">
                <label>Nominated</label>
                <input type="text" value={enquiry.nominated} disabled />
              </div>
              <div className="form-group">
                <label>Batch Number</label>
                <input type="text" value={enquiry.batchNumber || 'Not assigned'} disabled />
              </div>
            </div>
          )}

          {activeTab === 'nominees' && (
            <div>
              {enquiry.nominees && enquiry.nominees.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Civil ID</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Language</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiry.nominees.map((nominee, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{nominee.civilId}</td>
                        <td>{nominee.name}</td>
                        <td>{nominee.phone || 'N/A'}</td>
                        <td>{nominee.email || 'N/A'}</td>
                        <td>{nominee.language || 'English'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-users text-4xl mb-2"></i>
                  <p>No nominees added yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-3">
              {enquiry.activityLog && enquiry.activityLog.length > 0 ? (
                enquiry.activityLog.map((log, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{log.action}</p>
                        <p className="text-sm text-gray-600">{log.details}</p>
                        {log.userName && (
                          <p className="text-xs text-gray-500 mt-1">
                            By: {log.userName}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-history text-4xl mb-2"></i>
                  <p>No activity logged yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="form-group">
                <label>Add New Note</label>
                <textarea
                  rows="3"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Enter your note here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddNote}
                  disabled={loading}
                  className="btn btn-primary mt-2"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Adding...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus"></i> Add Note
                    </>
                  )}
                </button>
              </div>

              <hr />

              <div className="space-y-3">
                {enquiry.notes && enquiry.notes.length > 0 ? (
                  enquiry.notes.map((note, index) => (
                    <div key={index} className="bg-yellow-50 border border-yellow-200 rounded p-4">
                      <p className="text-gray-800">{note.content}</p>
                      <div className="flex justify-between items-center mt-2">
                        {note.userName && (
                          <span className="text-xs text-gray-600">By: {note.userName}</span>
                        )}
                        <span className="text-xs text-gray-500">
                          {format(new Date(note.timestamp), 'dd/MM/yyyy HH:mm')}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <i className="fas fa-sticky-note text-4xl mb-2"></i>
                    <p>No notes added yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnquiryDetailsModal;
