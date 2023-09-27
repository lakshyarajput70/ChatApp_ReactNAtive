const mongoose = require('mongoose')

const connectDB = async()=>{
    try {
        const conn = await mongoose.connect('mongodb+srv://lakshyarajput70:lakshya104@cluster0.q6mgrzf.mongodb.net/',{
            useUnifiedTopoLogy:true,
            useNewUrlParser:true,
        });
        console.log(`MongoDB Connceted : ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error : ${error.message}`);
        process.exit();
    }
}

module.exports = connectDB ;