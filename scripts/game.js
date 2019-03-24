let canvas = document.getElementById("id-canvas");
let context = canvas.getContext("2d");
let highs = [0,0,0,0,0];
if(localStorage.getItem("asteroids.highs")){
  highs = localStorage.getItem("asteroids.highs").split(',');
}

function startGame(){
  document.getElementById("startGame").classList.add("inactive");
  document.getElementById("highScores").classList.add("inactive");
  document.getElementById("controls").classList.add("inactive");
  document.getElementById("credits").classList.add("inactive");
  document.getElementById("score").classList.remove("inactive");
  MyGame.main = (function (systems, input, renderer, graphics) {
      'use strict';
      let laserAudio = new Audio('../assets/laser.wav');
      let score = 0;
      let level = 1;
      let lives = 3;
      let hyperspace = 0;

      let paused = false;
      let gameOver = false;
      let gameOverScreen = false;
      let lastTimeStamp = performance.now();
      let myKeyboard = input.Keyboard();

      let ufos = systems.UFOs();
      let asteroids = systems.Asteroids();
      let ship = systems.Ship();
      let particlesFire = systems.ParticleSystem();
      let particlesSmoke = systems.ParticleSystem();
      let fireRenderer = renderer(particlesFire, graphics,
          'assets/fire.png');
      let smokeRenderer = renderer(particlesSmoke, graphics,
          'assets/smoke-2.png');
      let asteroidRenderer = renderer(asteroids, graphics,
          'assets/asteroid.png');
      let ufoRenderer = renderer(ufos, graphics,
          'assets/ufo.png');
      let shipRenderer = renderer(ship, graphics,
          'assets/ship.png');
      let laserRenderer = renderer(ship, graphics,
          'assets/laser.png');
      let ufoLaserRenderer = renderer(ufos, graphics,
          'assets/ufobullet.png');

      function processInput(elapsedTime) {
          myKeyboard.update(elapsedTime);
      }

      function update(elapsedTime) {
          computeStatusString();
          particlesFire.update(elapsedTime);
          particlesSmoke.update(elapsedTime);
          if(!gameOver){
            ufos.laserUpdate(elapsedTime);
            ship.laserUpdate(elapsedTime);
            asteroids.update(elapsedTime);
            ufos.update(elapsedTime);
            laserAsteroidCollisionDetection();
            asteroidShipCollisionDetection();
            ufoLaserShipCollisionDetection();
            ufoShipCollisionDetection();
            laserUfoCollisionDetection();
            if(hyperspace<=0){
              hyperspace=0;
            }else{
              hyperspace -=elapsedTime;
            }
          }
      }


      function render() {
          graphics.clear();
          if(!gameOver){
            smokeRenderer.render();
            fireRenderer.render();
            ufoRenderer.render();
            asteroidRenderer.render();
            laserRenderer.laserRender();
            ufoLaserRenderer.laserRender();
            shipRenderer.render();
          } else {
              context.fillStyle = "greenyellow";
              context.font = "25px Courier New";
              context.fillText("game over", 20, 200);
              context.fillText("you scored " + score, 40, 250);
              if (score >= highs[4]){
                context.fillText("you got a high score!", 40, 300);
                highs[4]=score;
              }
              for(let i in highs){
                highs[i] = parseInt(highs[i]);
              }
              highs.sort(sortNumber);
              localStorage.setItem("asteroids.highs", highs);
              document.getElementById("startGame").classList.remove("inactive");
              document.getElementById("highScores").classList.remove("inactive");
              document.getElementById("controls").classList.remove("inactive");
              document.getElementById("credits").classList.remove("inactive");
              document.getElementById("score").classList.add("inactive");
          }
      }

      function gameLoop(time) {
          let elapsedTime = (time - lastTimeStamp);
          processInput(elapsedTime);
          lastTimeStamp = time;
          if (!paused){
            update(elapsedTime);
            render();
          } else {
              context.clearRect(0, 0, canvas.width, canvas.height);
              context.fillStyle = "greenyellow";
              context.font = "25px Courier New";
              context.fillText("game pause", 20, 200);
              context.fillText("press escape to quit", 40, 250);
              context.fillText("press space to continue", 40, 300);
          }
          if (!gameOver){
            requestAnimationFrame(gameLoop);
          }
      }

      function asteroidShipCollisionDetection(){
        let shipW = ship.ship.size.x *.65;
        let shipH = ship.ship.size.y *.65;
        let shipX = ship.ship.center.x - shipW/2;
        let shipY = ship.ship.center.y - shipH/2;
        Object.getOwnPropertyNames(asteroids.objects).forEach(function (asteroid) {
          let asteroidW = asteroids.objects[asteroid].size.x *.65;
          let asteroidH = asteroids.objects[asteroid].size.y *.65;
          let asteroidX = asteroids.objects[asteroid].center.x - asteroidW/2;
          let asteroidY = asteroids.objects[asteroid].center.y - asteroidH/2;

          if(shipX + shipW >= asteroidX && shipX <= asteroidX + asteroidW &&
            shipY + shipH >= asteroidY && shipY <= asteroidY + asteroidH){
              let explosion = new Audio('../assets/explosion.wav');
              explosion.play();
              if(lives==1){
                gameOver = true;
              }else{
                for(let i = 0; i < 150; i++){
                  particlesFire.create(ship.ship.center.x, ship.ship.center.y);
                  particlesSmoke.create(ship.ship.center.x, ship.ship.center.y);
                }
                lives--;
                ship.ship.center=findSafeLocation();
              }
              return;
          }
        });
      }

      function ufoShipCollisionDetection(){
        let shipW = ship.ship.size.x *.65;
        let shipH = ship.ship.size.y *.65;
        let shipX = ship.ship.center.x - shipW/2;
        let shipY = ship.ship.center.y - shipH/2;
        Object.getOwnPropertyNames(ufos.objects).forEach(function (ufo) {
          let ufoW = ufos.objects[ufo].size.x *.65;
          let ufoH = ufos.objects[ufo].size.y *.65;
          let ufoX = ufos.objects[ufo].center.x - ufoW/2;
          let ufoY = ufos.objects[ufo].center.y - ufoH/2;
          if(shipX + shipW >= ufoX && shipX <= ufoX + ufoW &&
            shipY + shipH >= ufoY && shipY <= ufoY + ufoH){
              let explosion = new Audio('../assets/explosion.wav');
              explosion.play();
              if(lives==1){
                gameOver = true;
              }else{
                for(let i = 0; i < 150; i++){
                  particlesFire.create(ship.ship.center.x, ship.ship.center.y);
                  particlesSmoke.create(ship.ship.center.x, ship.ship.center.y);
                }
                lives--;
                ship.ship.center=findSafeLocation();
              }
              return;
          }
        });
      }

      function laserAsteroidCollisionDetection(){
        Object.getOwnPropertyNames(asteroids.objects).forEach(function (asteroid) {
          let asteroidW = asteroids.objects[asteroid].size.x *.65;
          let asteroidH = asteroids.objects[asteroid].size.y *.65;
          let asteroidX = asteroids.objects[asteroid].center.x - asteroidW/2;
          let asteroidY = asteroids.objects[asteroid].center.y - asteroidH/2;
          Object.getOwnPropertyNames(ship.lasers).forEach(function (laser) {
            let laserW = ship.lasers[laser].size.x;
            let laserH = ship.lasers[laser].size.y;
            let laserX = ship.lasers[laser].center.x - laserW/2;
            let laserY = ship.lasers[laser].center.y - laserH/2;
            if(laserX + laserW >= asteroidX && laserX <= asteroidX + asteroidW &&
              laserY + laserH >= asteroidY && laserY <= asteroidY + asteroidH){
                let explosion = new Audio('../assets/explosion.wav');
                explosion.play();
                delete ship.lasers[laser];
                if(asteroids.objects[asteroid].size.x==80){
                  score++;
                } else if(asteroids.objects[asteroid].size.x==60){
                  score += 2;
                } else if(asteroids.objects[asteroid].size.x==40){
                  score += 3;
                }
                level = parseInt(score/50) + 1;
                for(let i = 0; i < 150; i++){
                  particlesFire.create(asteroids.objects[asteroid].center.x, asteroids.objects[asteroid].center.y);
                  particlesSmoke.create(asteroids.objects[asteroid].center.x, asteroids.objects[asteroid].center.y);
                }
                if(asteroids.objects[asteroid].size.x>=60){
                    let num = asteroids.objects[asteroid].size.x==60 ? 2 : 4;
                    asteroids.split(num, asteroids.objects[asteroid].center);
                }
                delete asteroids.objects[asteroid];
                return;
            }
          });
        });
      }

      function laserUfoCollisionDetection(){
        Object.getOwnPropertyNames(ufos.objects).forEach(function (ufo) {
          let ufoW = ufos.objects[ufo].size.x *.65;
          let ufoH = ufos.objects[ufo].size.y *.65;
          let ufoX = ufos.objects[ufo].center.x - ufoW/2;
          let ufoY = ufos.objects[ufo].center.y - ufoH/2;
          Object.getOwnPropertyNames(ship.lasers).forEach(function (laser) {
            let laserW = ship.lasers[laser].size.x;
            let laserH = ship.lasers[laser].size.y;
            let laserX = ship.lasers[laser].center.x - laserW/2;
            let laserY = ship.lasers[laser].center.y - laserH/2;
            if(laserX + laserW >= ufoX && laserX <= ufoX + ufoW &&
              laserY + laserH >= ufoY && laserY <= ufoY + ufoH){
                let explosion = new Audio('../assets/explosion.wav');
                explosion.play();
                delete ship.lasers[laser];
                score += 5;
                for(let i = 0; i < 150; i++){
                  particlesFire.create(ufos.objects[ufo].center.x, ufos.objects[ufo].center.y);
                  particlesSmoke.create(ufos.objects[ufo].center.x, ufos.objects[ufo].center.y);
                }
                delete ufos.objects[ufo];
                return;
            }
          });
        });
      }

      function ufoLaserShipCollisionDetection(){
        let shipW = ship.ship.size.x * .65;
        let shipH = ship.ship.size.y * .65;
        let shipX = ship.ship.center.x - shipW/2;
        let shipY = ship.ship.center.y - shipH/2;
        Object.getOwnPropertyNames(ufos.lasers).forEach(function (laser) {
          let laserW = ufos.lasers[laser].size.x;
          let laserH = ufos.lasers[laser].size.y;
          let laserX = ufos.lasers[laser].center.x - laserW/2;
          let laserY = ufos.lasers[laser].center.y - laserH/2;
          if(laserX + laserW >= shipX && laserX <= shipX + shipW &&
            laserY + laserH >= shipY && laserY <= shipY + shipH){
              let explosion = new Audio('../assets/explosion.wav');
              explosion.play();
              if(lives==1){
                gameOver = true;
              }else{
                for(let i = 0; i < 150; i++){
                  particlesFire.create(ship.ship.center.x, ship.ship.center.y);
                  particlesSmoke.create(ship.ship.center.x, ship.ship.center.y);
                }
                lives--;
                ship.ship.center=findSafeLocation();
              }
              delete ufos.lasers[laser];
              return;
        }
      });
    }

      function computeStatusString(){
        let str = "score: " + score + " | level: " + level + " | lives: " + lives + " | hyperspace: ";
        if(hyperspace==0){
          str += "ready";
        } else {
          str +=parseInt(hyperspace/1000);
        }
        document.getElementById("score").innerText= str;
      }

      function findSafeLocation(){
        let found = false;
        let x;
        let y;
        while(!found){
          found = true;
          x = Random.nextRange(100, window.innerWidth-100);
          y = Random.nextRange(100, window.innerHeight-100);
          Object.getOwnPropertyNames(asteroids.objects).forEach(function (asteroid) {
            Object.getOwnPropertyNames(ufos.objects).forEach(function (ufo) {
              Object.getOwnPropertyNames(ufos.lasers).forEach(function (laser) {
                if(Math.abs(asteroids.objects[asteroid].center.x - x) < 150 && Math.abs(asteroids.objects[asteroid].center.x - x) < 150 &&
                  Math.abs(ufos.objects[ufo].center.x - x) < 150 && Math.abs(ufos.objects[ufo].center.x - x) < 150 &&
                  Math.abs(ufos.lasers[laser].center.x - x) < 250 && Math.abs(ufos.lasers[laser].center.x - x) < 250){
                  found = false;
                }
              });
            });
          });
        }
        return {x: x, y: y};
      }

      myKeyboard.register('w', ship.moveForward);
      myKeyboard.register('a', ship.rotateLeft);
      myKeyboard.register('d', ship.rotateRight);

      myKeyboard.register('ArrowUp', ship.moveForward);
      myKeyboard.register('ArrowLeft', ship.rotateLeft);
      myKeyboard.register('ArrowRight', ship.rotateRight);

      requestAnimationFrame(gameLoop);

      window.onkeyup = function(e) {
         if(e.keyCode==27){ //escape
           if (gameOver){
               context.clearRect(0, 0, canvas.width, canvas.height);
           } else if (paused){
             paused = false;
             gameOver=true;
           }else {
             paused = true;
           }
         }
         if(e.keyCode==32){ //space
           if(paused){
             paused = false;
           } else if (!gameOver) {
             laserAudio.play();
             ship.shoot();
           }
         }
         if(e.keyCode==90){ // z
           if(hyperspace==0){
             ship.ship.center=findSafeLocation();
             hyperspace = 9000;
           }

         }
      }
  }(MyGame.systems, MyGame.input, MyGame.render, MyGame.graphics));
}

function resize(){
    let canvas = document.getElementById("id-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight-40;
}

function highScores(){
  highs = highs.sort(sortNumber);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "greenyellow";
  context.font = "25px Courier New";
  context.fillText("high scores:", 20, 200);
  context.fillText("1. " + highs[0], 40, 250);
  context.fillText("2. " + highs[1], 40, 300);
  context.fillText("3. " + highs[2], 40, 350);
  context.fillText("4. " + highs[3], 40, 400);
  context.fillText("5. " + highs[4], 40, 450);
}

function credits(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "greenyellow";
  context.font = "25px Courier New";
  context.fillText("credits:", 20, 200);
  context.fillText("by alan henderson", 40, 250);
  context.fillText("all art and sound effects from opengameart.org", 40, 300);
}

function controls(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "greenyellow";
  context.font = "25px Courier New";
  context.fillText("controls:", 20, 200);
  context.fillText("rotate: left/right arrow keys", 40, 250);
  context.fillText("thrust: up arrow key", 40, 300);
  context.fillText("fire laser: spacebar", 40, 350);
  context.fillText("hyperspace: z key", 40, 400);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sortNumber(a,b) {
        return b - a;
    }
