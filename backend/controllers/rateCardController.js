const RateCard = require('../models/RateCard');

exports.getAllRateCards = async (req, res) => {
  try {
    const rateCards = await RateCard.find({ isActive: true })
      .populate('clientRef', 'name')
      .sort({ client: 1 });

    res.json({ success: true, count: rateCards.length, data: rateCards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getClientRateCard = async (req, res) => {
  try {
    const rateCard = await RateCard.findOne({
      clientRef: req.params.clientId,
      isActive: true,
      $or: [
        { validUntil: { $exists: false } },
        { validUntil: { $gte: new Date() } }
      ]
    }).populate('clientRef');

    if (!rateCard) {
      return res.status(404).json({ success: false, message: 'No active rate card found for this client' });
    }

    res.json({ success: true, data: rateCard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createRateCard = async (req, res) => {
  try {
    req.body.createdBy = req.user._id;
    const rateCard = await RateCard.create(req.body);
    res.status(201).json({ success: true, data: rateCard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRateCard = async (req, res) => {
  try {
    req.body.updatedBy = req.user._id;
    const rateCard = await RateCard.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!rateCard) return res.status(404).json({ success: false, message: 'Rate card not found' });
    res.json({ success: true, data: rateCard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
