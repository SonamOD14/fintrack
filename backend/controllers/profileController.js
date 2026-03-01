const User = require("../models/UserModels");

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user and exclude the password for security
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to load profile", 
      error: err.message 
    });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, monthlyBudget, profilePicture } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Explicitly update and save
    user.username = username || user.username;
    user.monthlyBudget = monthlyBudget !== undefined ? parseFloat(monthlyBudget) : user.monthlyBudget;
    // user.profilePicture = profilePicture; // If you added this column

    await user.save(); // This ensures the 'updatedAt' timestamp actually changes

    // Reload the user data to get the absolute latest from DB
    await user.reload();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};