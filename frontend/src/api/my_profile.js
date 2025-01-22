const axios = require('axios');//livello tra front end e db per richiedere e spacchettare i json

const instance = axios.create({
  baseURL: 'http://localhost:3000/my_profile',
  timeout: 4000
});


export async function init_me (session_token) {
    const info={
        headers: {
            'authorization': `Bearer ${session_token}`,
        }
    }
    
    const count_follow = await instance.get('/count_follow', info);    
    const count_post = await instance.get('/count_post', info);    
    const list_post = await instance.get('/list_post', info);    
    const mydata = await instance.get('/user_info', info);    
    //const profile_info = await instance.get('/profile_info', info);    

    const response_data = {
        followers:count_follow.data.followers,
        followed:count_follow.data.followed,
        post_count:count_post.data,
        post_cursor:list_post.data,
        my_image:mydata.data.img,
        my_caption:mydata.data.caption,
        my_name:mydata.data.username,
    }
    return response_data
  }





