const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const fieUpload = require('express-fileupload');
//const request = require("request");
var bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");

app.use(express.static("public"));

var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json());

app.use(fileUpload());

app.set("view engine", "ejs");
//! Connection to MonogoDB;
mongoose.connect("mongodb+srv://hGame:hgame123@cluster0.vozcd.gcp.mongodb.net/HGames?retryWrites=true&w=majority",{
    useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true,
   useFindAndModify: false
}, (error)=>{   
    if(error){
        console.log(error);
    }else{
        console.log("mongoose Started at 103.83.22.149/32");
    }
});
//! Mongoose
var gameSchema = new mongoose.Schema({
    title: String,
    creator: String,
    width: Number,
    height: Number,
    fileName: String,
    thumbnailFile: String
});
//! Using Schema to create Document Model..
var Game = mongoose.model("Game",gameSchema);
//! using this Document to create object of thus model..
// Game.create({
//     title: "The King's League Odyssy",
//      creator: "light_bringer777",
//      width: 640,
//      height: 480, 
//      fileName: "game3.swf",
//      thumbnailFile: "TKLG.jpg"
// },(error, data)=>{
//     if(error){
//         console.log("An error Occured!");
//         console.log(error);
//     }else{
//         console.log("Data Added to the Collection!");
//         console.log(data);
//     }
// });
//! Retreiving data from mongodb to the console.
// Game.find({},(error, data)=>{
//     if(error){
//         console.log("An error Occured!");
//         console.log(error);
//     }else{
//         console.log("Data Added to the Collection!");
//         console.log(data);
//     }
// });
//! Local Database
// const gameArray = [
//     {title: "The King's League Odyssy",
//      creator: "light_bringer777",
//      width: 640,
//      height: 480, 
//      fileName: "game3.swf",
//      thumbnailFile: "TKLG.jpg"
//     },
//     {title: "Learn To Fly 2",
//      creator: "light_bringer777",
//      width: 640,
//      height: 480, 
//      fileName: "learnToFly2.swf",
//      thumbnailFile: "ltf2.jpg"
//     },
//     {title: "Epic Battle Fantasy 4",
//      creator: "kupo707",
//      width: 700,
//      height: 500, 
//      fileName: "ebf4.swf",
//      thumbnailFile: "ebf4.jpg"
//     },
//     {title: "Epic War 3",
//      creator: "rudy_sudarto",
//      width: 700,
//      height: 525, 
//      fileName: "ew3.swf",
//      thumbnailFile: "ew3.gif"
//     },
//     {title: "Platform Racing 2",
//      creator: "kupo707",
//      width: 400,
//      height: 550, 
//      fileName: "pfr2.swf",
//      thumbnailFile: "pfr2.jpg"
//     },
//     {title: "Run 3",
//      creator: "player_03",
//      width: 800,
//      height: 600, 
//      fileName: "run3.swf",
//      thumbnailFile: "run3.jpg"
//     }
// ]

app.get("/game/:id", (req,res)=>{
    var id = req.params.id;
    Game.findById(id,(error,foundedGame)=>{
        if(error){
            console.log("Error While Retreiving game from db");
        }else{
            res.render("game",{
                title: foundedGame.title,
                creator: foundedGame.creator,
                width: foundedGame.width,
                height: foundedGame.height,
                fileName: foundedGame.file
            });
        }
    });
    
});
app.get("/game/edit/:id", (req,res)=>{
    var id = req.params.id;

    Game.findById(id,(error,foundedGame)=>{
        if(error){
            console.log("Error While Retreiving game from db to edit page!");
        }else{
            res.render("edit",{
                title: foundedGame.title,
                creator: foundedGame.creator,
                width: foundedGame.width,
                height: foundedGame.height,
                id:id
            });
        }
    });
});
app.post("/update/:id", (req,res)=>{
    var id = req.params.id;

    Game.findByIdAndUpdate(id, {
        title: req.body.title,
        creator: req.body.creator,
        width: req.body.width,
        height: req.body.height
    }, (error,updatedGame)=>{
        if(error){
            console.log("Error While Updating Game ");
            console.log(error);
        }else{
            res.redirect("/gamesList");
            console.log("Game Updated!"+ updatedGame);
        }
    });
});
app.get("/game/delete/:id", (req,res)=>{
    var id = req.params.id;

    Game.findByIdAndDelete(id,(error)=>{
        if(error){
            console.log("Error while Deleting Game!");
            console.log(error);
        }else{
            console.log("Game Deleted from database!"+ id);
            res.redirect("/gamesList");
        }
    });
});
app.get("/gamesList", (req,res)=>{
    Game.find({}, (error,gameArray)=>{
        if(error){
            console.log("Error Retreiving data from mongoose");
            console.log(error);
        }else{
            res.render("gameList", {
                gameList: gameArray
            });
        }
    });
});
app.post('/addGame', urlencodedParser, function (req, res) {
    var data = req.body;
    var gameFile = req.files.file;
    var imageFile = req.files.thumb;


    gameFile.mv("public/games/"+ gameFile.name, (error)=>{
        if(error){
            console.log("Error uploading Game file!");
            console.log(error);
        }else{
            console.log("Game File Upload success!");
        }
    });
    imageFile.mv("public/games/thumbnails/"+ imageFile.name, (error)=>{
        if(error){
            console.log("error while uploading thumbnail File");
            console.log(error);
        }else{
            console.log("Thumb File Upload success !");
        }
    });
    Game.create({
        title: data.title,
        creator: data.creator,
        width: data.width,
        height: data.height,
        fileName: gameFile.name,
        thumbnailFile: imageFile.name
    },(error,data)=>{
        if(error){
            console.log(error);
        }else{
            console.log(data);
        }
    });
    res.redirect('/gamesList');
  });

  app.get("/addGame", (req,res)=>{
    res.render("addGame.ejs");
});
app.use("/", router);
// request("https://api.unsplash.com/photos?client_id=esrdXcyXAkeF7-dwwDK1m_ecyNZOnstrbLvuUkrF0p8&page4", function(error, response, body){
//     if(error){
//         console.log(error);
//     }else{
//         var data = JSON.parse(body);
//         console.log(data);
//     }
// });


// app.get("/pics/:page",(req,res)=>{
//     var pageNumber = req.params.page;
//     request("https://api.unsplash.com/photos?client_id=esrdXcyXAkeF7-dwwDK1m_ecyNZOnstrbLvuUkrF0p8&page=" + pageNumber, function(error, response, body){
//         if(error){
//             console.log(error);
//         }else{
//             res.render("pictures",{
//                 picData: JSON.parse(body)
//             });
//         }
//     });
// });
app.get("/pics",(req,res)=>{
    // res.render("pictures");
    var searchTerm = req.query.searchTerm;
    request("https://api.unsplash.com/search/photos?client_id=esrdXcyXAkeF7-dwwDK1m_ecyNZOnstrbLvuUkrF0p8&query=" + searchTerm, function(error, response, body){
        if(error){
            console.log(error);
        }else{
            res.render("pictures",{
                picData: JSON.parse(body)
            });
        }
    });
});

app.get("/search", (req,res)=>{
    res.render("search");
})
app.get("/", (req,res)=>{
    res.render("homepage");
});


app.listen("3000", function(){
    console.log("Server Started at Port 3000");
});