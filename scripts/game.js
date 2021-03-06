let canvas = document.getElementById("id-canvas");
let context = canvas.getContext("2d");
let highs = [0,0,0,0,0];
if(localStorage.getItem("lander.highs")){
  highs = localStorage.getItem("lander.highs").split(',');
}

let surface = [
   { x: 0.00 * 800, y: 800-(0.00 * 800), safe: false },
   { x: 0.25 * 800, y: 800-(0.25 * 800), safe: false },
   { x: 0.40 * 800, y: 800-(0.10 * 800), safe: true },
   { x: 0.70 * 800, y: 800-(0.10 * 800), safe: true },
   { x: 0.80 * 800, y: 800-(0.45 * 800), safe: false },
   { x: 1.00 * 800, y: 800-(0.00 * 800), safe: false },
];

function startGame(){
  document.getElementById("startGame").classList.add("inactive");
  document.getElementById("highScores").classList.add("inactive");
  document.getElementById("credits").classList.add("inactive");
  document.getElementById("score").classList.remove("inactive");
  MyGame.main = (function (systems, input, renderer, graphics) {
      'use strict';
      let score = 0;
      let speed = 0;
      let degrees = 0;
      let safeAngle=false;
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
          particlesFire.update(elapsedTime);
          particlesSmoke.update(elapsedTime);
          if(!gameOverScreen || score==-1){
            ship.update(elapsedTime);
          }
          speed = parseInt(ship.ship.downwardSpeed*20);
          if(!gameOverScreen){
            score = parseInt(ship.ship.fuel);
          }
          computDegrees();
          computeStatusString();
          checkCollision();
          let particles = ship.particles();
          if(particles){
            particlesFire.create(particles[0], particles[1], particles[2]);
          }
      }


      function render() {
          graphics.clear();
          smokeRenderer.render();
          fireRenderer.render();
          shipRenderer.render();
          context.beginPath();
          context.moveTo(surface[0].x, surface[0].y);
          for(let i=1; i<surface.length; i++){
           context.lineTo(surface[i].x, surface[i].y);
          }
          context.strokeStyle = "red";
          context.stroke();
          context.fillStyle = "grey";
          context.fill();
          context.closePath();
          if(gameOverScreen) {
              context.fillStyle = "white";
              context.font = "25px Courier New";
              if (score==-1){
                context.fillText("better luck next time!", 20, 200);
              } else {
                context.fillText("safe landing!", 20, 200);
                context.fillText("you scored " + score, 40, 250);
              }
              for(let i in highs){
                highs[i] = parseInt(highs[i]);
              }
              highs.sort(sortNumber);
              localStorage.setItem("lander.highs", highs);
          }

      }

      function gameLoop(time) {
          let elapsedTime = (time - lastTimeStamp);
          processInput(elapsedTime);
          lastTimeStamp = time;
          update(elapsedTime);
          render();
          requestAnimationFrame(gameLoop);
      }

      function computDegrees(){
        degrees = (ship.ship.rotation * 180 / Math.PI) % 360;
        if (degrees < 0){
          degrees += 360;
        }
        if (degrees <=5 || degrees >= 355){
          safeAngle=true;
          document.getElementById("angle").style.color = "greenyellow";
        } else{
          document.getElementById("angle").style.color = "white";
          safeAngle=false;
        }
      }
      function computeStatusString(){
        if(!gameOverScreen){
          document.getElementById("fuel").innerText=  "fuel: " + score;
          document.getElementById("speed").innerText= "speed: " + speed;
          document.getElementById("angle").innerText= "angle: " + parseInt(degrees);
        }
      }

      myKeyboard.register('w', ship.thrust);
      myKeyboard.register('a', ship.rotateLeft);
      myKeyboard.register('d', ship.rotateRight);

      myKeyboard.register('ArrowUp', ship.thrust);
      myKeyboard.register('ArrowLeft', ship.rotateLeft);
      myKeyboard.register('ArrowRight', ship.rotateRight);

      requestAnimationFrame(gameLoop);

      function checkCollision(){
          for(let i=0; i<surface.length-1; i++){
            if(lineCircleIntersection(surface[i], surface[i+1]) && !gameOverScreen){
              if(!surface[i].safe || !surface[i+1].safe || (degrees > 5 && degrees <355) || speed>2){
                gameOverScreen = true;
                for(let i=0; i<500; i++){
                  particlesFire.create(ship.ship.center.x, ship.ship.center.y);
                  particlesSmoke.create(ship.ship.center.x, ship.ship.center.y);
                }
                score = -1;
              }
              gameOverScreen = true;
              if (score >= highs[4]){
                highs[4]=score;
              }
              for(let i in highs){
                highs[i] = parseInt(highs[i]);
              }
              highs.sort(sortNumber);
              localStorage.setItem("lander.highs", highs);
            }
          }
      }
      //modified version of example in exam description
      function lineCircleIntersection(pt1, pt2) {
        let v1 = { x: pt2.x - pt1.x, y: pt2.y - pt1.y };
        let v2 = { x: pt1.x - ship.ship.center.x, y: pt1.y - ship.ship.center.y };
        let b = -2 * (v1.x * v2.x + v1.y * v2.y);
        let c =  2 * (v1.x * v1.x + v1.y * v1.y);
        let d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - ship.ship.radius * ship.ship.radius));
        if (isNaN(d)) { // no intercept;
            return false;
        }
        // These represent the unit distance of point one and two on the line
        let u1 = (b - d) / c;
        let u2 = (b + d) / c;
        if (u1 <= 1 && u1 >= 0) {  // If point on the line segment
            return true;
        }
        if (u2 <= 1 && u2 >= 0) {  // If point on the line segment
            return true;
        }
        return false;
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
