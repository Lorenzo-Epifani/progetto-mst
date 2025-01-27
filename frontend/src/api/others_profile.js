import { createSubInstance } from './axios_instance';

const instance = createSubInstance('/others_profile');

export async function user_exists (username) {
    const response = await instance.get(`/exists/${username}`);    
    return response
}

export async function init_profile (session_token,visited_user) {
    
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

export async function more_posts (session_token, page_token, visited_user) {
    const info={
        headers: {
            'authorization': `Bearer ${session_token}`,
            'page_token':page_token
        }
    }
    
    
    const list_post = await instance.get(`/list_post/${visited_user}`, info);    
    //const profile_info = await instance.get('/profile_info', info);    
    
    return list_post
}

export async function exist (visited_user) {

    const exist = await instance.get(`/exist/${visited_user}`);    
    return exist.data
}

export async function follow_unfollow (session_token, whoami, visited_user) {
    const info={
        headers: {
            'authorization': `Bearer ${session_token}`
        }
    }
    const follow_response = await instance.get(`/click_follow_to/${visited_user}/0`,info);    
    
    return follow_response.data
}

export async function follow_check (session_token, whoami, visited_user) {
    const info={
        headers: {
            'authorization': `Bearer ${session_token}`
        }
    }

    const follow_response = await instance.get(`/click_follow_to/${visited_user}/check`,info);    

    return follow_response.data
}





