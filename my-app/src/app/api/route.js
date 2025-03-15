import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
// import bcrypt from 'bcrypt';
import { ConnectDB } from "../../lib/config/db";
import User from "@/lib/models/userModel"; // ✅ Import User model

async function handleSignup(name, email, password, role) {
    try {
        await ConnectDB();

        if (!name || !email || !password || !role) {
            return { error: "All fields are required" };
        }

        const existingUser = await User.findOne({ email, role });
        if (existingUser) {
            return { error: "Email already exists for this role" };
        }

        // Save user (password will be hashed automatically in `pre-save`)
        const newUser = new User({ name, email, password, role });
        await newUser.save();

        return { success: true };
    } catch (error) {
        console.error("Signup Error:", error);
        return { error: "An unexpected error occurred" };
    }
}

async function handleLogin(email, password, role) {
    try {
        await ConnectDB();

        // 🔹 Make sure this fetches the full Mongoose document
        const user = await User.findOne({ email, role });

        if (!user) {
            console.log("❌ User not found for email:", email, "and role:", role);
            return { error: "Invalid credentials" };
        }

        console.log("✅ User found:", user);
        console.log("Entered Password:", password);
        console.log("Stored Hashed Password:", user.password);

        // 🔹 Ensure `comparePassword` works
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            console.log("❌ Password does not match!");
            return { error: "Invalid credentials" };
        }

        if (!process.env.JWT_SECRET) {
            console.error("❌ JWT_SECRET is missing in .env file!");
            return { error: "Internal Server Error" };
        }

        // 🔹 Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("✅ Login successful, Token Generated");
        return { success: true, token };
    } catch (error) {
        console.error("Login Error:", error);
        return { error: "An unexpected error occurred" };
    }
}



export async function POST(req) {
    try {
        const { type, name, email, password, role } = await req.json();

        if (!email || !password || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (type === "signup") {
            return NextResponse.json(await handleSignup(name, email, password, role));
        }

        if (type === "login") {
            const response = await handleLogin(email, password, role);
            return NextResponse.json(response, response.token ? { status: 200 } : { status: 400 });
        }

        return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
    } catch (error) {
        console.error("Error in API:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
