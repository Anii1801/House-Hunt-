const API="https://house-hunt-kz2d.onrender.com"

let token=localStorage.getItem("token") || ""

async function register(){

const res=await fetch(API+"/register",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
name:rname.value,
email:remail.value,
password:rpass.value
})

})

alert("Registered Successfully")
window.location="login.html"
}


async function login(){

const res=await fetch(API+"/login",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
email:lemail.value,
password:lpass.value
})

})

const data=await res.json()

localStorage.setItem("token",data.token)

alert("Login Successful")

window.location="index.html"

}


async function addProperty(){

const token=localStorage.getItem("token")

const res=await fetch(API+"/property",{

method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":token
},

body:JSON.stringify({
title:title.value,
location:location.value,
price:price.value,
type:type.value
})

})

alert("Property Added")

}


async function getProperties(){

const res=await fetch(API+"/properties")

const data=await res.json()

const container=document.getElementById("properties")

container.innerHTML=""

data.forEach(p=>{

const div=document.createElement("div")

div.className="property"

div.innerHTML=`
<h3>${p.title}</h3>
<p>📍 ${p.location}</p>
<p>💰 ${p.price}</p>
<p>${p.type}</p>
`

container.appendChild(div)

})

}