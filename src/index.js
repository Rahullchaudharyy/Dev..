const express = require('express');
const { ConectDB } = require('./config/database.js');
const { User } = require('./models/user.model.js');
const validator = require('validator')
const cookieParser = require('cookie-parser');
const { authRouter } = require('./router/auth.js');
const { profileRouter } = require('./router/profile.js');
const { requestRouter } = require('./router/request.js');
const { userRouter } = require('./router/user.js');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors')
const app = express();
const dotenv = require('dotenv');
const { Message } = require('./models/Message.model.js');
const { areUsersConnected } = require('./middlewares/AreUserConnected.js');
dotenv.config();


const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:'http://localhost:5173',
        credentials:true,
        methods:['GET','POST']
    }
});


// io.on("connection", (socket) => {

//     console.log("User Connected")
//     console.log("User : ", socket.id)
//     // socket.emit("Wellcome", `Wellcome to the real time server${socket.id}`)
//     socket.on('message',({room,message})=>{
//         console.log(message)
//         io.to(room).emit('recive-message',message)
//     })
//     socket.on('disconnect',()=>{
//         console.log(`User disconnected ${socket.id}`);
//     })

// })
// io.on("connection", (socket) => {
//     console.log("User Connected:", socket.id);

//     socket.on('message', async ({ sender, recipient, text }) => {
//         try {
//             // Save the message to the database
//             const Areconnected = await areUsersConnected(sender,recipient)
//             if(!Areconnected) return;
//             const message = await Message.create({ sender, recipient, text });

//             // Emit the message back to the recipient
//             io.to(recipient).emit('receive-message', {
//                 sender,
//                 recipient,
//                 text,
//                 timestamp: message.timestamp
//             });
//         } catch (error) {
//             console.error("Error saving message:", error.message);
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log(`User disconnected: ${socket.id}`);
//     });
// });

io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // Listen for the user joining with their userId
    socket.on("join", (userId) => {
        socket.join(userId); // Join a room named after the user's _id
        console.log(`User ${userId} joined room: ${userId}`);
    });


    // Handle incoming messages
    socket.on('message', async ({ sender, recipient, text }) => {
        try {
            // Save the message to the database
            const Areconnected = await areUsersConnected(sender, recipient);
            if (!Areconnected) return;

            const message = await Message.create({ sender, recipient, text });

            // Emit the message to the recipient's room
            io.to(recipient).emit('receive-message', {
                sender,
                recipient,
                text,
                timestamp: message.timestamp
            });

            // Optionally emit the message back to the sender for confirmation
            socket.emit('message-sent', {
                sender,
                recipient,
                text,
                timestamp: message.timestamp
            });
        } catch (error) {
            console.error("Error saving message:", error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});



ConectDB().then(() => {
    server.listen(3000, () => {
        console.log('Server is successfully listening on http://localhost:3000');
    });
}).catch((error) => {
    console.log('Error:', error.message);
});

app.use(cors({
    origin: 'http://localhost:5173',  // Specify the frontend's origin
    credentials: true,  // Allow credentials
}));


app.use(express.json());
app.use(cookieParser())

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)

