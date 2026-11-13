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

export const fetchP=async(cat)=>{
    try{
        const url=cat && cat!=='All' ? `/posts?category=${encodeURIComponent(cat)}` : '/posts';
        const res=await API.get(url);
        return res.data.data||res.data;
    }catch(error){
        console.error('Error in fetchinng',error);
        throw error;
    }
};

export const fetchPID=async(idOrSlug)=>{
    try{
        const res=await API.get(`/posts/${idOrSlug}`);
        return res.data.data||res.data;
    }catch(error){
        console.error(`Error in fetchinng id ${idOrSlug}`,error);
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

export const fetchCats=async()=>{
    try{
        const res=await API.get('/categories');
        return res.data.data||res.data;
    }catch(error){
        console.error('Error fetching categories',error);
        throw error;
    }
};

export const createCat=async(catObj)=>{
    try{
        const res=await API.post('/categories',catObj);
        return res.data.data||res.data;
    }catch(error){
        console.error('Error creating category',error);
        throw error;
    }
};

export const deleteCat=async(id)=>{
    try{
        const res=await API.delete(`/categories/${id}`);
        return res.data;
    }catch(error){
        console.error('Error deleting category',error);
        throw error;
    }
};

export const fetchAuthors=async()=>{
    try{
        const res=await API.get('/authors');
        return res.data.data||res.data;
    }catch(error){
        console.error('Error fetching authors',error);
        throw error;
    }
};

export const createAuthor=async(authObj)=>{
    try{
        const res=await API.post('/authors',authObj);
        return res.data.data||res.data;
    }catch(error){
        console.error('Error creating author',error);
        throw error;
    }
};

export const deleteAuthor=async(id)=>{
    try{
        const res=await API.delete(`/authors/${id}`);
        return res.data;
    }catch(error){
        console.error('Error deleting author',error);
        throw error;
    }
};

export const uploadImage=async(file)=>{
    try{
        const formData=new FormData();
        formData.append('image',file);
        const res=await API.post('/upload',formData,{
            headers:{'Content-Type':'multipart/form-data'}
        });
        return res.data;
    }catch(error){
        console.error('Error uploading image',error);
        throw error;
    }
};

export default API;
