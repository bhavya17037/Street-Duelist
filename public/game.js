var socket;

var playerX = 300;
var playerY = 300;

var enemyX = 300;
var enemyY = 300;

var player_score = 0;
var enemy_score = 0;

var playerName;
var enemyName;

var a1;
var a2;

var num = 0;

var pbullets = {};
var ebullets = {};

var bg;
var c;

var gameOver = false;
var right = false;
var left = false;
var down = false;
var up = false;
var factor = 2;

function setup(){
    createCanvas(600,600);
    bg = loadImage('bg.png');
    YourScore = createDiv('Your Score: ' + player_score);
    EnemyScore = createDiv("Enemy's Score: " + enemy_score);
    YourScore.position(30,40);
    EnemyScore.position(500,40);
    YourScore.style('color','white');
    EnemyScore.style('color','red');
    frameRate(20);
    
    socket = io.connect('http://localhost:8000');
    
    socket.on('enemy_pos',function(data){
        enemyX = data.x;
        enemyY = data.y;
    });
    
    
    socket.on('enemy_score',function(score){
        enemy_score = score;
    });
    
    socket.on('bullet_info',function(B){
        ebullets = B;
    });
    
    playerName = createDiv("YOU");
    enemyName = createDiv("ENEMY");
    
    playerName.position(playerX,playerY - 30);
    enemyName.position(enemyX,enemyY - 30);
    playerName.style('color','white');
    enemyName.style('color','red');
    
}

function draw(){
    background(bg);
    YourScore.remove();
    EnemyScore.remove();
    
    YourScore = createDiv('Your Score: ' + player_score);
    EnemyScore = createDiv("Enemy's Score: " + enemy_score);
    YourScore.position(30,40);
    EnemyScore.position(500,40);
    YourScore.style('color','white');
    EnemyScore.style('color','red');
    
    a1 = 300;
    a2 = 300;

    socket.emit('player_score',player_score);
    ellipse(playerX,playerY,30,30);
    c = color(255, 204, 0);
    fill(c);
    noStroke();
    ellipse(enemyX,enemyY,30,30);
    for(var r in pbullets){
        c = color(0, 0, 0);
        fill(c);
        noStroke();
        ellipse(pbullets[r].xpos,pbullets[r].ypos,10,10);
    }
    
    for(var r in ebullets){
        ellipse(ebullets[r].xpos,ebullets[r].ypos,10,10);
    }
    
    playerName.position(playerX,playerY - 30);
    enemyName.position(enemyX,enemyY - 30);
    
    if(playerX > 600){
        playerX = 0;
    }else if(playerX < 0){
        playerX = 600;
    }
    
    if(playerY < 0){
        playerY = 600;
    }else if(playerY > 600){
        playerY = 0;
    }
    
    check_collision();
    update_bullet_pos();
    send_player_pos();
    send_bullet_pos();
    
    if(right){
        playerX += 10;
    }
    if(left){
        playerX -= 10;
    }
    
    if(down){
        playerY += 10;
    }
    
    if(up){
        playerY -= 10;
    }
    
    if(player_score >= 15){
        gameOver = true;
        win = createDiv("YAY YOU WIN :D");
        win.position(width/2,height/2 - 200);
        win.style('colour','green');
    }
}

function send_bullet_pos(){
    socket.emit('bullet_info',pbullets);
}

function check_collision(){
    for(var p in pbullets){
        if(pbullets[p].tag == 0){
            var d = sqrt((pbullets[p].xpos - enemyX)*(pbullets[p].xpos - enemyX) + (pbullets[p].ypos - enemyY)*(pbullets[p].ypos - enemyY));
            if(d <= 25){
                delete pbullets[p];
                player_score += 1;
            }
        }
    }
    
    for(var p in pbullets){
        if(pbullets[p].xpos < 0 || pbullets[p].xpos > 600 || pbullets[p].ypos < 0 || pbullets[p].ypos > 600){
            delete pbullets[p];
        }
    }
    
    
}



function send_player_pos(){
    var D = {
        x: playerX,
        y: playerY
    };
    socket.emit('player_info',D);
}

function update_bullet_pos(){
    for(var r in pbullets){
        pbullets[r].xpos += (pbullets[r].destX - pbullets[r].startposx) / factor;
        pbullets[r].ypos += (pbullets[r].destY - pbullets[r].startposy) / factor;
    }
}

function mousePressed(){
    num += 1;
    var d0 = sqrt((playerX - enemyX)*(playerX - enemyX) + (playerY - enemyY)*(playerY - enemyY));
    var du = sqrt((mouseX - playerX)*(mouseX - playerX) + (mouseY - playerY)*(mouseY - playerY));
    
    if(d0 - 60 < du){
        factor = 4;
    }else{
        factor = 2;
    }
    
    pbullets[num] = {
        xpos: playerX,
        ypos: playerY,
        destX: mouseX,
        destY: mouseY,
        startposx: playerX,
        startposy: playerY,
        tag: 0
    };
}

function keyReleased(){
    if(keyCode == UP_ARROW){
        up = false;
    }
    
    if(keyCode == DOWN_ARROW){
        down = false;
    }
    
    if(keyCode == LEFT_ARROW){
        left = false;
    }
    
    if(keyCode == RIGHT_ARROW){
        right = false;
    }
}

function keyPressed(){
    if(keyIsDown(UP_ARROW)){
        up = true;
    }
    
    if(keyIsDown(DOWN_ARROW)){
        down = true;
    }
    
    if(keyIsDown(RIGHT_ARROW)){
        right = true;
    }
    
    if(keyIsDown(LEFT_ARROW)){
        left = true;
    }
}