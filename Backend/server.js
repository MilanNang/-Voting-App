const express=require('express');
const app=express();
require('dotenv').config();
const db=require('./DataBase/db');
const cors = require('cors');


app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

const bodyparser=require('body-parser');
app.use(bodyparser.json());
const PORT=process.env.PORT ||3000;


const userRoutes=require('./routes/userRoutes');
const candidateRoutes=require('./routes/candidateRoutes');


app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})