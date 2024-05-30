import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

// user register
export const register = async (req, res) => {
   try {
      //hashing password
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(req.body.password, salt)

      const newUser = new User({
         username: req.body.username,
         email: req.body.email,
         password: hash,
         photo: req.body.photo
      })

      await newUser.save()

      res.status(200).json({ success: true, message: "Successfully created!" })
   } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create! Try again." })
   }
}

// user login
export const login = async (req, res) => {
   try {
      const email = req.body.email
      const user = await User.findOne({ email })

      // if user doesn't exist
      if (!user) {
         return res.status(404).json({ success: false, message: 'User not found!' })
      }

      // if user is exist then check the passord or compare the password
      const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password)

      // if password incorrect 
      if (!checkCorrectPassword) {
         return res.status(401).json({ susccess: false, message: "Incorrect email or password!" })
      }

      const { password, role, ...rest } = user._doc

      // create jwt token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn:"15d" })

      // set token in the browser cookies and send the response to the client
      res.cookie('accessToken', token, {
         httpOnly: true,
         expires: token.expiresIn
      }).status(200).json({token, data:{...rest}, role})
   } catch (error) {
      res.status(500).json({ susccess: false, message: "Failed to login" + error.message })
   }
   
}
export const resetPassword = async (req, res) => {
   try {
      const { email, newPassword } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });

      // If user doesn't exist
      if (!user) {
         return res.status(404).json({ success: false, message: 'User not found!' });
      }

      // Hash the new password
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(newPassword, salt);

      // Update the user's password
      user.password = hash;
      await user.save();

      res.status(200).json({ success: true, message: "Password reset successful!" });
   } catch (error) {
      res.status(500).json({ success: false, message: "Failed to reset password. Please try again." });
   }
}