const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Chat = require("./models/chat.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');


// Set up view engine and middleware
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Routes
app.get("/chats", async (req, res) => {
    const chats = await Chat.find({});
    res.render("home.ejs", { chats });
});

app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/chats", async (req, res) => {
    try {
        const { from, msg, to } = req.body;
        const newChat = new Chat({
            from,
            msg,
            to,
            created_at: new Date()
        });
        await newChat.save();
        console.log('Chat saved successfully:', newChat);
        res.redirect("/chats");
    } catch (error) {
        console.error('Error saving chat:', error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/chats/:id/edit", async (req, res) => {
    try {
        const { id } = req.params;
        const chat = await Chat.findById(id);
        res.render("edit.ejs", { chat });
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.status(500).send("Internal Server Error");
    }
});

app.put("/chats/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { msg: newMsg } = req.body;
        const updatedChat = await Chat.findByIdAndUpdate(id, { msg: newMsg }, { new: true });
        console.log('Chat updated successfully:', updatedChat);
        res.redirect("/chats");
    } catch (error) {
        console.error('Error updating chat:', error);
        res.status(500).send("Internal Server Error");
    }
});

app.delete("/chats/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Chat.findByIdAndDelete(id);
        console.log('Chat deleted successfully:', id);
        res.redirect("/chats");
    } catch (error) {
        console.error('Error deleting chat:', error);
        res.status(500).send("Internal Server Error");
    }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
