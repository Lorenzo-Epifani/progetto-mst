import { createSubInstance } from './axios_instance';

const instance = createSubInstance('/post');


export async function init_post (session_token,post_id) {
    const info={
        headers: {
            'authorization': `Bearer ${session_token}`,
            'post_id':post_id
        }
    }

    const response = await instance.get('/init', info);   
    return response.data
  }


