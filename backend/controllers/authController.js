const User = require("../models/User");

// POST /auth/register (user only)
exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "Username already exists" });

    const user = new User({ username, password, role: "user" });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

// POST /auth/login (admin + user)
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password)
      return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({
      userId: user._id,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};
