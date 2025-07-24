const express = require("express");
const multer = require("multer");
const cors = require("cors");
const crypto = require("crypto");
const { create } = require("ipfs-http-client");
const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();


const FileLog = require("./models/FileLog");
const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// IPFS
const ipfs = create({ url: "https://ipfs.infura.io:5001" });

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Mongoose Schema
const FileLogSchema = new mongoose.Schema({
  hash: { type: String, required: true, unique: true },
  ipfsUrl: { type: String, required: true },
  uploader: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
const FileLog = mongoose.model("FileLog", FileLogSchema);

// Utility: Hash file
function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

// Upload Route
app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  const fileBuffer = require("fs").readFileSync(file.path);
  const hash = sha256(fileBuffer);
  const ipfsResult = await ipfs.add(fileBuffer);
  const ipfsUrl = `https://ipfs.infura.io/ipfs/${ipfsResult.path}`;

  // Dummy uploader for now (frontend can send actual one)
  const uploader = req.body.uploader || "Unknown";

  // Save to DB
  const log = new FileLog({ hash, ipfsUrl, uploader });
  await log.save();

  res.json({ hash, ipfsUrl });
});

// View all uploads (optional)
app.get("/logs", async (req, res) => {
  const logs = await FileLog.find().sort({ timestamp: -1 });
  res.json(logs);
});

app.listen(4000, () => console.log("🚀 Server running on http://localhost:4000"));
