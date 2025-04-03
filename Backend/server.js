const express=require('express');
const app=express();
require('dotenv').config();
const db=require('./DataBase/db');
const cors = require('cors');

const PORT=process.env.PORT ||3000;

app.use(cors({
    origin: "https://voting-app-eight-eta.vercel.app",
    methods: ["GET,POST,PUT,DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const bodyparser=require('body-parser');
app.use(bodyparser.json());




const userRoutes=require('./routes/userRoutes');
const candidateRoutes=require('./routes/candidateRoutes');


app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
