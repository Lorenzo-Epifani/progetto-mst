const mongoose = require('mongoose');
const initializeDatabase = require('./init.js');
if (!process.env.MONGO_URI){
    console.log("MONGO URI NOT FOUND!")
}

const DB_INIT = process.env.DB_INIT
const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/sketch_db'

const connectDB = async () => {

    if (DB_INIT==="true"){
        await initializeDatabase(mongoURI)
    }
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Mongo Connection OK');
  } catch (error) {
    console.error('Mongo Connection Error', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;