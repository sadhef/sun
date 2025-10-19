import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import clientService from '../../services/clientService';
import courseService from '../../services/courseService';
import batchService from '../../services/batchService';
import NewClientForm from './components/NewClientForm';
import WalkInClientForm from './components/WalkInClientForm';
import BatchSelectionModal from './components/BatchSelectionModal';
import BatchNominationModal from './components/BatchNominationModal';

function NominationPage() {
  const [step, setStep] = useState('client-selection');
  const [clients, setClients] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [availableBatches, setAvailableBatches] = useState([]);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [showWalkInForm, setShowWalkInForm] = useState(false);
  const [showBatchSelectionModal, setShowBatchSelectionModal] = useState(false);
  const [showBatchNominationModal, setShowBatchNominationModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchCourses();
  }, []);

  const fetchClients = async () => {
    try {
      const { data } = await clientService.getAllClients();
      setClients(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      toast.error('Failed to fetch clients');
    }
  };

  const fetchCourses = async () => {
    try {
      const { data } = await courseService.getAllCourses({ isActive: 'true' });
      setCourses(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      toast.error('Failed to fetch courses');
    }
  };

  const handleClientSelect = (clientName) => {
    if (!clientName) return;
    setSelectedClient(clientName);
    setStep('course-selection');
    setShowNewClientForm(false);
    setShowWalkInForm(false);
  };

  const handleCourseSelect = async (courseName) => {
    if (!courseName) return;
    setSelectedCourse(courseName);
    setLoading(true);

    try {
      const { data } = await batchService.getAvailableBatches(courseName);
      setAvailableBatches(data);

      if (data.length > 0) {
        setShowBatchSelectionModal(true);
      } else {
        createNewBatch();
      }
    } catch (error) {
      toast.error('Failed to fetch available batches');
      createNewBatch();
    } finally {
      setLoading(false);
    }
  };

  const createNewBatch = () => {
    const course = courses.find((c) => c.name === selectedCourse);
    const tempBatch = {
      batchId: `TEMP-${Date.now()}`,
      courseName: selectedCourse,
      classCapacity: course?.classCapacity || 15,
      nominated: 0,
      pending: course?.classCapacity || 15,
      nominees: [],
      isNew: true
    };
    setSelectedBatch(tempBatch);
    setShowBatchNominationModal(true);
  };

  const handleJoinBatch = (batch) => {
    setSelectedBatch({ ...batch, isJoining: true });
    setShowBatchSelectionModal(false);
    setShowBatchNominationModal(true);
  };

  const handleCreateNewBatch = () => {
    setShowBatchSelectionModal(false);
    createNewBatch();
  };

  const handleNominationSuccess = () => {
    toast.success('Nomination saved successfully');
    resetForm();
  };

  const resetForm = () => {
    setStep('client-selection');
    setSelectedClient('');
    setSelectedCourse('');
    setAvailableBatches([]);
    setSelectedBatch(null);
    setShowNewClientForm(false);
    setShowWalkInForm(false);
    setShowBatchSelectionModal(false);
    setShowBatchNominationModal(false);
  };

  const handleBackToClientSelection = () => {
    setStep('client-selection');
    setSelectedClient('');
    setSelectedCourse('');
    setShowNewClientForm(false);
    setShowWalkInForm(false);
  };

  const getBreadcrumbs = () => {
    if (showNewClientForm) {
      return [
        { label: 'Nomination' },
        { label: 'Add Nomination', onClick: handleBackToClientSelection },
        { label: 'New Client' }
      ];
    } else if (showWalkInForm) {
      return [
        { label: 'Nomination' },
        { label: 'Add Nomination', onClick: handleBackToClientSelection },
        { label: 'Walk-in Client' }
      ];
    } else if (step === 'course-selection') {
      return [
        { label: 'Nomination' },
        { label: 'Add Nomination', onClick: handleBackToClientSelection },
        { label: 'Existing Client' }
      ];
    } else {
      return [{ label: 'Nomination' }, { label: 'Add Nomination' }];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div>
      {/* Page Header with Breadcrumbs */}
      <div className="flex justify-between items-center mb-5">
        <div className="text-sm font-normal">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {index > 0 && <span className="mx-2 text-[#aaa]">/</span>}
              {crumb.onClick ? (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    crumb.onClick();
                  }}
                  className="text-[#888] no-underline hover:underline"
                >
                  {crumb.label}
                </a>
              ) : index === breadcrumbs.length - 1 ? (
                <span className="text-font-color font-bold">{crumb.label}</span>
              ) : (
                <span className="text-[#888]">{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Back Link (appears when not on initial client selection) */}
      {(step === 'course-selection' || showNewClientForm || showWalkInForm) && (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleBackToClientSelection();
          }}
          className="block mb-[15px] text-sm text-primary no-underline hover:underline"
        >
          &larr; Back
        </a>
      )}

      {/* Client Selection Controls */}
      {step === 'client-selection' && !showNewClientForm && !showWalkInForm && (
        <div className="flex flex-wrap gap-[15px] items-end mb-5 p-5 bg-white rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <div className="flex-1 min-w-[300px] flex flex-col mb-0">
            <label htmlFor="nomClientSelect" className="mb-[5px] font-medium">
              Clients:
            </label>
            <select
              id="nomClientSelect"
              value={selectedClient}
              onChange={(e) => handleClientSelect(e.target.value)}
              className="p-2 rounded-none border border-border-color font-inter text-sm"
            >
              <option value="">Select Client...</option>
              {clients.map((client) => (
                <option key={client._id} value={client.name}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col mb-0">
            <button
              onClick={() => setShowNewClientForm(true)}
              className="px-5 py-[10px] border-none rounded-[5px] cursor-pointer text-sm font-bold transition-colors duration-200 bg-primary text-white hover:bg-opacity-90"
            >
              + Add New Client
            </button>
          </div>

          <div className="flex flex-col mb-0">
            <button
              onClick={() => setShowWalkInForm(true)}
              className="px-5 py-[10px] border-none rounded-[5px] cursor-pointer text-sm font-bold transition-colors duration-200 bg-primary text-white hover:bg-opacity-90"
            >
              Walk-in Client
            </button>
          </div>
        </div>
      )}

      {/* New Client Form */}
      {showNewClientForm && (
        <NewClientForm
          onSuccess={(clientName) => {
            fetchClients();
            handleClientSelect(clientName);
          }}
          onCancel={handleBackToClientSelection}
        />
      )}

      {/* Walk-in Client Form */}
      {showWalkInForm && (
        <WalkInClientForm
          onSuccess={(clientName) => {
            fetchClients();
            handleClientSelect(clientName);
          }}
          onCancel={handleBackToClientSelection}
        />
      )}

      {/* Course Selection Row */}
      {step === 'course-selection' && selectedClient && (
        <div className="flex flex-wrap gap-[15px] items-end mb-5 p-5 bg-white rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <div className="flex-1 min-w-[300px] flex flex-col mb-0">
            <label htmlFor="nomCourseSelect" className="mb-[5px] font-medium">
              Course:
            </label>
            <select
              id="nomCourseSelect"
              value={selectedCourse}
              onChange={(e) => handleCourseSelect(e.target.value)}
              disabled={loading}
              className="p-2 rounded-none border border-border-color font-inter text-sm disabled:bg-[#f0f0f0] disabled:cursor-not-allowed"
            >
              <option value="">Select Course...</option>
              {courses.map((course) => (
                <option key={course._id} value={course.name}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="pl-[15px] font-bold self-center">
              <i className="fas fa-spinner fa-spin text-primary"></i>
              <span className="ml-2">Checking availability...</span>
            </div>
          )}
        </div>
      )}

      {/* Batch Selection Modal */}
      {showBatchSelectionModal && (
        <BatchSelectionModal
          batches={availableBatches}
          courseName={selectedCourse}
          onJoinBatch={handleJoinBatch}
          onCreateNew={handleCreateNewBatch}
          onClose={() => setShowBatchSelectionModal(false)}
        />
      )}

      {/* Batch Nomination Modal */}
      {showBatchNominationModal && selectedBatch && (
        <BatchNominationModal
          batch={selectedBatch}
          clientName={selectedClient}
          courseName={selectedCourse}
          onSuccess={handleNominationSuccess}
          onClose={() => {
            setShowBatchNominationModal(false);
            setSelectedBatch(null);
          }}
        />
      )}
    </div>
  );
}

export default NominationPage;
