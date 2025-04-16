const User= require("./../models/User")
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendResetPasswordEmail } = require("../utils/emailService");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register User
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

// Validation: Check for missing fields
if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
}

try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
    }

    // Create the user
    const user = await User.create({
        fullName,
        email,
        password,
        profileImageUrl,
    });

    res.status(201).json({
        id: user._id,
        user,
        email: user.email,
        token:generateToken(user._id),
    });
} catch (error) {
    res.status(500).json({ message: "error registering user",error:error.message });
} 
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
}

try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
        id: user._id,
        user,
        token: generateToken(user._id),
    });
} catch (err) {
    res.status(500).json({ message: "error registering user",error:err.message });
}

};

// get User info
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
    
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    
        res.status(200).json(user);
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error registering user", error: err.message });
    }
    
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    console.log('Received forgot password request:', req.body);
    try {
        const { email } = req.body;
        console.log('Looking for user with email:', email);
        
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found, generating reset token');
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

        // Save reset token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Make sure FRONTEND_URL is set correctly
        if (!process.env.FRONTEND_URL) {
            console.error('FRONTEND_URL not set in environment variables');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        // Construct reset URL - ensure no trailing slash in FRONTEND_URL
        const baseUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
        const resetUrl = `${baseUrl}/reset-password/${resetToken}`;
        console.log('Reset URL generated:', resetUrl);
        
        await sendResetPasswordEmail(user.email, resetUrl);
        console.log('Reset email sent successfully');

        res.status(200).json({ 
            message: 'Password reset link sent to your email' 
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ 
            message: 'Error sending reset email' 
        });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const { token } = req.params;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                message: 'Password reset token is invalid or has expired' 
            });
        }

        // Update password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ 
            message: 'Password has been reset' 
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ 
            message: 'Error resetting password' 
        });
    }
};
