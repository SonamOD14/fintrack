const Transaction = require("../models/TransactionModel");

// ✅ Create Transaction
exports.createTransaction = async (req, res) => {
  try {
    const {
      title : title,
      merchant,
      amount,
      type : type,
      category,
      transactionDate : transactionDate,
      transactionTime : transactionTime,
      description : description,
      status,
    } = req.body;


    const userId = req.user.id

    console.log(title, merchant, amount, type, category,transactionDate  )
    if(!userId) {
      return console.log("userid not found")
    }


    if (!title || !amount || !type || !userId) {
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


exports.getAllTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]]
    });

    // Convert amount to number
    const formattedTransactions = transactions.map(transaction => {
      const t = transaction.toJSON();
      return {
        ...t,
        amount: parseFloat(t.amount)
      };
    });

    res.status(200).json({
      success: true,
      data: formattedTransactions
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


// Add this to your transactionController.js
exports.getTransactionAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.findAll({ where: { userId } });

    // --- CATEGORY DATA (Radar/Pie) ---
    const categoryTotals = transactions.reduce((acc, curr) => {
      if (curr.type === 'expense') {
        const cat = curr.category || 'Other';
        acc[cat] = (acc[cat] || 0) + parseFloat(curr.amount);
      }
      return acc;
    }, {});

    // --- MONTHLY DATA (Cash Flow Chart) ---
    const monthlyMap = {};

    transactions.forEach(curr => {
      // Ensure the date is parsed correctly regardless of format
      const dateObj = new Date(curr.transactionDate);
      if (isNaN(dateObj)) return; // Skip invalid dates

      const monthName = dateObj.toLocaleString('default', { month: 'short' });

      if (!monthlyMap[monthName]) {
        monthlyMap[monthName] = { month: monthName, income: 0, expenses: 0, savings: 0 };
      }

      const amt = parseFloat(curr.amount);
      if (curr.type === 'income') {
        monthlyMap[monthName].income += amt;
      } else {
        monthlyMap[monthName].expenses += amt;
      }
      monthlyMap[monthName].savings = monthlyMap[monthName].income - monthlyMap[monthName].expenses;
    });

    // Sort monthly data by actual calendar order (Jan, Feb, Mar...)
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const sortedMonthly = Object.values(monthlyMap).sort((a, b) => 
      monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
    );

    res.status(200).json({
      success: true,
      categoryData: Object.keys(categoryTotals).map(cat => ({ category: cat, amount: categoryTotals[cat] })),
      monthlyData: sortedMonthly
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};