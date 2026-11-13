import axios from 'axios';

const API=axios.create({
    baseURL:'http://localhost:5000/api'
});

API.interceptors.request.use((reqConf)=>{
    const myTok=sessionStorage.getItem('token');
    if(myTok){
        reqConf.headers.Authorization=`Bearer ${myTok}`;
    }
    return reqConf;
});

export const fetchP=async()=>{
    try{
        const res=await API.get('/posts');
        return res.data.data||res.data;
    }catch(error){
        console.error('Error in fetchinng',error);
        throw error;
    }
};

export const fetchPID=async(id)=>{
    try{
        const res=await API.get(`/posts/${id}`);
        return res.data.data||res.data;
    }catch(error){
        console.error(`Error in fetchinng id ${id}`,error);
        throw error;
    }
};

export const loginAdmin=async(cred)=>{
    try{
        const res=await API.post('/auth/login',cred);
        return res.data;
    }catch(error){
        console.error('login failed',error);
        throw error;
    }
};

export const fetchAdminPosts=async()=>{
    try{
        const res=await API.get('/admin/posts');
        return res.data.data||res.data;
    }catch(error){
        console.error('Error in fetching admin posts',error);
        throw error;
    }
};

export const createPost=async(postObj)=>{
    try{
        const res=await API.post('/posts',postObj);
        return res.data.data||res.data;
    }catch(error){
        console.error('Error creating post',error);
        throw error;
    }
};

export const updatePost=async(id,postObj)=>{
    try{
        const res=await API.put(`/posts/${id}`,postObj);
        return res.data.data||res.data;
    }catch(error){
        console.error('Error updating post',error);
        throw error;
    }
};

export const deletePost=async(id)=>{
    try{
        const res=await API.delete(`/posts/${id}`);
        return res.data;
    }catch(error){
        console.error('Error deleting post',error);
        throw error;
    }
};

export default API;
