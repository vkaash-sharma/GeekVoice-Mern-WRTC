require('dotenv').config();
const express = require('express');
// const bodyParser = require('body-parser');
const app = express();
const DbConnect = require('./database')
app.use(express.json());
const router = require('./routes')
const PORT =process.env.PORT || 5500;
DbConnect();
app.use(router);
app.get('/' ,(req , res)=>{
    res.send('Hello from express Js');
    
})
app.listen(PORT,() =>  console.log(`Listening on port ${PORT}`));