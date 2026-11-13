import mongoose from "mongoose";

const catschema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    descript:{
        type:String,
        default:''
    },
    slug:{
        type:String,
        unique:true,
        sparse:true,
        lowercase:true,
        trim:true
    }
},
{
    timestamps:true
});

const category=mongoose.model('Category',catschema);
export default category;
