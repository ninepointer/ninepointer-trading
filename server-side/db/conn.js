const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({path: "./config.env"});

const DB = "mongodb+srv://vvv201214:5VPljkBBPd4Kg9bJ@cluster0.j7ieec6.mongodb.net/admin-data?retryWrites=true&w=majority"
// const DB = process.env.DATABASE;

mongoose.connect(DB, {
    useNewUrlParser: true,
    
    useUnifiedTopology: true
    
}).then(()=>{
    console.log("connection secure");
}).catch((err)=>{
    console.log("no connection");
})