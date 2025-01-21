//importa modulo express
const express = require('express');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const _mime = require('mime'); // Installa con `npm install mime`
const cors = require('cors');

const connectDB = require('./db/connection.js');
const mime = new _mime.Mime()
const PORT = 3000;
connectDB();
const app = express(); 

const loginRoutes = require('./router/login.js'); // Importa il file della rotta

const homeRoutes = require('./router/home.js'); // Importa il file della rotta


const profileRoutes = require('./router/profile.js'); // Importa il file della rotta



app.use(express.json());
app.use(cors());  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//const AuthController = require('./auth/authcontroller.js');
//app.use('/auth', AuthController);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

async function getBase64(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const base64String = data.toString('base64');
                const mimeType = mime.getType(filePath); // Ottieni il MIME type
                const dataUrl = `data:${mimeType};base64,${base64String}`;
                resolve(dataUrl);
            }
        });
    });
}

app.use('/profile', profileRoutes);
app.use('/auth', loginRoutes);
app.use('/home', homeRoutes);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});