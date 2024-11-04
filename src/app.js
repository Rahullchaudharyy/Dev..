const express = require('express')

const app = express()

app.use("/test",(req,res)=>{
    res.send('Hello from the server')
})
app.use("/greet",(req,res)=>{
    res.send('helo ...' )
})



app.listen(3000,()=>{
    console.log('Server is successfully listening on http://localhost:3000')
})

