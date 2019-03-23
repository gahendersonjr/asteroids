let canvas = document.getElementById("id-canvas");
let context = canvas.getContext("2d");
let highs = [0,0,0,0,0]

function startGame(){
  console.log("hi");
  document.getElementById("startGame").classList.add("inactive");
  document.getElementById("highScores").classList.add("inactive");
  document.getElementById("controls").classList.add("inactive");
  document.getElementById("credits").classList.add("inactive");
  document.getElementById("score").classList.remove("inactive");
  MyGame.main = (function (systems, input, renderer, graphics) {
      'use strict';
      let paused = false;
      let gameOver = false;
      let lastTimeStamp = performance.now();

      let myKeyboard = input.Keyboard();

      let asteroids = systems.Asteroids();
      let ship = systems.Ship();
      // let particlesFire = systems.ParticleSystem({
      //     center: { x: 300, y: 300 },
      //     size: { mean: 15, stdev: 5 },
      //     speed: { mean: 65, stdev: 35 },
      //     lifetime: { mean: 4, stdev: 1}
      // });
      // let particlesSmoke = systems.ParticleSystem({
      //     center: { x: 300, y: 300 },
      //     size: { mean: 12, stdev: 3 },
      //     speed: { mean: 65, stdev: 35 },
      //     lifetime: { mean: 4, stdev: 1}
      // });
      // let fireRenderer = renderer.ParticleSystem(particlesFire, graphics,
      //     'assets/fire.png');
      // let smokeRenderer = renderer.ParticleSystem(particlesSmoke, graphics,
      //     'assets/smoke-2.png');
      let asteroidRenderer = renderer(asteroids, graphics,
          'assets/asteroid.png');
      let shipRenderer = renderer(ship, graphics,
          'assets/ship.png');
      let laserRenderer = renderer(ship, graphics,
          'assets/laser.png');

      function processInput(elapsedTime) {
          myKeyboard.update(elapsedTime);
      }

      function update(elapsedTime) {
          // particlesFire.update(elapsedTime);
          // particlesSmoke.update(elapsedTime);
          ship.laserUpdate(elapsedTime);
          asteroids.update(elapsedTime);
          laserasteroidShipCollisionDetection();
          asteroidShipCollisionDetection();
      }


      function render() {
          graphics.clear();
          asteroidRenderer.render();
          laserRenderer.laserRender();
          shipRenderer.render();
          // smokeRenderer.render();
          // fireRenderer.render();
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

          if(!gameOver){
            requestAnimationFrame(gameLoop);
          } else {
            context.clearRect(0, 0, canvas.width, canvas.height);
            document.getElementById("startGame").classList.remove("inactive");
            document.getElementById("highScores").classList.remove("inactive");
            document.getElementById("controls").classList.remove("inactive");
            document.getElementById("credits").classList.remove("inactive");
            document.getElementById("score").classList.add("inactive");
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
              gameOver = true;
              return;
          }
        });
      }

      function laserasteroidShipCollisionDetection(){
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
                delete ship.lasers[laser];
                delete asteroids.objects[asteroid];
                return;
            }
          });
        });
      }

      myKeyboard.register('w', ship.moveForward);
      myKeyboard.register('a', ship.rotateLeft);
      myKeyboard.register('d', ship.rotateRight);

      myKeyboard.register('ArrowUp', ship.moveForward);
      myKeyboard.register('ArrowLeft', ship.rotateLeft);
      myKeyboard.register('ArrowRight', ship.rotateRight);

      requestAnimationFrame(gameLoop);

      window.onkeyup = function(e) {
         // console.log(e.keyCode);
         if(e.keyCode==27){ //escape
           if (paused) {
             gameOver = true;
           } else {
             paused = true;
           }
         }
         if(e.keyCode==32){ //space
           if(paused){
             paused = false;
           } else {
             ship.shoot();
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
