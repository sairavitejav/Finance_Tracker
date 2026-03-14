const User = require("../models/Users");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select(
      "username email monthlyIncome"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      username: user.username,
      email: user.email,
      monthlyIncome: user.monthlyIncome,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const updateIncome = async (req, res) => {
  try {
    const { monthlyIncome } = req.body;
    if (monthlyIncome === undefined || monthlyIncome === null) {
      return res.status(400).json({ message: "Monthly income is required" });
    }
    const user = await User.findByIdAndUpdate(
      req.user,
      { monthlyIncome },
      { new: true }
    ).select("monthlyIncome");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ monthlyIncome: user.monthlyIncome });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getProfile, updateIncome };
