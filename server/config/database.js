import mongoose from "mongoose";
async function dbConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB connected successfully");
  } catch (error) {
    console.error("❌ Error connecting DB", error);
    process.exit(1);
  }
}

export default dbConnection;
