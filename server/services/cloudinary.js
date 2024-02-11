import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localPath) => {
    try {
        const response = await cloudinary.uploader.upload(localPath, {
            resource_type: "auto",
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        });
        return response;
    } catch (error) {
        console.error("ERROR WHILE UPLOADING ON CLOUDINARY", error);
        fs.unlink(localPath);
        return null;
    }
};

export { uploadOnCloudinary };
