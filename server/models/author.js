import mongoose from "mongoose";

const authschema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    bio:{
        type:String,
        default:''
    },
    avatar:{
        type:String,
        default:''
    }
},
{
    timestamps:true
});

const author=mongoose.model('Author',authschema);
export default author;
