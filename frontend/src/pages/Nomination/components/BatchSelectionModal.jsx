import { format } from 'date-fns';

function BatchSelectionModal({ batches, courseName, onJoinBatch, onCreateNew, onClose }) {
  return (
    <div className="modal show">
      <div className="modal-content modal-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>

        <div className="modal-title">Available Batches Found</div>

        <div className="modal-body">
          <p className="text-gray-600 mb-4">
            We found existing classes for <span className="font-semibold">{courseName}</span> with
            available seats. You can join one or create a new class.
          </p>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {batches.map((batch) => {
              const clientsInBatch = [...new Set(batch.nominees.map((n) => n.name))].join(', ') || 'None';

              return (
                <div
                  key={batch._id}
                  className="flex justify-between items-start p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-semibold">Batch ID:</span> {batch.batchId}
                      </div>
                      <div>
                        <span className="font-semibold">Course:</span> {batch.courseName}
                      </div>
                      <div className="col-span-2">
                        <span className="font-semibold">Clients in Batch:</span> {clientsInBatch}
                      </div>
                      <div>
                        <span className="font-semibold">Date:</span>{' '}
                        {batch.date ? format(new Date(batch.date), 'dd/MM/yyyy') : 'Not Set'}
                      </div>
                      <div>
                        <span className="font-semibold">Session:</span> {batch.session || 'N/A'}
                      </div>
                      <div className="col-span-2">
                        <span className="font-semibold text-green-600">Available Seats:</span>{' '}
                        <span className="font-bold text-green-600">{batch.pending}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onJoinBatch(batch)}
                    className="btn btn-primary btn-sm ml-4"
                  >
                    <i className="fas fa-user-plus"></i> Join this Batch
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer flex justify-end">
          <button onClick={onCreateNew} className="btn btn-secondary">
            <i className="fas fa-plus"></i> Create a New Separate Class
          </button>
        </div>
      </div>
    </div>
  );
}

export default BatchSelectionModal;
