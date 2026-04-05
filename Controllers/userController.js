const User = require("../models/User");

// Create User
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

   res.status(201).json({
  message: "User created",
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update User (role / status)
exports.updateUser = async (req, res) => {
  try {
    if (!req.body) {
  return res.status(400).json({ message: "No data provided" });
}
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // store in cookie
    res.cookie("userId", user._id, {
      httpOnly: true
    });

    res.json({
      message: "Login successful",
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie("userId");
  res.json({ message: "Logged out successfully" });
};

// Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};