import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import batchService from '../../../services/batchService';
import studentService from '../../../services/studentService';

function BatchNominationModal({ batch, clientName, courseName, onSuccess, onClose }) {
  const [students, setStudents] = useState([]);
  const [pasteArea, setPasteArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [nominated, setNominated] = useState(batch.nominated || 0);
  const [pending, setPending] = useState(batch.pending || batch.classCapacity);

  useEffect(() => {
    if (batch.isJoining) {
      const clientGroup = batch.nominees.find((n) => n.name === clientName);
      if (clientGroup && clientGroup.students.length > 0) {
        setStudents(clientGroup.students);
      } else {
        addEmptyRow();
      }
    } else {
      addEmptyRow();
    }
  }, []);

  useEffect(() => {
    const totalNominated = batch.isJoining
      ? batch.nominated - (batch.nominees.find((n) => n.name === clientName)?.students.length || 0) + students.length
      : students.length;

    setNominated(totalNominated);
    setPending(Math.max(0, batch.classCapacity - totalNominated));
  }, [students]);

  const addEmptyRow = () => {
    setStudents([
      ...students,
      {
        civilId: '',
        name: '',
        contactNumber: '',
        email: '',
        language: 'English'
      }
    ]);
  };

  const removeRow = (index) => {
    const newStudents = students.filter((_, i) => i !== index);
    setStudents(newStudents);
  };

  const updateStudent = async (index, field, value) => {
    const newStudents = [...students];
    newStudents[index][field] = value;

    if (field === 'civilId' && value.trim()) {
      try {
        const { data } = await studentService.getStudentByCivilId(value.trim());
        newStudents[index] = {
          civilId: data.civilId,
          name: data.name,
          contactNumber: data.phone || '',
          email: data.email || '',
          language: data.language || 'English'
        };
        toast.success(`Student ${data.name} found`);
      } catch (error) {
        // Student not found, keep the Civil ID but don't auto-fill
      }
    }

    setStudents(newStudents);
  };

  const handlePasteProcess = async () => {
    const lines = pasteArea.trim().split('\n').filter((line) => line.trim());

    if (lines.length === 0) {
      toast.error('Please paste Civil IDs');
      return;
    }

    setLoading(true);
    const newStudents = [];

    for (const line of lines) {
      const civilId = line.trim();
      try {
        const { data } = await studentService.getStudentByCivilId(civilId);
        newStudents.push({
          civilId: data.civilId,
          name: data.name,
          contactNumber: data.phone || '',
          email: data.email || '',
          language: data.language || 'English'
        });
      } catch (error) {
        newStudents.push({
          civilId,
          name: '',
          contactNumber: '',
          email: '',
          language: 'English'
        });
      }
    }

    setStudents([...students, ...newStudents]);
    setPasteArea('');
    setLoading(false);
    toast.success(`Processed ${newStudents.length} Civil IDs`);
  };

  const handleSave = async () => {
    const validStudents = students.filter((s) => s.civilId.trim() && s.name.trim());

    if (validStudents.length === 0) {
      toast.error('Please add at least one student with Civil ID and Name');
      return;
    }

    if (validStudents.length > pending && !batch.isNew) {
      toast.error(`Cannot add ${validStudents.length} students. Only ${pending} seats available.`);
      return;
    }

    try {
      setLoading(true);

      if (batch.isNew) {
        const batchData = {
          courseName,
          classCapacity: batch.classCapacity,
          nominees: [
            {
              name: clientName,
              type: 'Company',
              students: validStudents
            }
          ]
        };

        await batchService.createBatch(batchData);
        toast.success('New batch created and students nominated');
      } else {
        const nominationData = {
          clientName,
          clientType: 'Company',
          students: validStudents
        };

        await batchService.addNomineesToBatch(batch._id, nominationData);
        toast.success('Students nominated to existing batch');
      }

      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save nominations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show">
      <div className="modal-content modal-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>

        <div className="modal-title">
          {batch.isNew
            ? `New Batch Nomination for ${courseName}`
            : `Edit Batch: ${batch.batchId}`}
        </div>

        <div className="modal-body">
          <div className="mb-4">
            <div className="flex gap-2 items-end">
              <textarea
                rows="4"
                placeholder="Paste student Civil IDs here (one per line)..."
                value={pasteArea}
                onChange={(e) => setPasteArea(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
              />
              <button
                onClick={handlePasteProcess}
                disabled={loading}
                className="btn btn-primary whitespace-nowrap"
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <>
                    <i className="fas fa-paste"></i> Process
                  </>
                )}
              </button>
            </div>
          </div>

          <hr className="my-4" />

          <div className="flex gap-6 items-center mb-4 p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-semibold">Class Capacity:</span>{' '}
              <span className="text-lg">{batch.classCapacity}</span>
            </div>
            <div className="border-l border-gray-300 pl-6">
              <span className="font-semibold">Nominated:</span>{' '}
              <span className="text-lg text-blue-600">{nominated}</span>
            </div>
            <div>
              <span className="font-semibold">Pending:</span>{' '}
              <span className={`text-lg font-bold ${pending > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {pending}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="data-table">
              <thead className="sticky top-0 bg-gray-100 z-10">
                <tr>
                  <th className="w-12">#</th>
                  <th>Client</th>
                  <th>Civil ID *</th>
                  <th>Student Name *</th>
                  <th>Contact #</th>
                  <th>Email</th>
                  <th>Language</th>
                  <th className="text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {batch.nominees
                  .filter((group) => batch.isJoining && group.name !== clientName)
                  .map((group) =>
                    group.students.map((student, idx) => (
                      <tr key={`existing-${group.name}-${idx}`} className="bg-gray-50">
                        <td>{idx + 1}</td>
                        <td className="font-medium">{group.name}</td>
                        <td>{student.civilId}</td>
                        <td>{student.name}</td>
                        <td>{student.contactNumber || 'N/A'}</td>
                        <td>{student.email || 'N/A'}</td>
                        <td>{student.language}</td>
                        <td className="text-center text-gray-400">
                          <i className="fas fa-lock"></i>
                        </td>
                      </tr>
                    ))
                  )}

                {students.map((student, index) => (
                  <tr key={index} className="bg-blue-50">
                    <td>{batch.nominees.reduce((sum, g) => sum + g.students.length, 0) + index + 1}</td>
                    <td className="font-medium text-blue-700">{clientName}</td>
                    <td>
                      <input
                        type="text"
                        value={student.civilId}
                        onChange={(e) => updateStudent(index, 'civilId', e.target.value)}
                        placeholder="Civil ID"
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={student.name}
                        onChange={(e) => updateStudent(index, 'name', e.target.value)}
                        placeholder="Name"
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={student.contactNumber}
                        onChange={(e) => updateStudent(index, 'contactNumber', e.target.value)}
                        placeholder="Phone"
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        value={student.email}
                        onChange={(e) => updateStudent(index, 'email', e.target.value)}
                        placeholder="Email"
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
                    <td>
                      <select
                        value={student.language}
                        onChange={(e) => updateStudent(index, 'language', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="English">English</option>
                        <option value="Arabic">Arabic</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Urdu">Urdu</option>
                        <option value="Bengali">Bengali</option>
                        <option value="Filipino">Filipino</option>
                      </select>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => removeRow(index)}
                        className="text-red-600 hover:text-red-800"
                        title="Remove"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-footer flex justify-between">
          <button onClick={addEmptyRow} className="btn btn-secondary">
            <i className="fas fa-plus"></i> Add Row
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} disabled={loading} className="btn btn-primary">
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Save Nominations
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BatchNominationModal;
