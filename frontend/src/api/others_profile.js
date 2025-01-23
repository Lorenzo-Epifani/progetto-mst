const axios = require('axios');//livello tra front end e db per richiedere e spacchettare i json

const instance = axios.create({
  baseURL: 'http://localhost:3000/others_profile',
  timeout: 4000
});

export async function user_exists (username) {
    const response = await instance.get(`/exists/${username}`);    
    return response
}
 
export async function init_profile (visited_user,session_token) {

    const info = {headers:{}}
    if (session_token){
        info.headers={
            'authorization': `Bearer ${session_token}`,
        }
    }


    //TODO 
    const list_post = await instance.get(`/list_post/${visited_user}`,info);    
    const count_follow = await instance.get(`/count_follow/${visited_user}`,info);   
    const count_post = await instance.get(`/count_post/${visited_user}`,info);    
    const mydata = await instance.get(`/user_info/${visited_user}`,info);    

    const response_data = {
        followers:count_follow.data.followers,
        followed:count_follow.data.followed,
        post_count:count_post.data,
        post_cursor:list_post.data,
        others_image:mydata.data.img,
        others_caption:mydata.data.caption,
        others_name:mydata.data.username,
    }
    return response_data
  }





