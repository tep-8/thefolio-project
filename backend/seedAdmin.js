// backend/seedAdmin.js
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        // 1. Connect to the Database
        await connectDB();

        // 2. Check if Admin already exists
        const exists = await User.findOne({ email: 'admin@thefolio.com' });
        
        if (exists) {
            console.log('--- Admin account already exists ---');
            process.exit(0);
        }

        // 3. Create the Admin Account
        // Note: Your User model's pre-save hook will automatically hash this password
        await User.create({
            name: 'TheFolio Admin',
            email: 'admin@thefolio.com',
            password: 'Admin@1234',
            role: 'admin',
        });

        console.log('******************************************');
        console.log('Admin account created successfully!');
        console.log('Email: admin@thefolio.com');
        console.log('Password: Admin@1234');
        console.log('******************************************');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();