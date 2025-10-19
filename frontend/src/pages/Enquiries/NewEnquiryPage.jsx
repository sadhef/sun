import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import clientService from '../../services/clientService';
import courseService from '../../services/courseService';
import enquiryService from '../../services/enquiryService';
import studentService from '../../services/studentService';

function NewEnquiryPage() {
  const navigate = useNavigate();
  const [clientType, setClientType] = useState('company');
  const [selectedClient, setSelectedClient] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [civilId, setCivilId] = useState('');
  const [language, setLanguage] = useState('English');
  const [pasteData, setPasteData] = useState('');
  const [clients, setClients] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseRows, setCourseRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const languages = ['English', 'Arabic', 'Tamil', 'Mandarin', 'Spanish', 'Hindi', 'Japanese', 'French', 'Italian', 'Russian', 'Korean', 'German', 'Portuguese', 'Cantonese', 'Urdu', 'Malayalam'];

  useEffect(() => {
    fetchClients();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      const initialRows = courses.map(course => ({
        course: course.name,
        selected: false,
        quantity: 0,
        trainingDate: '',
        costPerPerson: course.cost,
        totalCost: 0
      }));
      setCourseRows(initialRows);
    }
  }, [courses]);

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

  const handleClientTypeChange = (type) => {
    setClientType(type);
    setSelectedClient('');
    setContactName('');
    setContactPhone('');
    setContactEmail('');
    setCivilId('');
    setLanguage('English');
  };

  const handleClientChange = async (clientName) => {
    setSelectedClient(clientName);

    if (clientType === 'company') {
      const client = clients.find(c => c.name === clientName);
      if (client) {
        setContactName(client.contactPerson || '');
        setContactPhone(client.contactPhone || '');
        setContactEmail(client.contactEmail || '');
      }
      // Try to get contact from previous enquiries
      try {
        const { data } = await enquiryService.getEnquiries({ client: clientName });
        if (data && data.length > 0) {
          const lastEnquiry = data[0];
          if (!contactName) setContactName(lastEnquiry.contactName || '');
          if (!contactPhone) setContactPhone(lastEnquiry.contactPhone || '');
          if (!contactEmail) setContactEmail(lastEnquiry.contactEmail || '');
        }
      } catch (error) {
        // Ignore error
      }
    } else {
      // Individual - try to fetch student data by name
      setContactName(clientName);
    }
  };

  const handleCivilIdBlur = async () => {
    if (!civilId || clientType !== 'individual') return;

    try {
      const { data } = await studentService.getStudentByCivilId(civilId);
      if (data) {
        setSelectedClient(data.name);
        setContactName(data.name);
        setContactPhone(data.phone || '');
        setContactEmail(data.email || '');
        setLanguage(data.language || 'English');
      }
    } catch (error) {
      // Student not found, allow manual entry
    }
  };

  const handleCheckboxChange = (index) => {
    const newRows = [...courseRows];
    newRows[index].selected = !newRows[index].selected;
    if (newRows[index].selected && newRows[index].quantity === 0) {
      newRows[index].quantity = 1;
      newRows[index].totalCost = newRows[index].quantity * newRows[index].costPerPerson;
    } else if (!newRows[index].selected) {
      newRows[index].quantity = 0;
      newRows[index].trainingDate = '';
      newRows[index].totalCost = 0;
    }
    setCourseRows(newRows);
  };

  const handleQuantityChange = (index, value) => {
    const newRows = [...courseRows];
    newRows[index].quantity = parseInt(value) || 0;
    newRows[index].totalCost = newRows[index].quantity * newRows[index].costPerPerson;
    setCourseRows(newRows);
  };

  const handleDateChange = (index, value) => {
    const newRows = [...courseRows];
    newRows[index].trainingDate = value;
    setCourseRows(newRows);
  };

  const handleCostChange = (index, value) => {
    const newRows = [...courseRows];
    newRows[index].costPerPerson = parseFloat(value) || 0;
    newRows[index].totalCost = newRows[index].quantity * newRows[index].costPerPerson;
    setCourseRows(newRows);
  };

  const handlePasteProcess = () => {
    if (!pasteData.trim()) {
      toast.error('Please paste data first');
      return;
    }

    const lines = pasteData.trim().split('\n').filter(line => line.trim());
    const newRows = [...courseRows];

    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 2) return;

      const qty = parseInt(parts[parts.length - 1]);
      if (isNaN(qty)) return;

      const courseName = parts.slice(0, -1).join(' ');
      const rowIndex = newRows.findIndex(row =>
        row.course.toLowerCase().includes(courseName.toLowerCase()) ||
        courseName.toLowerCase().includes(row.course.toLowerCase())
      );

      if (rowIndex !== -1) {
        newRows[rowIndex].selected = true;
        newRows[rowIndex].quantity = qty;
        newRows[rowIndex].totalCost = qty * newRows[rowIndex].costPerPerson;
      }
    });

    setCourseRows(newRows);
    setPasteData('');
    toast.success('Data processed successfully');
  };

  const handleSaveDraft = async () => {
    await handleSubmit('Draft');
  };

  const handleSaveAndSendQuotation = async () => {
    await handleSubmit('Quotation Sent');
  };

  const handleNominateIndividual = async () => {
    // For individual, go straight to nomination
    await handleSubmit('Pending Nomination');
  };

  const handleSubmit = async (statusType) => {
    // Validation
    if (!selectedClient) {
      toast.error(`Please ${clientType === 'company' ? 'select' : 'enter'} ${clientType === 'company' ? 'a client' : 'student name'}`);
      return;
    }

    if (clientType === 'individual' && !civilId) {
      toast.error('Please enter Civil ID');
      return;
    }

    if (!contactName || !contactPhone || !contactEmail) {
      toast.error('Please fill in all contact details');
      return;
    }

    const selectedRows = courseRows.filter(row => row.selected);
    if (selectedRows.length === 0) {
      toast.error('Please select at least one course');
      return;
    }

    for (const row of selectedRows) {
      if (row.quantity <= 0 || row.costPerPerson <= 0 || !row.trainingDate) {
        toast.error(`Invalid data for '${row.course}'. Please check quantity, cost, and training date.`);
        return;
      }
    }

    try {
      setLoading(true);

      // For individuals, first create/update client and student
      if (clientType === 'individual') {
        // Create client if doesn't exist
        const clientExists = clients.find(c => c.name === selectedClient);
        if (!clientExists) {
          await clientService.createClient({
            name: selectedClient,
            type: 'individual',
            contactPerson: contactName,
            contactPhone,
            contactEmail
          });
        }

        // Create/update student
        try {
          await studentService.getStudentByCivilId(civilId);
          // Student exists, update if needed
          await studentService.updateStudent(civilId, {
            name: selectedClient,
            phone: contactPhone,
            email: contactEmail,
            language
          });
        } catch {
          // Student doesn't exist, create
          await studentService.createStudent({
            civilId,
            name: selectedClient,
            phone: contactPhone,
            email: contactEmail,
            language
          });
        }
      }

      const enquiries = selectedRows.map(row => ({
        client: selectedClient,
        contactName,
        contactPhone,
        contactEmail,
        civilId: clientType === 'individual' ? civilId : undefined,
        language: clientType === 'individual' ? language : undefined,
        course: row.course,
        cost: row.costPerPerson,
        requested: row.quantity,
        startDate: row.trainingDate,
        endDate: row.trainingDate,
        status: statusType
      }));

      await Promise.all(enquiries.map(enq => enquiryService.createEnquiry(enq)));

      toast.success(`${enquiries.length} enquir${enquiries.length > 1 ? 'ies' : 'y'} created successfully`);

      if (statusType === 'Pending Nomination') {
        navigate('/nomination/pending');
      } else {
        navigate('/enquiries/pending');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create enquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="text-sm font-normal">
          <a href="#" onClick={() => navigate('/enquiries/pending')} className="text-[#888] no-underline hover:underline">Enquiries</a>
          <span className="mx-2 text-[#aaa]">/</span>
          <span className="text-font-color font-bold">New Enquiry</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white p-[25px] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        <div className="grid grid-cols-3 gap-5">
          {/* Client Type */}
          <div className="flex flex-col mb-0">
            <label className="mb-[5px] font-medium">Client Type:</label>
            <div className="pt-[5px]">
              <input
                type="radio"
                id="clientTypeCompany"
                name="clientType"
                value="company"
                checked={clientType === 'company'}
                onChange={() => handleClientTypeChange('company')}
              />
              <label htmlFor="clientTypeCompany" className="cursor-pointer ml-1">
                Company
              </label>
              <input
                type="radio"
                id="clientTypeIndividual"
                name="clientType"
                value="individual"
                checked={clientType === 'individual'}
                onChange={() => handleClientTypeChange('individual')}
                className="ml-[15px]"
              />
              <label htmlFor="clientTypeIndividual" className="cursor-pointer ml-1">
                Individual
              </label>
            </div>
          </div>

          {/* Client Selection/Input */}
          <div className="flex flex-col mb-0">
            <label className="mb-[5px] font-medium">
              {clientType === 'company' ? 'Company Name:' : 'Student Name:'}
            </label>
            {clientType === 'company' ? (
              <select
                value={selectedClient}
                onChange={(e) => handleClientChange(e.target.value)}
                className="p-2 rounded-[4px] border border-border-color font-inter text-sm"
              >
                <option value="">Select Client...</option>
                {clients.filter(c => c.type !== 'individual').map(client => (
                  <option key={client._id} value={client.name}>
                    {client.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={selectedClient}
                onChange={(e) => handleClientChange(e.target.value)}
                placeholder="Enter student name"
                className="p-2 rounded-[4px] border border-border-color font-inter text-sm"
              />
            )}
          </div>

          <div className="flex flex-col mb-0"></div>

          {/* Individual-specific fields */}
          {clientType === 'individual' && (
            <>
              <div className="flex flex-col mb-0">
                <label className="mb-[5px] font-medium">Civil ID:</label>
                <input
                  type="text"
                  value={civilId}
                  onChange={(e) => setCivilId(e.target.value)}
                  onBlur={handleCivilIdBlur}
                  placeholder="Enter Civil ID"
                  className="p-2 rounded-[4px] border border-border-color font-inter text-sm"
                />
              </div>
              <div className="flex flex-col mb-0">
                <label className="mb-[5px] font-medium">Language:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="p-2 rounded-[4px] border border-border-color font-inter text-sm"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col mb-0"></div>
            </>
          )}

          {/* Contact Details */}
          <div className="flex flex-col mb-0">
            <label className="mb-[5px] font-medium">Contact Person Name:</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="e.g., John Doe"
              className="p-2 rounded-[4px] border border-border-color font-inter text-sm"
            />
          </div>
          <div className="flex flex-col mb-0">
            <label className="mb-[5px] font-medium">Contact Phone:</label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="e.g., 555-1234"
              className="p-2 rounded-[4px] border border-border-color font-inter text-sm"
            />
          </div>
          <div className="flex flex-col mb-0">
            <label className="mb-[5px] font-medium">Contact Email:</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="e.g., john.d@example.com"
              className="p-2 rounded-[4px] border border-border-color font-inter text-sm"
            />
          </div>
        </div>

        <hr className="my-5 border-border-color" />

        {/* Paste Data Section */}
        <div className="flex gap-[10px] mb-[5px] items-start">
          <textarea
            value={pasteData}
            onChange={(e) => setPasteData(e.target.value)}
            rows="3"
            placeholder="Paste data here, one course per line (e.g., Fire Warden 15)"
            className="w-full p-2 border border-border-color font-inter text-sm"
          ></textarea>
          <button
            onClick={handlePasteProcess}
            className="px-5 py-[10px] border-none rounded-[5px] cursor-pointer text-sm font-bold bg-primary text-white whitespace-nowrap hover:bg-opacity-90"
          >
            Process
          </button>
        </div>
        <div className="text-[11px] text-[#666] mb-[15px]">
          <b>Instructions:</b> Paste course and quantity data, one entry per line. Example:<br />
          Fire Warden 15<br />
          First Aid 10
        </div>

        {/* Course Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
            <thead>
              <tr>
                <th className="p-2 text-center border-b border-border-color w-[30px]">✓</th>
                <th className="p-2 text-left border-b border-border-color">Course</th>
                <th className="p-2 text-center border-b border-border-color">Qty</th>
                <th className="p-2 text-left border-b border-border-color">Training Date</th>
                <th className="p-2 text-center border-b border-border-color">Cost/Person</th>
                <th className="p-2 text-right border-b border-border-color">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {courseRows.map((row, index) => (
                <tr key={index}>
                  <td className="p-2 text-center border-b border-border-color">
                    <input
                      type="checkbox"
                      checked={row.selected}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
                  <td className="p-2 text-left border-b border-border-color">{row.course}</td>
                  <td className="p-2 text-center border-b border-border-color">
                    <input
                      type="number"
                      value={row.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      disabled={!row.selected}
                      min="0"
                      className="w-[70px] p-1 text-center border border-border-color rounded-none disabled:bg-[#f0f0f0]"
                    />
                  </td>
                  <td className="p-2 text-left border-b border-border-color">
                    <input
                      type="date"
                      value={row.trainingDate}
                      onChange={(e) => handleDateChange(index, e.target.value)}
                      disabled={!row.selected}
                      className="w-[220px] text-center p-1 border border-border-color rounded-none disabled:bg-[#f0f0f0]"
                    />
                  </td>
                  <td className="p-2 text-center border-b border-border-color">
                    <input
                      type="number"
                      value={row.costPerPerson}
                      onChange={(e) => handleCostChange(index, e.target.value)}
                      disabled={!row.selected}
                      min="0"
                      step="0.01"
                      className="w-[100px] p-1 text-center border border-border-color rounded-none disabled:bg-[#f0f0f0]"
                    />
                  </td>
                  <td className="p-2 text-right border-b border-border-color font-bold">
                    {row.totalCost > 0 ? row.totalCost.toFixed(2) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 flex justify-end gap-[10px]">
        <button
          onClick={handleSaveDraft}
          disabled={loading}
          className="px-5 py-[10px] border-none rounded-[5px] cursor-pointer text-sm font-bold transition-colors duration-200 bg-[#ccc] text-font-color hover:bg-opacity-90 disabled:opacity-50"
        >
          {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
          Save as Draft
        </button>
        {clientType === 'company' && (
          <button
            onClick={handleSaveAndSendQuotation}
            disabled={loading}
            className="px-5 py-[10px] border-none rounded-[5px] cursor-pointer text-sm font-bold transition-colors duration-200 bg-primary text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
            Save & Send Quotation
          </button>
        )}
        {clientType === 'individual' && (
          <button
            onClick={handleNominateIndividual}
            disabled={loading}
            className="px-5 py-[10px] border-none rounded-[5px] cursor-pointer text-sm font-bold transition-colors duration-200 bg-success text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
            Nominate
          </button>
        )}
      </div>
    </div>
  );
}

export default NewEnquiryPage;
