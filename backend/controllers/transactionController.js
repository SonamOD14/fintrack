const Transaction = require("../models/TransactionModel");

// ✅ Create Transaction
exports.createTransaction = async (req, res) => {
  try {
    const {
      name : title,
      merchant,
      amount,
      transactionType : type,
      category,
      date : transactionDate,
      time : transactionTime,
      notes : description,
      status,
    } = req.body;

    const userId = req.user.id

    if(!userId) {
      return console.log("userid not found")
    }


    if (!title || !amount || !type || !tran || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const transaction = await Transaction.create({
      title,
      merchant,
      amount,
      type,
      category,
      transactionDate,
      transactionTime,
      description,
      status,
      userId
    });

    res.status(201).json({
      success: true,
      data: transaction
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating transaction",
      error: error.message
    });
  }
};


// ✅ Get All Transactions (by user)
exports.getAllTransactions = async (req, res) => {
  try {

    const { userId } = req.params;

    const transactions = await Transaction.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]]
    });

    res.status(200).json({
      success: true,
      data: transactions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching transactions",
      error: error.message
    });
  }
};


// ✅ Get Single Transaction
exports.getTransactionById = async (req, res) => {
  try {

    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching transaction",
      error: error.message
    });
  }
};


// ✅ Update Transaction
exports.updateTransaction = async (req, res) => {
  try {

    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    await transaction.update(req.body);

    res.status(200).json({
      success: true,
      data: transaction
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating transaction",
      error: error.message
    });
  }
};


// ✅ Delete Transaction
exports.deleteTransaction = async (req, res) => {
  try {

    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    await transaction.destroy();

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting transaction",
      error: error.message
    });
  }
};