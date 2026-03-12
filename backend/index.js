require("dotenv").config()

const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const cors = require("cors")
const path = require("path")
const mongoose = require("mongoose")

const app = express()

app.use(express.json())
app.use(cors())
console.log(process.env.MONGO_URI)

/* ---------------- MongoDB Connection ---------------- */
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
console.log("MongoDB Connected")
})
.catch(err=>{
console.log("MongoDB Error:",err)
})
/* ---------------- Static Frontend ---------------- */

app.use(express.static(path.join(__dirname,"public")))

/* ---------------- Models ---------------- */

const User = require("./models/User")
const Property = require("./models/Property")

/* ---------------- Middleware ---------------- */

function auth(req,res,next){

const token = req.headers.authorization

if(!token){
return res.status(401).json("No token provided")
}

try{

const decoded = jwt.verify(token,process.env.JWT_SECRET)

req.user = decoded

next()

}
catch(err){

res.status(401).json("Invalid token")

}

}

function admin(req,res,next){

if(req.user.role !== "admin"){
return res.status(403).json("Admin only")
}

next()

}

/* ---------------- USER REGISTER ---------------- */

app.post("/register", async(req,res)=>{

try{

const {name,email,password} = req.body

const existing = await User.findOne({email})

if(existing){
return res.json({message:"User already exists"})
}

const hashed = await bcrypt.hash(password,10)

const user = new User({
name,
email,
password:hashed
})

await user.save()

res.json({message:"User registered"})

}
catch(err){

res.status(500).json(err)

}

})

/* ---------------- LOGIN ---------------- */

app.post("/login", async(req,res)=>{

try{

const {email,password} = req.body

const user = await User.findOne({email})

if(!user){
return res.json("User not found")
}

const valid = await bcrypt.compare(password,user.password)

if(!valid){
return res.json("Wrong password")
}

const token = jwt.sign(
{
id:user._id,
role:user.role
},
process.env.JWT_SECRET,
{expiresIn:"1d"}
)

res.json({token})

}
catch(err){

res.status(500).json(err)

}

})

/* ---------------- ADD PROPERTY ---------------- */

app.post("/property", auth, async(req,res)=>{

try{

const property = new Property({
title:req.body.title,
location:req.body.location,
price:req.body.price,
type:req.body.type,
owner:req.user.id,
approved:false
})

await property.save()

res.json(property)

}
catch(err){

res.status(500).json(err)

}

})

/* ---------------- ADMIN APPROVE PROPERTY ---------------- */

app.put("/property/approve/:id", auth, admin, async(req,res)=>{

const property = await Property.findById(req.params.id)

if(!property){
return res.json("Property not found")
}

property.approved = true

await property.save()

res.json(property)

})

/* ---------------- GET PROPERTIES ---------------- */

app.get("/properties", async(req,res)=>{

const {location,price,type} = req.query

let query = {approved:true}

if(location){
query.location = location
}

if(type){
query.type = type
}

let properties = await Property.find(query)

if(price){
properties = properties.filter(p=>p.price <= price)
}

res.json(properties)

})

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
console.log(`Server running on port ${PORT}`)
})