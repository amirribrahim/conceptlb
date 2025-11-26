const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User"); // CommonJS import

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const createAdmin = async () => {
    const email = "ahmed.ibrahim@conceptlb.com"; // your admin email
    const password = "Concept123#Design"; // your password

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminExists = await User.findOne({ email });
    if (adminExists) {
        console.log("Admin already exists");
        process.exit();
    }

    await User.create({
        email,
        password: hashedPassword,
        role: "admin"
    });

    console.log("Admin user created successfully");
    process.exit();
};

createAdmin();

