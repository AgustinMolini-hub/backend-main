import { connectDB } from '../src/config/database.js';
import mongoose from 'mongoose';

before(async function () {
    this.timeout(15000);

    await connectDB();
});

after(async function () {
    this.timeout(10000);

    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
});
