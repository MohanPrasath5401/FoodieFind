const mongoose = require("mongoose");
const User = require("./models/User");

// use your actual connection string from .env

const MONGO_URI = "mongodb+srv://root:12345@foodiefind.znxwkra.mongodb.net/Foodiefind?retryWrites=true&w=majority";



async function seed() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Check if user already exists
    const existingUser = await User.findOne({ email: "admin@example.com" });
    if (existingUser) {
      console.log("⚠️ Admin user already exists. Skipping insert.");
    } else {
      const user = new User({
        name: "Admin User",
        email: "admin@example.com",
        password: "password123", // will be auto-hashed by pre('save')
        role: "admin",
        university: "Test University",
        address: "123 Admin Street"
      });

      await user.save();
      console.log("🎉 Admin user created successfully");
    }

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding user:", err);
    mongoose.connection.close();
  }
}

seed();
