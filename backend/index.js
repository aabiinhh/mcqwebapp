require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const { MongoMemoryServer } = require('mongodb-memory-server');
const { seedDB } = require('./seed');

// Connect DB
const connectDB = async () => {
    try {
        let mongoUri = process.env.MONGO_URI;
        let isMemory = false;

        // If MONGO_URI is missing, fallback to testing in-memory DB
        if (!mongoUri || mongoUri === '') {
            const mongoServer = await MongoMemoryServer.create();
            mongoUri = mongoServer.getUri();
            isMemory = true;
            console.log("No MONGO_URI provided. Started in-memory MongoDB.");
        }

        await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected successfully at: ${mongoUri}`);

        if (isMemory) {
            console.log("Seeding in-memory database with test data...");
            await seedDB();
        }
    } catch (err) {
        console.error('Database connection strictly failed.', err);
        process.exit(1);
    }
};
connectDB();

// Attach Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/faculty', require('./routes/facultyRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
