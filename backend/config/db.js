const mongoose = require("mongoose")
const DBConnect = async()=>{
    try
    {
           await mongoose.connect(process.env.MONGODB_URL);
           console.log('DB connected');

    }
    catch(error){
         console.error(error.message);
         process.exit(1);
    }
};
module.exports = DBConnect;