import { useState } from 'react';
import { toast } from 'react-hot-toast';
import clientService from '../../../services/clientService';
import studentService from '../../../services/studentService';

function WalkInClientForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    civilId: '',
    phone: '',
    email: '',
    language: 'English'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.civilId || !formData.phone) {
      toast.error('Please fill in Student Name, Civil ID, and Contact Number');
      return;
    }

    try {
      setLoading(true);

      const clientData = {
        name: formData.name,
        type: 'individual',
        contact: {
          contactName: formData.name,
          contactPhone: formData.phone,
          contactEmail: formData.email || `${formData.civilId}@example.com`
        }
      };

      await clientService.createClient(clientData);

      const studentData = {
        civilId: formData.civilId,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        language: formData.language
      };

      await studentService.createStudent(studentData);

      toast.success(`Walk-in client "${formData.name}" created successfully`);
      onSuccess(formData.name);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        toast.error('A client or student with this information already exists');
      } else {
        toast.error(error.response?.data?.message || 'Failed to create walk-in client');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-blue-600 mb-6 text-center">
        Walk-in Client Details
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="form-group">
            <label>Student Name *</label>
            <input
              type="text"
              placeholder="e.g., John Smith"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Civil ID *</label>
            <input
              type="text"
              placeholder="e.g., 199012345678"
              value={formData.civilId}
              onChange={(e) => setFormData({ ...formData, civilId: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Number *</label>
            <input
              type="text"
              placeholder="e.g., 555-8765"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email ID</label>
            <input
              type="email"
              placeholder="e.g., john.s@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group col-span-2">
            <label>Language</label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            >
              <option value="English">English</option>
              <option value="Arabic">Arabic</option>
              <option value="Hindi">Hindi</option>
              <option value="Urdu">Urdu</option>
              <option value="Bengali">Bengali</option>
              <option value="Filipino">Filipino</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Creating...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i> Save & Continue
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default WalkInClientForm;
