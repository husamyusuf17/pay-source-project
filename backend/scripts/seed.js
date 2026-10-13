const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const Supplier = require("../models/Supplier");

dotenv.config();

const users = [
    ["Demo Requester", "requester@demo.com", "REQUESTER", "IT"],
    ["Demo Manager", "manager@demo.com", "MANAGER", "IT"],
    ["Demo Procurement", "procurement@demo.com", "PROCUREMENT", "Procurement"],
    ["Demo Finance", "finance@demo.com", "FINANCE", "Finance"],
    ["Demo Admin", "admin@demo.com", "ADMIN", "Administration"]
];

const run = async () => {
    await connectDB();
    const passwordHash = await bcrypt.hash("Password123!", 12);
    for (const [name, email, role, department] of users) {
        await User.findOneAndUpdate({ email }, { name, email, role, department, passwordHash, active: true }, { upsert: true, new: true });
    }
    await Supplier.deleteMany({ email: { $in: ["alpha@supplier.com", "beta@supplier.com", "gamma@supplier.com"] } });
    await Supplier.insertMany([
        { name: "Alpha Technology", email: "alpha@supplier.com", category: "IT", rating: 4.5 },
        { name: "Beta Business Supplies", email: "beta@supplier.com", category: "IT", rating: 4.2 },
        { name: "Gamma Gulf Trading", email: "gamma@supplier.com", category: "General", rating: 4.7 }
    ]);
    console.log("Seed complete. Demo password for all users: Password123!");
    process.exit(0);
};

run().catch((e) => { console.error(e); process.exit(1); });
