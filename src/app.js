const express = require('express');
const { ConectDB } = require('./config/database.js');
const { User } = require('./models/user.model.js');
const validator = require('validator')
const app = express();
app.use(express.json());

app.post('/signup', async (req, res) => {
    const userCredential = req.body;
    const isEmailCorrect = validator.isEmail(userCredential.emailId)
    console.log(isEmailCorrect)
    if (!isEmailCorrect) {
        return res.status(401).send("Email is not valid ")
    }
    const user = new User(userCredential);

    try {
        await user.save();
        res.send('User created successfully');
    } catch (error) {
        res.status(401).send(error.message);
    }
});

app.get('/user', async (req, res) => {
    try {
        const userEmail = req.query.emailId; // Use req.query for GET requests
        const user = await User.findOne({ emailId: userEmail });
        res.send(user || 'User not found');
    } catch (error) {
        res.status(500).send('Something went wrong');
    }
});

app.get('/feed', async (req, res) => {
    try {
        const userData = await User.find({});
        console.log('Users found:', userData);
        res.send(userData);
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

app.delete('/user', async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (user) {
            res.send('User deleted successfully!');
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong!');
    }
});

app.put('/user', async (req, res) => {
    const userEmail = req.body.emailId;
    const data = req.body;
    try {
        const user = await User.findOneAndUpdate({ emailId: userEmail }, data, { new: true, runValidators: true });
        if (user) {
            res.send(`User updated successfully! New Data: ${JSON.stringify(user)}`);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

app.patch('/user/:userId', async (req, res) => {
    // const { _id,...data } = req.body;
    const data = req.body ;
    const _id = req.params.userId


    const ALLOWED_UPDATE = ['photourl', 'about', 'skills'];
    const isAllowedUpdate = Object.keys(data).every((key) => ALLOWED_UPDATE.includes(key));

    if (!isAllowedUpdate) {
        return res.status(401).send("Can't update this specified fields");
    } else if (data?.skills?.length > 10 ){
       return  res.status(401).send("length exceeded of skill")
    }

    try {
        const user = await User.findByIdAndUpdate(_id, data, { new: true, runValidators: true });
        if (user) {
            res.send(`User updated successfully! New Data: ${JSON.stringify(user)}`);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong!');
    }
});

ConectDB().then(() => {
    console.log("MongoDB connected successfully");
    app.listen(3000, () => {
        console.log('Server is successfully listening on http://localhost:3000');
    });
}).catch((error) => {
    console.log('Error:', error.message);
});
