const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const app = express();

app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.use(session({
    secret:"task6secret",
    resave:false,
    saveUninitialized:false
}));

mongoose.connect(
"mongodb://127.0.0.1:27017/task6db"
)
.then(()=>{
    console.log("MongoDB Connected");
})
.catch(err=>{
    console.log(err);
});

app.get("/",(req,res)=>{
    res.redirect("/login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/dashboard",(req,res)=>{

    if(!req.session.user){
        return res.redirect("/login");
    }

    res.render("dashboard",{
        username:req.session.user.username
    });
});
app.post("/register", async (req,res)=>{

    const {username,email,password} = req.body;

    const hashedPassword =
        await bcrypt.hash(password,10);

    const user = new User({
        username,
        email,
        password:hashedPassword
    });

    await user.save();

    res.redirect("/login");
});

app.post("/login", async (req,res)=>{

    const {email,password} = req.body;

    const user =
        await User.findOne({email});

    if(!user){
        return res.send("User not found");
    }

    const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

    if(!isMatch){
        return res.send("Invalid Password");
    }

    req.session.user = user;

    res.redirect("/dashboard");
});

app.get("/logout",(req,res)=>{

    req.session.destroy(()=>{
        res.redirect("/login");
    });

});
app.listen(3000,()=>{
    console.log("Server running on http://localhost:3000");
});