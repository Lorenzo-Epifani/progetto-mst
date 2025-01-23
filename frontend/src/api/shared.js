const axios = require('axios');//livello tra front end e db per richiedere e spacchettare i json

const instance = axios.create({
  baseURL: 'http://localhost:3000/shared',
  timeout: 4000
});


export async function whoami (session_token) {
    const info={
        headers: {
            'authorization': `Bearer ${session_token}`,
        }
    }

    const response = await instance.get('/whoami', info);   
    return response
  }


  export async function search_user (search_string) {
    const info={
        headers: {
            'search_string': search_string,
        }
    }
    const response = await instance.get('/search', info);   
    return response
  }




