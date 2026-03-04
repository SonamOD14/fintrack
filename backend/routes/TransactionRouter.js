const express = require("express");
const router = express.Router();

const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionAnalytics
} = require("../controllers/transactionController");
const authGuard = require("../middleware/authguard");


// ✅ Create Transaction
router.post("/", authGuard, createTransaction);

// ✅ Get All Transactions (by user)
router.get("/get-all", authGuard,getAllTransactions);

// ✅ Get Single Transaction
router.get("/get-single/:id", getTransactionById);

// ✅ Update Transaction
router.put("/update/:id", updateTransaction);

// ✅ Delete Transaction
router.delete("/delete/:id", deleteTransaction);

// ✅ get analytics
router.get("/analytics",authGuard, getTransactionAnalytics);

module.exports = router;