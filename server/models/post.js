import mongoose from "mongoose";

const pschema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    descript:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    },
    featured:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        required:true,
        enum:['draft','published'],
        default:'draft'
    }},
    {
    timestamps:true
    }
);

const post=mongoose.model('Post',pschema);
export default post;
