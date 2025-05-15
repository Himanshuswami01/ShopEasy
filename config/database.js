import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://himanshuswamiccc:Himanshuswami830@cluster01.xuaadwz.mongodb.net/fashion_store';

// Connect to MongoDB
export async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Create a reusable database connection
export const db = mongoose.connection;

// Handle connection events
db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

db.once('open', () => {
    console.log('MongoDB connection established');
});

export default {
    connectDB,
    db
}; 