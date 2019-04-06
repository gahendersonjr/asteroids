let canvas = document.getElementById("id-canvas");
let context = canvas.getContext("2d");
let highs = [0,0,0,0,0];
if(localStorage.getItem("asteroids.highs")){
  highs = localStorage.getItem("asteroids.highs").split(',');
}

function startGame(){
  document.getElementById("startGame").classList.add("inactive");
  document.getElementById("highScores").classList.add("inactive");
  document.getElementById("credits").classList.add("inactive");
  document.getElementById("score").classList.remove("inactive");
  MyGame.main = (function (systems, input, renderer, graphics) {
      'use strict';
      let score = 0;
      let speed = 0;
      let angle = 0;

      let paused = false;
      let gameOver = false;
      let gameOverScreen = false;
      let lastTimeStamp = performance.now();
      let myKeyboard = input.Keyboard();

      let ship = systems.Ship();
      let particlesFire = systems.ParticleSystem();
      let particlesSmoke = systems.ParticleSystem();
      let fireRenderer = renderer(particlesFire, graphics,
          'assets/fire.png');
      let smokeRenderer = renderer(particlesSmoke, graphics,
          'assets/smoke-2.png');
      let shipRenderer = renderer(ship, graphics,
          'assets/ship.png');

      function processInput(elapsedTime) {
          myKeyboard.update(elapsedTime);
      }

      function update(elapsedTime) {
          computeStatusString();
          particlesFire.update(elapsedTime);
          particlesSmoke.update(elapsedTime);
          ship.update(elapsedTime);
          if(!gameOver){
            let particles = ship.particles();
            if(particles){
              particlesFire.create(particles[0], particles[1]);
            }
          }
      }


      function render() {
          graphics.clear();
          if(!gameOver){
            smokeRenderer.render();
            fireRenderer.render();
            shipRenderer.render();
          } else {
              context.fillStyle = "white";
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
              context.fillStyle = "white";
              context.font = "25px Courier New";
              context.fillText("game pause", 20, 200);
              context.fillText("press escape to quit", 40, 250);
              context.fillText("press space to continue", 40, 300);
          }
          if (!gameOver){
            requestAnimationFrame(gameLoop);
          }
      }

      function computeStatusString(){
        let str = "fuel: " + score + " | speed: " + speed + " | angle: " + angle;
        document.getElementById("score").innerText= str;
      }

      myKeyboard.register('w', ship.thrust);
      myKeyboard.register('a', ship.rotateLeft);
      myKeyboard.register('d', ship.rotateRight);

      myKeyboard.register('ArrowUp', ship.thrust);
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
           paused = !paused;
         }
      }
  }(MyGame.systems, MyGame.input, MyGame.render, MyGame.graphics));
}

function setSize(){
    let canvas = document.getElementById("id-canvas");
    canvas.width = 800;//window.innerWidth;
    canvas.height = 800;//window.innerHeight-40;
}

function highScores(){
  highs = highs.sort(sortNumber);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "white";
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
  context.fillStyle = "white";
  context.font = "25px Courier New";
  context.fillText("credits:", 20, 200);
  context.fillText("by alan henderson", 40, 250);
  context.fillText("all art provided by Dr. Mathias for exam", 40, 300);
}

function sortNumber(a,b) {
        return b - a;
    }
