const { mongoose } = require("mongoose");
const Transaction = require("../models/Transactions");

const addTransaction = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    if (!amount || !category || !date) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }
    const transaction = await Transaction.create({
      userId: req.user,
      amount: Number(amount),
      category,
      description,
      date: new Date(date),
    });
    res.status(200).json(transaction);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user }).sort({
      date: -1,
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addTransaction, getTransactions };
