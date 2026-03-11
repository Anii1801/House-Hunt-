require("dotenv").config()
const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 5000

/* ---------------- Mock Database ---------------- */

let users = []
let properties = []
let bookings = []

/* ---------------- Middleware ---------------- */

function auth(req,res,next){

    const token = req.headers.authorization

    if(!token){
        return res.status(401).json("No token provided")
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET || "secret")
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

    const {name,email,password} = req.body

    const hashed = await bcrypt.hash(password,10)

    const user = {
        id: Date.now(),
        name,
        email,
        password: hashed,
        role: "user"
    }

    users.push(user)

    res.json({message:"User registered"})
})

/* ---------------- LOGIN ---------------- */

app.post("/login", async(req,res)=>{

    const {email,password} = req.body

    const user = users.find(u=>u.email===email)

    if(!user){
        return res.json("User not found")
    }

    const valid = await bcrypt.compare(password,user.password)

    if(!valid){
        return res.json("Wrong password")
    }

    const token = jwt.sign(
        {id:user.id,role:user.role},
        process.env.JWT_SECRET || "secret",
        {expiresIn:"1d"}
    )

    res.json({token})
})

/* ---------------- ADD PROPERTY ---------------- */

app.post("/property", auth, (req,res)=>{

    const property = {
        id: Date.now(),
        ...req.body,
        owner: req.user.id,
        approved:false
    }

    properties.push(property)

    res.json(property)
})

/* ---------------- ADMIN APPROVE PROPERTY ---------------- */

app.put("/property/approve/:id", auth, admin, (req,res)=>{

    const property = properties.find(p=>p.id == req.params.id)

    if(property){
        property.approved = true
        res.json(property)
    }
    else{
        res.json("Property not found")
    }
})

/* ---------------- GET PROPERTIES ---------------- */

app.get("/properties", (req,res)=>{

    const {location,price,type} = req.query

    let result = properties.filter(p=>p.approved)

    if(location){
        result = result.filter(p=>p.location===location)
    }

    if(price){
        result = result.filter(p=>p.price <= price)
    }

    if(type){
        result = result.filter(p=>p.type === type)
    }

    res.json(result)
})

/* ---------------- BOOK PROPERTY ---------------- */

app.post("/booking", auth, (req,res)=>{

    const booking = {
        id: Date.now(),
        user:req.user.id,
        property:req.body.propertyId,
        date:new Date()
    }

    bookings.push(booking)

    res.json(booking)
})

/* ---------------- USER BOOKINGS ---------------- */

app.get("/bookings", auth, (req,res)=>{

    const userBookings = bookings.filter(b=>b.user === req.user.id)

    res.json(userBookings)
})

/* ---------------- SERVER ---------------- */

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})