MyGame.systems.Ship = function() {
    const MAP_SIZE = 800;
    const GRAVITY = 0.003;
    let particles = null;
    let ship = {
        radius: MAP_SIZE * 0.05 / 2,
        size: { x: MAP_SIZE * 0.05, y: MAP_SIZE * 0.05 },       // Size in pixels
        center: { x: MAP_SIZE *  0.25, y: MAP_SIZE * (1- 0.90) },
        rotation: 3 * (Math.PI / 2),
        // moveRate: 0,         // Pixels per second
        thrustRate: .07,
        rotateRate: 0.0015,   // Radians per second
        downwardSpeed: 0,
        fuel: 2000
    }
    function thrust(elapsedTime) {
            if(ship.fuel<=0){
              ship.fuel=0
              return;
            }
            // Create a normalized direction vector
            let vectorX = Math.cos(ship.rotation-90);
            let vectorY = Math.sin(ship.rotation-90);
            // With the normalized direction vector, move the center of the sprite
            ship.center.x += (vectorX * ship.thrustRate * elapsedTime);
            ship.center.y += (vectorY * ship.thrustRate * elapsedTime);
            ship.downwardSpeed -= ship.thrustRate;
            ship.downwardSpeed += GRAVITY;
            ship.center.y += (elapsedTime * ship.downwardSpeed * 1);
            if(ship.downwardSpeed<0){
              ship.downwardSpeed = 0;
            }
            particles = [ship.center.x, ship.center.y];
            ship.fuel -= elapsedTime/3;
    }

    function update(elapsedTime){
      ship.downwardSpeed += GRAVITY;
      ship.center.y += (elapsedTime * ship.downwardSpeed * 1);
    }

    function rotateLeft(elapsedTime) {
        ship.rotation -= ship.rotateRate * (elapsedTime);
    }

    function rotateRight(elapsedTime) {
        ship.rotation += ship.rotateRate * (elapsedTime);
    }

    function sendParticles(){
      let temp = particles;
      particles = null;
      return temp;
    }


    let api = {
        update: update,
        get downwardSpeed() {return ship.downwardSpeed;},
        get size() { return ship.size; },
        get center() { return ship.center; },
        get radius() {return ship.radius},
        get rotation() { return ship.rotation; },
        get objects() {return {1: ship};},
        get ship() {return ship;},
        particles: sendParticles,
        thrust: thrust,
        rotateLeft: rotateLeft,
        rotateRight: rotateRight
    };

    return api;
};
