const Enquiry = require('../models/Enquiry');
const Client = require('../models/Client');
const Course = require('../models/Course');
const Counter = require('../models/Counter');

exports.createEnquiry = async (req, res) => {
  try {
    const counter = await Counter.getNextSequence('enquiryId');
    const enquiryId = `ENQ-${String(counter).padStart(3, '0')}`;

    const client = await Client.findOne({ name: req.body.client });
    const course = await Course.findOne({ name: req.body.course });

    const enquiry = await Enquiry.create({
      ...req.body,
      enquiryId,
      clientRef: client?._id,
      courseRef: course?._id,
      createdBy: req.user._id,
      updatedBy: req.user._id
    });

    await enquiry.addActivity('Enquiry Created', `Enquiry created by ${req.user.name}`, req.user._id, req.user.name);

    res.status(201).json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllEnquiries = async (req, res) => {
  try {
    const { status, client, course, startDate, endDate, search } = req.query;

    let query = { isActive: true };

    if (status) {
      if (status === 'pending') {
        query.status = { $in: ['Draft', 'Quotation Sent', 'Agreement Pending', 'Agreement Sent'] };
      } else {
        query.status = status;
      }
    }

    if (client) query.client = new RegExp(client, 'i');
    if (course) query.course = new RegExp(course, 'i');
    if (startDate) query.startDate = { $gte: new Date(startDate) };
    if (endDate) query.startDate = { ...query.startDate, $lte: new Date(endDate) };

    if (search) {
      query.$or = [
        { enquiryId: new RegExp(search, 'i') },
        { client: new RegExp(search, 'i') },
        { course: new RegExp(search, 'i') },
        { contactName: new RegExp(search, 'i') },
        { contactEmail: new RegExp(search, 'i') }
      ];
    }

    const enquiries = await Enquiry.find(query)
      .populate('clientRef', 'name type contact')
      .populate('courseRef', 'name code cost classCapacity')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate('clientRef', 'name type contact')
      .populate('courseRef', 'name code cost classCapacity')
      .populate('batchRef', 'batchId courseName date session');

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.status(200).json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateEnquiry = async (req, res) => {
  try {
    let enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user._id },
      { new: true, runValidators: true }
    );

    await enquiry.addActivity('Enquiry Updated', `Enquiry updated by ${req.user.name}`, req.user._id, req.user.name);

    res.status(200).json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateEnquiryStatus = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    const { status, details } = req.body;

    await enquiry.updateStatus(status, req.user._id, req.user.name, details);

    if (status === 'Quotation Sent') {
      enquiry.quotationSentDate = new Date();
    } else if (status === 'Agreement Sent') {
      enquiry.agreementSentDate = new Date();
    }

    await enquiry.save();

    res.status(200).json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addNoteToEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    await enquiry.addNote(req.body.content, req.user._id, req.user.name);

    res.status(200).json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    enquiry.isActive = false;
    await enquiry.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEnquiryStats = async (req, res) => {
  try {
    const openEnquiries = await Enquiry.countDocuments({
      status: { $in: ['Draft', 'Quotation Sent', 'Agreement Pending', 'Agreement Sent'] },
      isActive: true
    });

    const pendingNominations = await Enquiry.countDocuments({
      status: { $in: ['Pending Nomination', 'Nominated'] },
      isActive: true
    });

    const scheduled = await Enquiry.countDocuments({
      status: 'Scheduled',
      isActive: true
    });

    const completed = await Enquiry.countDocuments({
      status: 'Completed',
      isActive: true
    });

    res.status(200).json({
      success: true,
      data: {
        openEnquiries,
        pendingNominations,
        scheduled,
        completed
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
