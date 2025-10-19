const Batch = require('../models/Batch');
const Enquiry = require('../models/Enquiry');
const Course = require('../models/Course');
const Counter = require('../models/Counter');

exports.createBatch = async (req, res) => {
  try {
    const { courseName, classCapacity, nominees, date, session } = req.body;

    const initial = courseName.charAt(0).toUpperCase();
    const counter = await Counter.getNextSequence(`batch${initial}`);
    const batchId = `Batch-${initial}-${String(counter).padStart(3, '0')}`;

    const course = await Course.findOne({ name: courseName });

    const batch = await Batch.create({
      batchId,
      courseName,
      courseRef: course?._id,
      classCapacity: classCapacity || course?.classCapacity || 15,
      nominees: nominees || [],
      date,
      session,
      createdBy: req.user._id,
      updatedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: batch
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllBatches = async (req, res) => {
  try {
    const { courseName, status, hasAvailableSeats } = req.query;

    let query = { isActive: true };

    if (courseName) query.courseName = courseName;
    if (status) query.status = status;
    if (hasAvailableSeats === 'true') query.pending = { $gt: 0 };

    const batches = await Batch.find(query)
      .populate('courseRef', 'name code cost classCapacity')
      .populate('enquiries', 'enquiryId client course')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: batches.length,
      data: batches
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id)
      .populate('courseRef', 'name code cost classCapacity')
      .populate('enquiries', 'enquiryId client course contactName contactEmail');

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    res.status(200).json({
      success: true,
      data: batch
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBatch = async (req, res) => {
  try {
    let batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    batch = await Batch.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user._id },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: batch
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addNomineesToBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const { clientName, clientType, students, enquiryId } = req.body;

    const existingClientGroup = batch.nominees.find(n => n.name === clientName);

    if (existingClientGroup) {
      existingClientGroup.students = students;
    } else {
      batch.nominees.push({
        name: clientName,
        type: clientType,
        students
      });
    }

    if (enquiryId) {
      const enquiry = await Enquiry.findOne({ enquiryId });
      if (enquiry) {
        enquiry.batchNumber = batch.batchId;
        enquiry.batchRef = batch._id;
        enquiry.nominated = students.length;
        enquiry.nominees = students.map(s => ({
          civilId: s.civilId,
          name: s.name,
          phone: s.contactNumber,
          email: s.email,
          language: s.language
        }));
        enquiry.status = 'Nominated';
        await enquiry.save();

        if (!batch.enquiries.includes(enquiry._id)) {
          batch.enquiries.push(enquiry._id);
        }
      }
    }

    await batch.save();

    res.status(200).json({
      success: true,
      data: batch
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAvailableBatches = async (req, res) => {
  try {
    const { courseName } = req.query;

    if (!courseName) {
      return res.status(400).json({ success: false, message: 'Course name is required' });
    }

    const batches = await Batch.findAvailableBatches(courseName);

    res.status(200).json({
      success: true,
      count: batches.length,
      data: batches
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    batch.isActive = false;
    await batch.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
