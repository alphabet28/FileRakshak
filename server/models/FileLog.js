const mongoose = require("mongoose");

const FileLogSchema = new mongoose.Schema({
  hash: { type: String, required: true, unique: true },
  ipfsUrl: { type: String, required: true },
  uploader: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FileLog", FileLogSchema);
