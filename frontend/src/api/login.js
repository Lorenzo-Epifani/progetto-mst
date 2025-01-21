const axios = require('axios');//livello tra front end e db per richiedere e spacchettare i json

const instance = axios.create({
  baseURL: 'http://localhost:3000/auth',
  timeout: 4000
});


export async function login (user,psw) {
    const response = await instance.get('/login', {
        headers: {
            'user': user,
            'psw': psw
        }
    });    //console.log(response.data)
    return response
  }





