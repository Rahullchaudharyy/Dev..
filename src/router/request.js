const express = require('express')
const { UserAuth } = require('../middlewares/AuthMiddleware')
const { User } = require('../models/user.model')
const ConnectionRequest = require('../models/connectionRequest.model')

const requestRouter = express.Router()
requestRouter.post('/request/send/:status/:toIUserId', UserAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toIUserId
        const status = req.params.status

        const ALLOWED_STATUS = ['ignored','interested']

        if (!ALLOWED_STATUS.includes(status)) {
            return res.status(400).json({
                message:"Invalid status type " + status,
            })
        }
        // if (fromUserId == toUserId) {
        //     return res.status(404).json({
        //         message:"You cant sent the request to your self-"
        //     })
        // }
        const toUser = await User.findById(toUserId)
        if (!toUser) {
            return res.status(404).json({
                message:"toUserId is not Found -"
            })
            // throw new Error("toUserId is not Found -")
        }
        const isExistingConnectionRequest = await ConnectionRequest.findOne({
            $or:[{fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })
        if (isExistingConnectionRequest) {
            return res.status(400).json({message:"Request Has been already sent ."});
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
       const data  =  await connectionRequest.save()
       res.json({
        message:req.user.firstName+" is "+status+" in "+ toUser.firstName   ,
        data
       })
    //    res.send(user.firstName + ' Sent the   Conection Request  !! ')
    } catch (error) {
        console.log(error)
        res.status(400).send("Error occure: " + error.message)
    }
})
requestRouter.post('/request/review/:status/:requestId',UserAuth,async (req,res) => {
   try {
     const loggedInUser = req.user;
     console.log(loggedInUser)
     const {status,requestId } = req.params
     console.log(requestId)

     const ALLOWED_STATUS = ['accepted','rejected']

     if (!ALLOWED_STATUS.includes(status)) {
        return res.status(401).json({
            message:"Invalid status type :)"
        })
     }

     const connectionRequest = await ConnectionRequest.findOne({
        // _id:requestId,
        fromUserId:requestId,
        status:'interested',
        toUserId:loggedInUser._id
     })

     if (!connectionRequest) {
        return res.status(401).json({
            message:"Request Id Not found !!"
        })
     }

     connectionRequest.status = status;

     const data = await connectionRequest.save()

     res.status(201).json({
        message:"Request "+status+" Successfully !",
        data
     })
   } catch (error) {
    res.json({
        message:"Error :-"+error.message
    })
   }

})
module.exports = { requestRouter }