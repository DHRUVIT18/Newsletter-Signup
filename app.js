const express =require("express");
const bodyParser=require("body-parser");
const request = require("request"); 
const mailchimp =require("@mailchimp/mailchimp_marketing");

const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
   res.sendFile(__dirname+"/signup.html");
});

mailchimp.setConfig({
    apiKey:"f0a2ec094a40e49e5b935502366edb9e-us14",
    server:"us14"
});


app.post("/",function(req,res){
    const firstname = req.body.FirstName;
    const lastname = req.body.LastName;
    const em = req.body.email;
    const listId = "353dc25d12"
    
    const subscribingUser = {
        firstName:firstname,
        lastName:lastname,
        email:em
    };
    
    async function run(){
        const response = await mailchimp.lists.addListMember(listId,{
            email_address:subscribingUser.email,
            status:"subscribed",
            merge_fields:{
                FNAME:subscribingUser.firstName,
                LNAME:subscribingUser.lastName
            }
        });
        res.sendFile(__dirname+"/success.html")
        console.log("successfully added contact as an audience member");
    }

run().catch(e=> res.sendFile(__dirname+"/failure.html"));

});

app.post("/failure",function(req,res){
    res.redirect("/");
});



app.listen(process.env.PORT || 3000,function(){
    console.log("all right boss , listening on port 3000");
});


//api key
//	f0a2ec094a40e49e5b935502366edb9e-us14
//list id
//353dc25d12