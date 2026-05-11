import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://desi:Desi@desideveloperclassroom.eurgfo6.mongodb.net/studentDB&retryWrites=true&w=majority");
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("DB Error:", error);
    process.exit(1);
  }
};

export default connectDB;