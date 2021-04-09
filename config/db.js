const mongoose = require('mongoose');


const mongoAtlasUri = process.env.MONGO_URI;
const connectdb = async()=>{
    try {
        // Connect to the MongoDB cluster
         mongoose.connect(
          mongoAtlasUri,
          { useNewUrlParser: true, useUnifiedTopology: true },
          () => console.log(`Mongoose is connected ${mongoose.connection.host}`)
        );
    
      } catch (e) {
        console.log("could not connect");
      }
}

module.exports = connectdb;