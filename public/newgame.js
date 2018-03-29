var socket;
var px1 = 400;
var py1 = 400;
var px2 = 400;
var py2 = 500;

var ex1 = 400;
var ey1 = 400;
var ex2 = 400;
var ey2 = 500;

var left = false;
var right = false;
var down = true;
var up = false;

var game = false;
function setup(){
    createCanvas(800,800);
    socket = io.connect("http://localhost:3000");
    player = new Player(px1,py1,px2,py2);
    enemy = new Player(ex1,ey1,ex2,ey2);
    socket.on('enemycoord',function(data){
        enemy.x1 = data.x1;
        enemy.y1 = data.y1;
        enemy.x2 = data.x2;
        enemy.y2 = data.y2;
    });
    
    socket.on('ballcoord',function(data){
            ball = new Ball(data.x,data.y);
            ball.xspeed = data.xspeed;
            ball.yspeed = data.yspeed;
            game = true;
            ball.x = data.x;
            ball.y = data.y;
            ball.xspeed = data.xspeed;
            ball.yspeed = data.yspeed;
        
    });
}

function keyPressed(){
    if(key == ' '){
        if(game == false){
            ball = new Ball(400,200);
            game = true;
        }
    }
}

function draw(){
    background(51);
    player.show();
    enemy.show();
    socket.emit('playercoord',{
        x1: player.x1,
        y1: player.y1,
        x2: player.x2,
        y2: player.y2
    });
    if(game){
        socket.emit('ballcoord',{
            x: ball.x,
            y: ball.y,
            xspeed: ball.xspeed,
            yspeed: ball.yspeed
        });
    }
    if(game){
        ball.show();
        ball.check_wall();
        ball.checkstick();
    }
    
}

function Ball(x,y){
    this.x = x;
    this.y = y;
    
    this.xspeed = random(-5,5);
    this.yspeed = random(-5,5);
    
    this.show = function(){
        ellipse(this.x,this.y,40,40);
    }
    
    this.check_wall = function(){
        if(this.x > width){
            this.x -= 5;
            this.xspeed *= -1;
        }else if(this.y < 0){
            this.y += 5;
            this.yspeed *= -1;
        }else if(this.x < 0){
            this.x += 5;
            this.xspeed *= -1;
        }else if(this.y > height){
            this.y -= 5;
            this.yspeed *= -1;
        }else{
            this.x += this.xspeed;
            this.y += this.yspeed;
        }
    }
    
    this.checkstick = function(){
        if(down && this.x == player.x1 && this.y <= player.y1 && this.y >= player.y2){
            player.change();
            this.xspeed *= -1;
            console.log("hehe");
        }
        if(up && this.x == player.x1 && this.y <= player.y2 && this.y >= player.y1){
            player.change();
            this.xspeed *= -1;
            console.log("hehe");
        }
        if(left && this.y == player.y1 && this.x <= player.x1 && this.x >= player.x2){
            player.change();
            this.yspeed *= -1;
            console.log("hehe");
        }
        if(right && this.y == player.y1 && this.x <= player.x2 && this.x >= player.x1){
            player.change();
            this.yspeed *= -1;
            console.log("hehe");
        }
    }
}

function mouseDragged(){
    player.x1 = mouseX;
    player.y1 = mouseY;
    if(left){
        player.x2 = player.x1 - 100;
        player.y2 = player.y1;
    }else if(up){
        player.x2 = player.x1;
        player.y2 = player.y1 - 100;
    }else if(right){
        player.x2 = player.x1 + 100;
        player.y2 = player.y1;
    }else{
        player.x2 = player.x1;
        player.y2 = player.y1 + 100;
    }
}

function Player(x1,y1,x2,y2){
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    
    this.show = function(){
        line(this.x1,this.y1,this.x2,this.y2);
        strokeWeight(5);
    }
    
    this.change = function(){
        if(y1 > y2){
            var t = random(0,100);
            if(t > 50){
                this.x2 = this.x1 + 100;
                this.y2 = this.y1;
                right = true;
                left = false;
                up = false;
                down = false;
            }else{
                this.x2 = this.x1 - 100;
                this.y2 = this.y1;
                right = false;
                left = true;
                up = false;
                down = false;
            }
        }else if(x2 > x1){
            var t = random(0,100);
            if(t > 50){
                this.x2 = this.x1;
                this.y2 = this.y1 - 100;
                right = false;
                left = false;
                up = false;
                down = true;
            }else{
                this.x2 = this.x1;
                this.y2 = this.y1 + 100;
                right = false;
                left = false;
                up = true;
                down = false;
            }
        }else if(y1 < y2){
            var t = random(0,100);
            if(t > 50){
                this.x2 = this.x1 + 100;
                this.y2 = this.y1;
                right = true;
                left = false;
                up = false;
                down = false;
            }else{
                this.x2 = this.x1 - 100;
                this.y2 = this.y1;
                right = false;
                left = true;
                up = false;
                down = false;
            }
        }else if(x2 < x1){
            var t = random(0,100);
            if(t > 50){
                this.x2 = this.x1;
                this.y2 = this.y1 - 100;
                right = false;
                left = false;
                up = false;
                down = true;
            }else{
                this.x2 = this.x1;
                this.y2 = this.y1 + 100;
                right = false;
                left = false;
                up = true;
                down = false;
            }
        }
    }
}


