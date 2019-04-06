MyGame.systems.Ship = function() {
    const WORLD_UNIT = 800;
    const GRAVITY = 0.00000025 * WORLD_UNIT ;
    let particles = null;
    let ship = {
        radius: WORLD_UNIT * 0.05 / 2,
        size: { x: WORLD_UNIT * 0.05, y: WORLD_UNIT * 0.05 },       // Size in pixels
        center: { x: WORLD_UNIT *  0.25, y: WORLD_UNIT * (1- 0.90) },
        rotation: 0,
        moveRate: 0,         // Pixels per second
        rotateRate: 0.0015   // Radians per second
    }
    function thrust(elapsedTime) {
            // Create a normalized direction vector
            let vectorX = Math.cos(ship.rotation-90);
            let vectorY = Math.sin(ship.rotation-90);
            // With the normalized direction vector, move the center of the sprite
            ship.center.x += (vectorX * ship.moveRate * elapsedTime);
            ship.center.y += (vectorY * ship.moveRate * elapsedTime);
            particles = [ship.center.x, ship.center.y];
    }

    function update(elapsedTime){
      ship.moveRate += GRAVITY;
      ship.center.y += (elapsedTime * ship.moveRate * 1);
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
        get size() { return ship.size; },
        get center() { return ship.center; },
        get radius() {return ship.radius},
        // get rotation() { return ship.rotation; },
        get objects() {return {1: ship};},
        get ship() {return ship;},
        particles: sendParticles,
        thrust: thrust,
        rotateLeft: rotateLeft,
        rotateRight: rotateRight
    };

    return api;
};
