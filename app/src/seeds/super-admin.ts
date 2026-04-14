import User from "../models/user.js";
import bcrypt from "bcrypt";
import { ROLES } from "../constants/roles.js";

export const seedSuperAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("✅ Super Admin already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await User.create({
            name: "Super Admin",
            email: adminEmail,
            password: hashedPassword,
            role: ROLES.SUPER_ADMIN,
            status: "active",
        });

        console.log("🔥 Super Admin created successfully");
    } catch (error) {
        console.error("❌ Error seeding admin:", error);
    }
};