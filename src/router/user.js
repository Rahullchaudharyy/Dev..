const express = require('express')
const { UserAuth } = require('../middlewares/AuthMiddleware');
const ConnectionRequest = require('../models/connectionRequest.model');
const { User } = require('../models/user.model');

const userRouter = express.Router()

const USER_SAFE_DATA = "firstName lastName about photourl skills age"
userRouter.get('/user/connections', UserAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;

        const foundConnection = await ConnectionRequest.find({
            $or: [{ toUserId: loggedInUser._id, status: 'accepted' }, { fromUserId: loggedInUser._id, status: 'accepted' }],


        }).populate("fromUserId", USER_SAFE_DATA)

        if (!foundConnection) {
            return res.json({
                message: "connection not found "
            })
        }
        const data = foundConnection.map((data) => data.fromUserId)

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

        const data = foundRequests.map((data) => data.fromUserId)

        res.status(200).json({
            data
        })
    } catch (error) {
        res.status(400).send(error.message)
    }

})

//?page=1&limit=10
userRouter.get('/user/feed', UserAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit
        limit = limit > 20 ? 10 : limit;



        const RequestSentRecieve = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        })


        const HideUser = new Set()
        RequestSentRecieve.forEach((req) => {
            HideUser.add(req.fromUserId.toString())
            HideUser.add(req.toUserId.toString())
        })

        const user = await User.find({
            $and: [{ _id: { $nin: Array.from(HideUser) } },
            { _id: { $ne: loggedInUser._id } }]
        }).select("firstName lastName").skip(skip).limit(limit)
        res.send(user)
    } catch (error) {
        console.log(error.message)

        res.status(200).send(error.message)
    }
})

module.exports = {
    userRouter
}