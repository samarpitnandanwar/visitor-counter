// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// MongoDB URI
const mongoURI = "mongodb+srv://visitors:visitors@visitors.rs3k7.mongodb.net/?retryWrites=true&w=majority&appName=visitors";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define the schema and model
const visitorSchema = new mongoose.Schema({
  count: Number,
});

const Visitor = mongoose.model("Visitor", visitorSchema);

// API endpoint to get visitor count
app.get("/api/visitor", async (req, res) => {
  try {
    let visitor = await Visitor.findOne();
    if (!visitor) {
      visitor = new Visitor({ count: 0 });
      await visitor.save();
    }
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API endpoint to increment visitor count
app.post("/api/visitor/increment", async (req, res) => {
  try {
    let visitor = await Visitor.findOne();
    if (!visitor) {
      visitor = new Visitor({ count: 1 });
    } else {
      visitor.count += 1;
    }
    await visitor.save();
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
