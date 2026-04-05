const Record = require("../models/Record");

exports.getSummary = async (req, res) => {
  try {
    const userId = req.user._id; // 🔥 logged-in user only

    const records = await Record.find({ userId });

    let totalIncome = 0;
    let totalExpense = 0;
    let categoryTotals = {};

    records.forEach((rec) => {
      if (rec.type === "income") totalIncome += rec.amount;
      else totalExpense += rec.amount;

      // category-wise totals
      categoryTotals[rec.category] =
        (categoryTotals[rec.category] || 0) + rec.amount;
    });

    const balance = totalIncome - totalExpense;

    // recent activity (last 5)
    const recent = records
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);

    // 📊 Monthly Trends
    let monthlyTrends = {};

    records.forEach((rec) => {
      const month = new Date(rec.date).toLocaleString("default", {
        month: "short",
        year: "numeric"
      });

      if (!monthlyTrends[month]) {
        monthlyTrends[month] = { income: 0, expense: 0 };
      }

      if (rec.type === "income") {
        monthlyTrends[month].income += rec.amount;
      } else {
        monthlyTrends[month].expense += rec.amount;
      }
    });

    // 📊 Weekly Trends
    let weeklyTrends = {};

    records.forEach((rec) => {
      const week = `Week-${Math.ceil(new Date(rec.date).getDate() / 7)}`;

      if (!weeklyTrends[week]) {
        weeklyTrends[week] = { income: 0, expense: 0 };
      }

      if (rec.type === "income") {
        weeklyTrends[week].income += rec.amount;
      } else {
        weeklyTrends[week].expense += rec.amount;
      }
    });

    res.json({
      totalIncome,
      totalExpense,
      balance,
      categoryTotals,
      recent,
      monthlyTrends,
      weeklyTrends
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};