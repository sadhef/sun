import React from 'react';

function EnquiryFilters({ searchTerm, setSearchTerm, selectedStatus, setSelectedStatus }) {
  const statuses = [
    'Draft',
    'Quotation Sent',
    'Agreement Pending',
    'Agreement Sent',
    'Pending Nomination',
    'Nominated',
    'Scheduled',
    'Completed'
  ];

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[250px]">
          <input
            type="text"
            placeholder="Search by ID, Client, Course, Contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="min-w-[200px]">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default EnquiryFilters;
