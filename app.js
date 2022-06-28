const express=require('express')

const app=express()
const port=process.env.PORT || 3000

app.get('/',(req,res)=>{
    res.send('welcome in my first graphql project...............')
})

app.listen(port,console.log(`server is running in port ${port}`))