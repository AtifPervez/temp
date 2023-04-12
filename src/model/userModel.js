const mongoose=require('mongoose')

const userSchema=new mongoose.Schema(
    {
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    dateOfBirth:{
        type: Date,
        required: true
     
    },
    residentialAddress:{
        street1:{
            type:String,
            required:true

        },
        street2:{
            type:String,
            required:true

        },
    },
    permanentAddress:{
        street1:{
            type:String,
            required:true

        },
        street2:{
            type:String,
            required:true

        }
    },

    


   
        
        

},{timestamps:true})





module.exports=mongoose.model('user',userSchema)