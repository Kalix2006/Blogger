import Category from '../models/category.js';

const initCats=[
    "Software Development",
    "Artificial Intelligence & Machine Learning",
    "Web and Mobile App Development",
    "Technology & Innovation",
    "Cybersecurity",
    "Cloud Computing",
    "Industry Insights"
];

export const getCats=async(req,res)=>{
    try{
        let cats=await Category.find().sort({name:1});
        if(cats.length===0){
            const toInsert=initCats.map((name)=>({
                name,
                slug:name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')
            }));
            cats=await Category.insertMany(toInsert);
        }
        res.status(200).json({success:true,data:cats});
    }catch(error){
        res.status(500).json({success:false,message:'Server error'});
    }
};

export const createCat=async(req,res)=>{
    try{
        const{name,descript}=req.body;
        if(!name){
            return res.status(400).json({success:false,message:'Category name is required'});
        }
        const genSlug=name.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
        const newCat=await Category.create({name,descript,slug:genSlug});
        res.status(201).json({success:true,data:newCat});
    }catch(error){
        res.status(400).json({success:false,message:error.message});
    }
};

export const deleteCat=async(req,res)=>{
    try{
        const dCat=await Category.findByIdAndDelete(req.params.id);
        if(!dCat){
            return res.status(404).json({success:false,message:'Category not found'});
        }
        res.status(200).json({success:true,message:'Category deleted successfully'});
    }catch(error){
        res.status(500).json({success:false,message:'Server error'});
    }
};
