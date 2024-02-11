import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../services/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    // getting data
    const { username, email, password, fullName } = req.body;
    // validations
    if (
        [username, email, password, fullName].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }
    if (!username || !email || !password || !fullName) {
        throw new ApiError(400, "Invalid Fields");
    }

    if (!email.includes("@")) {
        throw new ApiError(400, "Please enter valid email");
    }
    // check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    // check if user exists
    if (existingUser) {
        throw new ApiError(409, "Email or username already in use");
    }
    // image upload logic
    const localAvatarPath = req.file?.path;

    // validation for image
    if (!localAvatarPath) {
        throw new ApiError(400, "Avatar Image is compulsory");
    }

    // uploading image on Cloudinary
    const avatarImage = await uploadOnCloudinary(localAvatarPath);

    // checking if image upload or not
    if (!avatarImage) {
        throw new ApiError(400, "Avatar image is required");
    }

    // upload user to db
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
        avatarImage: { url: avatarImage.url, publicId: avatarImage.public_id },
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering a user"
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, createdUser, "User registered successfully")
        );
});
export { registerUser };
