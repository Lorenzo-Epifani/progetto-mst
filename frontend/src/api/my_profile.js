import { createSubInstance } from './axios_instance';

const instance = createSubInstance('/my_profile');


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

  export async function more_posts (session_token,page_token) {
    const info={
        headers: {
            'authorization': `Bearer ${session_token}`,
            'page_token':page_token
        }
    }
    
    const list_post = await instance.get('/list_post', info);    
    //const profile_info = await instance.get('/profile_info', info);    
    return list_post
  }

  export async function new_post (session_token, post_data) {
    const info={
        headers: {
            'authorization': `Bearer ${session_token}`,
            'post_data':post_data
        }
    }
    
    const new_post_response = await instance.get('/new_post', info);    
    //const profile_info = await instance.get('/profile_info', info);    
    return new_post_response
  }





