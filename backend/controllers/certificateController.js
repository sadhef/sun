const Certificate = require('../models/Certificate');
const Counter = require('../models/Counter');

const generateCertificateNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'certificate' },
    { $inc: { value: 1 } },
    { upsert: true, new: true }
  );
  return `CERT-${new Date().getFullYear()}-${String(counter.value).padStart(4, '0')}`;
};

const generateVerificationCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

exports.getAllCertificates = async (req, res) => {
  try {
    const { status, student, course } = req.query;
    let query = {};

    if (status) query.status = status;
    if (student) query.student = student;
    if (course) query.course = { $regex: course, $options: 'i' };

    const certificates = await Certificate.find(query)
      .populate('student', 'name civilId')
      .populate('trainer', 'name')
      .sort({ issueDate: -1 });

    res.json({ success: true, count: certificates.length, data: certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('student')
      .populate('trainer');
    if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });
    res.json({ success: true, data: certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCertificate = async (req, res) => {
  try {
    const certificateNumber = await generateCertificateNumber();
    req.body.certificateId = certificateNumber;
    req.body.certificateNumber = certificateNumber;
    req.body.verificationCode = generateVerificationCode();
    req.body.issuedBy = req.user._id;

    const certificate = await Certificate.create(req.body);
    res.status(201).json({ success: true, data: certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    const { code } = req.params;
    const certificate = await Certificate.findOne({ verificationCode: code })
      .populate('student', 'name civilId')
      .select('certificateNumber studentName course issueDate status');

    if (!certificate) {
      return res.status(404).json({ success: false, valid: false, message: 'Certificate not found' });
    }

    res.json({
      success: true,
      valid: true,
      certificate: {
        number: certificate.certificateNumber,
        student: certificate.studentName,
        course: certificate.course,
        issueDate: certificate.issueDate,
        status: certificate.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
