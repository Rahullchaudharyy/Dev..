const express = require('express')
const { UserAuth } = require('../middlewares/AuthMiddleware');
const ConnectionRequest = require('../models/connectionRequest.model');

const userRouter = express.Router()

const USER_SAFE_DATA = "firstName lastName about photourl skills age"
userRouter.get('/user/connections', UserAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;

        const foundConnection = await ConnectionRequest.find({
            $or: [{ toUserId: loggedInUser._id, status: 'accepted' }, { fromUserId: loggedInUser._id, status: 'accepted' }],


        }).populate("fromUserId",USER_SAFE_DATA)

        if (!foundConnection) {
            return res.json({
                message: "connection not found "
            })
        }
        const data = foundConnection.map((data)=> data.fromUserId)

        res.status(200).json({
            data
        })
    } catch (error) {
        res.status(400).send(error.message)
    }

})

userRouter.get('/user/requests/recieved', UserAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;

        const foundRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'intrested'
        }).populate("fromUserId", USER_SAFE_DATA)

        if (!foundRequests) {
            return res.json({
                message: "Requests not found "
            })
        }

        const data = foundRequests.map((data)=> data.fromUserId)

        res.status(200).json({
            data
        })
    } catch (error) {
        res.status(400).send(error.message)
    }

})

// userRouter.get('/user/feed',async (req,res) => {
//     try {
//         const loggedInUser = req.user;

//         const RequestSentRecieve = await ConnectionRequest.find({
//             $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]
//         }).select("firstName lastName")

//         console.log(RequestSentRecieve)
//         res.send(RequestSentRecieve)
//     } catch (error) {
//         res.status(200).send(error.message)
//     }
// })

module.exports = {
    userRouter
}