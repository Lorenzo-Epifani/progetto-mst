const mongoose = require('mongoose');

if (!process.env.MONGO_URI){
    console.log("MONGO URI NOT FOUND!")
}
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/sketch_db';
const connectDB = async () => {
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