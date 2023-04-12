const userModel = require('../model/userModel')
const multer=require('multer')

const calculateAge=(date)=>{
   // Example date of birth: April 11, 1990
const birthDate = new Date(date);

// Get the current date
const currentDate = new Date();

// Calculate the difference in milliseconds between the two dates
const diffMs = currentDate - birthDate;

// Convert the difference to years
const age = Math.floor(diffMs / 31557600000); // 31557600000 = number of milliseconds in a year

return age; // Output: 33 (if current date is April 11, 2023)
}




const fs = require('fs');

// buffer data of image/pdf

const uploadFile =async(file,fileName)=>{ // your buffer data here;

let fileType=file.mimetype.split("/")[1]
let bufferData=file.buffer


let path=(`src/data/${fileType=="pdf"?"pdf":"image"}/${fileName}.${fileType}`)

// create a new file and write buffer data to it

await fs.writeFile(path, bufferData, (err) => {
  if (err) throw err;
  console.log('File created and saved successfully!');


})}




const createUser = async (req, res) => {

    try {
        let data = req.body
        let files=req.files
        
        console.log(req.files);
        if (Object.keys(data) == 0) return res.status(400).send({ status: false, msg: "enter some data in the body" })
         
        let { firstName, lastName, email, dateOfBirth, resident } = data

          
         
         const residentialAddress={
            street1:data["residentialAddress.street1"],
            street2:data["residentialAddress.street2"]
         }


         const permanentAddress= !resident?{
            street1:data["permanentAddress.street1"],
            street2:data["permanentAddress.street2"]
         }:residentialAddress

        if (!firstName) return res.status(400).send({ status: false, msg: 'enter firstName' })

        if (!lastName) return res.status(400).send({ status: false, msg: 'enter lastName' })

        if (!email) return res.status(400).send({ status: false, msg: 'enter emailId' })

        let checkEmail = await userModel.findOne({ email: email })

        if (checkEmail) return res.status(400).send({ status: false, msg: 'this email id is already registered with another user' })

        if (!dateOfBirth) return res.status(400).send({ status: false, msg: 'enter your dateOfBirth' })

        let ageCheck=calculateAge(dateOfBirth)
        if(ageCheck<18)return res.status(400).send({status:false,msg:'you are not 18+'})

        if (!residentialAddress.street1) return res.status(400).send({ status: false, msg: 'enter your street1' })

        if (!residentialAddress.street2) return res.status(400).send({ status: false, msg: 'enter your street2' })


        if (!permanentAddress.street1) return res.status(400).send({ status: false, msg: 'enter your street1' })

        if (!permanentAddress.street2) return res.status(400).send({ status: false, msg: 'enter your street2' })
        if(req.files&&req.files.length<2)return res.status(400).send({status:false,msg:"minimum two documents are required"})
       


       
        for(let i=0;i<files.length;i++){
            let fileType=files[i].mimetype.split("/")[1]

         if(data[`file${i+1}.fileType`]=="pdf"&&fileType!="pdf")return res.status(400).send({status:false,msg:`file type of ${data[`file${i+1}.fileName`]} is not correct`})
         
         else if(data[`file${i+1}.fileType`]=="image" && !["jpeg","png","jpg"].includes(fileType)){
            return res.status(400).send({status:false,msg:`file type of ${data[`file${i+1}.fileName`]} is not correct`})
         }
         
            await uploadFile(files[i],data[`file${i+1}.fileName`])

        }



     


        let createdData = await userModel.create(data)

        return res.status(201).send({ status: true, msg: 'candidate data', data: createdData })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }

}


module.exports = { createUser }








