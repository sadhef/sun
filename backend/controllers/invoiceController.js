const Invoice = require('../models/Invoice');
const Counter = require('../models/Counter');

const generateInvoiceNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'invoice' },
    { $inc: { value: 1 } },
    { upsert: true, new: true }
  );
  const now = new Date();
  return `INV-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(counter.value).padStart(3, '0')}`;
};

exports.getAllInvoices = async (req, res) => {
  try {
    const { status, client } = req.query;
    let query = {};

    if (status) query.status = status;
    if (client) query.client = { $regex: client, $options: 'i' };

    const invoices = await Invoice.find(query)
      .populate('clientRef', 'name contactPerson contactEmail')
      .sort({ issueDate: -1 });

    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('clientRef');
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const invoiceNumber = await generateInvoiceNumber();
    req.body.invoiceId = invoiceNumber;
    req.body.invoiceNumber = invoiceNumber;
    req.body.createdBy = req.user._id;

    const invoice = await Invoice.create(req.body);
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    req.body.updatedBy = req.user._id;
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsPaid = async (req, res) => {
  try {
    const { paymentDate, paymentMethod } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status: 'Paid', paidDate: paymentDate || new Date(), paymentMethod },
      { new: true }
    );
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
