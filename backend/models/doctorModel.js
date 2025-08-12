const mongoose=require('mongoose')


const doctorSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        unique:true
    },
    phone:{
        type:String,
        unique:true

    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    speciality:{
        type:String,
        required:true
    },

    degree:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    about:{
        type:String,
        required:true
    },

    fees:{
        type:Number,
        required:true
    },
    available: {
        type: Boolean,
        default: true
      },
      
  

    address:{
        type:Object,
        required:true
    },

    data:{
        type:Number,
        // required:true
    },

    slots_booked:{
        type:Object,
        default:{}
    },


   
},{minimize:false})


const doctorModel=mongoose.model('Doctor',doctorSchema)

module.exports=doctorModel