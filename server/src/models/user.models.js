import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: [true, "fullName is required"],
    },
    avatarImage: {
        type: String,
        required: [true, "avatarImage is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        min: [6, "password should be at least 6 characters"],
    },
    todos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Todo",
        },
    ],
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
