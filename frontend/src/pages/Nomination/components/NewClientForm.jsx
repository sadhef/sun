import { useState } from 'react';
import { toast } from 'react-hot-toast';
import clientService from '../../../services/clientService';

function NewClientForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    type: 'company'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.contactName || !formData.contactPhone || !formData.contactEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const clientData = {
        name: formData.name,
        type: formData.type,
        contact: {
          contactName: formData.contactName,
          contactPhone: formData.contactPhone,
          contactEmail: formData.contactEmail
        }
      };

      await clientService.createClient(clientData);
      toast.success(`Client "${formData.name}" created successfully`);
      onSuccess(formData.name);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-blue-600 mb-6 text-center">
        Step 1: New Client Details
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label>Client Name *</label>
            <input
              type="text"
              placeholder="e.g., Apex Global Services"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Person *</label>
            <input
              type="text"
              placeholder="e.g., Jane Doe"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Number *</label>
            <input
              type="text"
              placeholder="e.g., 555-8765"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email ID *</label>
            <input
              type="email"
              placeholder="e.g., jane.d@apex.com"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              required
            />
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

export default NewClientForm;
