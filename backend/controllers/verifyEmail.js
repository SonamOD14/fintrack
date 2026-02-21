const User = require("../models/UserModels");

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    //If the user opens the route without a token, backend rejects it
    if (!token) {
      return res.status(400).json({
        message: "invalid token passed"
      })
    }

    //looks in database for a user whose verification = token
    const user = await User.findOne({ where: { verificationToken: token } })
    if (!user) {
      return res.status(400).json({
        message: `invalid token`
      })
    }

    //check token time
    if (user.TokenExpires < new Date) {
      return res.status(400).json({
        message: "erpire time"
      })
    }

    //modify rom data
    user.isVerified = true,
      user.verificationToken = null,
      user.TokenExpires = null

    await user.save();
    return res.status(202).json({
      message: "email verify successfully mate "
    })

  } catch (error) {
    return res.json({
      message: "server side error",
      error: error.message
    })
  }
}

module.exports = verifyEmail;