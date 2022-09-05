const mongoose=require('mongoose')

const authorSchema= new mongoose.Schema({
    fname:{
        type: String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    title:{
        type:String,
        enum:[Mr, Mrs, Miss],
        required:true

    }
    ,
    email:{
        type:String,
        unique:true,
        required:true,
         validateEmail : (email) => {
            return String(email)
              .toLowerCase()
              .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              );
          },
          



    },
    password:{
        type: String,
        required:true
    }


},{timestamps:true})

module.exports = mongoose.model('author', authorSchema)





//{ fname: { mandatory}, lname: {mandatory}, title: {mandatory, enum[Mr, Mrs, Miss]}, email: {mandatory, valid email, unique}, password: {mandatory} }