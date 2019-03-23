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

      function processInput(elapsedTime) {
          myKeyboard.update(elapsedTime);
      }

      function update(elapsedTime) {
          // particlesFire.update(elapsedTime);
          // particlesSmoke.update(elapsedTime);
          asteroids.update(elapsedTime);
      }

      function render() {
          graphics.clear();
          shipRenderer.render();
          asteroidRenderer.render();
          // smokeRenderer.render();
          // fireRenderer.render();
      }

      function gameLoop(time) {
          let elapsedTime = (time - lastTimeStamp);
          processInput(elapsedTime);
          if (!paused){
            update(elapsedTime);
          }
          lastTimeStamp = time;

          render();
          requestAnimationFrame(gameLoop);
      };

      myKeyboard.register('w', ship.moveForward);
      myKeyboard.register('a', ship.rotateLeft);
      myKeyboard.register('d', ship.rotateRight);

      myKeyboard.register('ArrowUp', ship.moveForward);
      myKeyboard.register('ArrowLeft', ship.rotateLeft);
      myKeyboard.register('ArrowRight', ship.rotateRight);

      requestAnimationFrame(gameLoop);

      window.onkeyup = function(e) {
         console.log(e.keyCode);
         if(e.keyCode==27){
           paused = !paused;
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
  context.fillText("fire lasser: spacebar", 40, 350);
  context.fillText("hyperspace: z key", 40, 400);
}
