var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var helpers = require('express-helpers');
var io = require('socket.io').listen(server);

var currentuser = "";

server.listen(8000);

io.sockets.on('connection',function(socket){
    var score = 0;
     socket.on('player_score',function(score){
        socket.broadcast.emit('enemy_score',score);
    });
    
    socket.on('bullet_info',function(b_info){
        for(var U in b_info){
            b_info[U].tag = 1;
        }
        socket.broadcast.emit('bullet_info',b_info);
    });
    
    socket.on('player_info',function(D){
        score = D;
        socket.broadcast.emit('enemy_pos',D);
    });
    
    socket.on('disconnect',function(){
        user.find({username: currentuser},function(err,docs){
            if(err){
                throw err;
            }else{
                docs[0].stats += score;
                user.update(function(e){
                    if(e){
                        throw e;
                    }else{
                        console.log('Score updated');
                    }
                });
            }
        });
        
    });
});


helpers(app);


app.use("/css",express.static(__dirname + '/public'));
app.use(express.static('public'));

app.set('view engine','ejs');
app.use(bodyparser.json());

var urlencodedparser = bodyparser.urlencoded({extended: false});
mongoose.connect('mongodb://localhost/hackdb');

var schema = mongoose.Schema;
var userschema = new schema({
    username: String,
    password: String,
    country: String,
    stats: Number
});

var user = mongoose.model('USER',userschema);

app.get('/home',function(req,res){
    res.render('home.ejs');
});

app.post('/signup',urlencodedparser,function(req,res){
    var USERNAME = req.body.username;
    console.log(USERNAME);
    var PASS = req.body.password;
    var COUNT = req.body.country;
    
    user.find({username: USERNAME},function(err,docs){
        if(err){
            throw err;
        }else{
            if(docs.length != 0){
                res.json({
                    exists: true
                });
            }else{
                var newuser = new user({
                    username: USERNAME,
                    password: PASS,
                    country: COUNT,
                    stats: 0
                });
                
                newuser.save(function(er){
                    if(er){
                        throw er;
                        currentuser = "";
                    }else{
                        console.log("User " + USERNAME + " stored successfully!");
                        currentuser = USERNAME;
                    }
                });
                
                return res.redirect('/userhome');
            }
        }
    });
});

app.post('/login',urlencodedparser,function(req,res){
    var USERNAME = req.body.username;
    console.log(USERNAME);
    var PASS = req.body.password;
    
    user.find({username: USERNAME,password: PASS},function(err,docs){
        if(err){
            throw err;
        }else{
            if(docs.length == 0){
                currentuser = "";
                res.json({
                    exists: false
                });
            }else{
                console.log("User " + USERNAME + " signed in successfully!");
                currentuser = USERNAME;
                return res.redirect('/userhome');
            }
        }
    });
});


app.get("/gameplay",function(req,res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/userhome',function(req,res){
    console.log(currentuser);
    user.find({username: currentuser},function(err,docs){
        if(err){
            throw err;
        }else{
            res.render('menu.ejs');
        }
    });
});


app.listen(5000, "0.0.0.0");
