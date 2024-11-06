const express = require('express')
const {AdminAuth, UserAuth} = require('./middlewares/AuthMiddleware.js')
const app = express()

// '/us?er' =>  /user will work and /uer will also work , after the s? there is question mark means if there is a ? mark after the alphabet that means withouth that letter the route will work .

app.use(express.json())
app.use('/admin', AdminAuth)

app.get('/admin/getAllData', (req, res) => {
    res.send('Here is your secret data 😅😂')

})
app.get('/admin/DeleteUser', (req, res) => {
    res.send('User Deleted')
})
app.get('/user',UserAuth, (req, res) => {
    res.send('user data sent !')

})

app.listen(3000, () => {
    console.log('Server is successfully listening on http://localhost:3000')
})

