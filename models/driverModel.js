import mongoose from 'mongoose'
import {} from 'dotenv/config'

const uri = process.env.MONGO_URI;
//const uri = "mongodb+srv://arunsaireddy:i9P8Q268GcMzRiMe@cluster.cfee7zy.mongodb.net/G2_DriveTest?retryWrites=true&w=majority";



mongoose.connect(uri).then(()=> console.log("*********************connnected to Mongodb !!! *************************")).catch((err)=> {console.log(`connection failed due to the error below. \n ${err}`)})


const driverSchema = mongoose.Schema({
    firstName: {type:String,required:true},
    lastName: {type:String,required:true},
    licenseNo: {type:String,required:true},
    age: {type:Number,required:true},
    username: {type: String, required: true},
    password: {type:String,required:true},
    userType: {type:String,required:true},

    car_details: {
    make: {type:String,required:true},
    model: {type:String,required:true},
    year: {type:Number,required:true},
    platno: {type:String,required:true},
    }
    })

const driverModel = mongoose.model('G2_Driver',driverSchema)





export default driverModel