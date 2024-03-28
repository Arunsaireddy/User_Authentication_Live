console.log("============ Welcome ======================================>")

import express from 'express'


import MongoStore from 'connect-mongo'

import session from 'express-session'


import isValidUser from './middlewares/validate.js'

import router from './routes/routes.js'

import {} from 'dotenv/config'

const uri = process.env.MONGO_URI

//const uri = "mongodb+srv://arunsaireddy:i9P8Q268GcMzRiMe@cluster.cfee7zy.mongodb.net/G2_DriveTest?retryWrites=true&w=majority";

app.listen(PORT,()=>{   

    console.log(`Server is listening at port ${PORT} !!!!!!!!!!`)
})


const session_store = MongoStore.create({
    mongoUrl : uri ,
    dbName : 'G2_DriveTest',
    collectionName : 'G2_Drivers'
})

const app = express()

app.use(express.urlencoded({extended:true}))

app.use(session({
    secret : 'A secret Key to sign the cookie',
    saveUninitialized : false ,
    resave : false,
    store : session_store
}))




// write this line to use ejs files

app.set('view-engine','ejs')


// wite this line to use public folder for static files

app.use(express.static('public'))

const PORT = process.env.PORT || 8080




app.use('/',router)

export default session