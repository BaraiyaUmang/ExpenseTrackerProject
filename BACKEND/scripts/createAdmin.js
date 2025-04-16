require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      // Update existing user to admin if not already
      if (!existingAdmin.isAdmin) {
        existingAdmin.isAdmin = true;
        await existingAdmin.save();
        console.log(`Updated user ${existingAdmin.email} to admin role`);
      } else {
        console.log(`User ${existingAdmin.email} is already an admin`);
      }
    } else {
      // Create new admin user
      const adminUser = new User({
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        isAdmin: true
      });
      
      await adminUser.save();
      console.log(`Created new admin user: ${adminUser.email}`);
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
createAdminUser(); 