const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const verifyToken = require("./middleware/verifyToken.js");

const app = express();
app.use(cors());
app.use(express.json());


app.listen(5000, () => {

    console.log('Server has been started on port 5000');

});


mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to Database'));



app.post('/register', async (req, res, next) => {


    try {

        const { username, password } = req.body;

        if (!username || !password) {
            throw new Error('Please Fulfill all Fields.');
        }

        let foundExistingUser;

        foundExistingUser = await User.findOne({ username });

        if (foundExistingUser) {
            throw new Error('User Already Exists!');
        }


        let newUser;

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);


        newUser = await new User({
            username,
            password: hashedPassword
        });


        await newUser.save();


        return res.status(201).json({ newUser });




    } catch (err) {
        return res.status(400).json({ message: err.message });
    }


});

app.post("/login", async (req, res, next) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {
            throw new Error('Please fulfill all fields')
        }

        let userExists;

        userExists = await User.findOne({ username });

        if (!userExists) {
            throw new Error('An account does not exist with that username');
        }

        let isMatch = await bcrypt.compare(password, userExists.password);


        if (!isMatch) {
            throw new Error('Incorrect Username or Password');
        }

        const token = jwt.sign({ id: userExists._id }, 'secret123', { expiresIn: '3d' });


        return res.status(201).json({ username: userExists.username, token});


    } catch (err) {
        return res.status(400).json({ message: err.message });
    }


});

app.get("/getUsername", verifyToken, async (req, res, next) => {

    try {

        const username = req.user.username;

        res.send(username);

    } catch (err) {
        return res.status(400).json({ message: err.message });
    }


});



