import { createSubInstance } from './axios_instance';
const instance = createSubInstance('/auth');




export async function login (user,psw) {
    const response = await instance.get('/login', {
        headers: {
            'user': user,
            'psw': psw
        }
    });    
    return response
  }





