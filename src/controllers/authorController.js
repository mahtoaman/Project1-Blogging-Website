const authorModel=require('../models/authorModel')


const createAuthor= async function(req,res){
    let data=req.body;
    let savedata= await authorModel.create(data)
    res.send({msg:savedata,status:true})

}

module.exports.createAuthor=createAuthor