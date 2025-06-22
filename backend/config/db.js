const mongoose = require("mongoose")

const DBConnect = async()=>{
    try
    {
           console.log('Attempting to connect to database...');
           console.log('MongoDB URL:', process.env.MONGODB_URL ? 'Set' : 'Not set');
           
           if (!process.env.MONGODB_URL) {
               throw new Error('MONGODB_URL environment variable is not set');
           }
           
           await mongoose.connect(process.env.MONGODB_URL);
           console.log('DB connected successfully');

    }
    catch(error){
         console.error('Database connection error:', error.message);
         console.error('Full error:', error);
         process.exit(1);
    }
};

module.exports = DBConnect;