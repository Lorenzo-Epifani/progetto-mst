const axios = require('axios');//livello tra front end e db per richiedere e spacchettare i json

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 4000
});



export async function getAllPhotos () {
  const response = await instance.get('/foto')
  //console.log(response.data)
  return response.data
}

export async function getUserByID(id) {
  const response = await instance.get('/utente/' + id)
  console.log(response.data[0])
  return response.data[0]
}

export async function getPhotoUrlByID(id) {
    const response = await instance.get('/getimg/' + id)
    //console.log(response.data)
    return response.data
  }

export async function getLikes(idFoto) {
  const response = await instance.get('/like/' + idFoto)
  //console.log(response.data)
  return response.data
}





