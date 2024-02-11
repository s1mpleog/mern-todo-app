import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import { app } from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`SERVER IS RUNNING AT ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(`ERROR WHILE CONNECTING TO DATABASE`, err?.message);
    });
