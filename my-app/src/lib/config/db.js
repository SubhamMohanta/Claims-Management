import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    throw new Error("❌ MONGO_URI is missing in .env file");
}

export const ConnectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log(`✅ Using existing MongoDB connection`);
        return;
    }

    try {
        console.log("🔄 Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ MongoDB Connected`);
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        throw new Error("Failed to connect to MongoDB.");
    }
};
