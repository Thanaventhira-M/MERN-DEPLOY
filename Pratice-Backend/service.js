const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(cors());

// Schema
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true }
});

const todoModel = mongoose.model('Todo', todoSchema);

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log(err));

// Routes
app.post('/add', async (req, res) => {
    try {
        const newTodo = new todoModel(req.body);
        await newTodo.save();
        res.status(200).json(newTodo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/getAll", async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/update/:id', async (req, res) => {
    try {
        const updated = await todoModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Todo Not Found" });
        }

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete("/delete/:id", async (req, res) => {
    try {
        await todoModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// IMPORTANT FOR VERCEL
module.exports = app;