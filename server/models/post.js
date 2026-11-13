import mongoose from "mongoose";

const pschema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    slug:{
        type:String,
        unique:true,
        sparse:true,
        lowercase:true,
        trim:true
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
    tags:{
        type:[String],
        default:[]
    },
    author:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:''
    },
    featured:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        required:true,
        enum:['draft','published','scheduled'],
        default:'draft'
    },
    scheduledAt:{
        type:Date
    },
    seoTitle:{
        type:String,
        default:''
    },
    metaDesc:{
        type:String,
        default:''
    }
},
{
    timestamps:true
});

const post=mongoose.model('Post',pschema);
export default post;
