const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/sketch_db'; // Cambia con il tuo URI MongoDB

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