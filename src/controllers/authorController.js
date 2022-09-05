const authorModel=require('../models/authorModel')
const validator = require('../validator/validation')

const createAuthor= async function(req,res){
    try {
    let data=req.body
    console.log(data.email) 
    let verifyEmail = validator.isValidEmail(data.email)
    console.log(verifyEmail) 
    if (verifyEmail) return res.status(400).send({ status: false, msg: "Enter a valid E-Mail" })
    let savedata= await authorModel.create(data)
    res.status(201).send({msg:savedata,status:true})

}
catch (error) {
          res.status(400).send({ status: false, message: error.message })
     }
}


module.exports.createAuthor=createAuthor