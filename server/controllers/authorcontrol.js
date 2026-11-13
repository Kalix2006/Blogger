import Author from '../models/author.js';

export const getAuthors=async(req,res)=>{
    try{
        let authors=await Author.find().sort({name:1});
        if(authors.length===0){
            authors=await Author.create([{
                name:'Kalimuthu Kumar',
                email:'kalimuthu@blogger.tech',
                bio:'Lead Technology Editor & Cloud Architect',
                avatar:''
            }]);
        }
        res.status(200).json({success:true,data:authors});
    }catch(error){
        res.status(500).json({success:false,message:'Server error'});
    }
};

export const createAuthor=async(req,res)=>{
    try{
        const{name,email,bio,avatar}=req.body;
        if(!name||!email){
            return res.status(400).json({success:false,message:'Name and email are required'});
        }
        const newAuthor=await Author.create({name,email,bio,avatar});
        res.status(201).json({success:true,data:newAuthor});
    }catch(error){
        res.status(400).json({success:false,message:error.message});
    }
};

export const deleteAuthor=async(req,res)=>{
    try{
        const dAuth=await Author.findByIdAndDelete(req.params.id);
        if(!dAuth){
            return res.status(404).json({success:false,message:'Author not found'});
        }
        res.status(200).json({success:true,message:'Author deleted successfully'});
    }catch(error){
        res.status(500).json({success:false,message:'Server error'});
    }
};
