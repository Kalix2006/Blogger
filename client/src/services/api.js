import axios from 'axios';

const API=axios.create({
    baseURL:'http://localhost:5000/api'
});

export const fetchP=async()=>{
    try{
        const response=await API.get('/posts');
        return response.data;
    }
    catch(error){
        console.error('Error in fetchinng',error);
        throw error;
    }
};

export const fetchPID=async(id)=>{
    try{
        const response=await API.get(`/posts/${id}`);
        return response.data;
    }
    catch(error){
        console.error(`Error in fetchinng id ${id}`,error);
        throw error;
    }
};

export default API;