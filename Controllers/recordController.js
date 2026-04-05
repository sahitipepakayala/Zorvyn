const Record = require("../models/Record");

// Create Record
exports.createRecord = async (req, res) => {
  try {
   const { amount, type, category } = req.body;
  const userId = req.user._id;
    if (!userId || !amount || !type || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    const record = await Record.create({
  userId,
  amount,
  type,
  category,
  note: req.body.note
});

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Records (with filters)
exports.getRecords = async (req, res) => {
  try {

    const { type, category, page = 1, limit = 5 } = req.query;

    let filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;

    const records = await Record.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Record
exports.updateRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Record
exports.deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};