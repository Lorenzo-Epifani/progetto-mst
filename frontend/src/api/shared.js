import { createSubInstance } from './axios_instance';

const instance = createSubInstance('/shared');


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




