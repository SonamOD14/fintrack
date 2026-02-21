const express = require("express");
const router = express.Router();

const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} = require("../controllers/transactionController");
const authGuard = require("../helper/authguard");


// ✅ Create Transaction
router.post("/", authGuard, createTransaction);

// ✅ Get All Transactions (by user)
router.get("/get-all/:userId", getAllTransactions);

// ✅ Get Single Transaction
router.get("/get-single/:id", getTransactionById);

// ✅ Update Transaction
router.put("/update/:id", updateTransaction);

// ✅ Delete Transaction
router.delete("/delete/:id", deleteTransaction);


module.exports = router;