import mongoose from "mongoose";

const uschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'admin',
    }},
    {
    timestamps:true
    }
);

const user=mongoose.model('User',uschema);
export default user;