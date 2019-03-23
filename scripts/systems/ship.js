MyGame.systems.Ship = function() {
    let lasers = {};
    let laserIndex = 1;
    let ship = {
        size: { x: 100, y: 100 },       // Size in pixels
        center: { x: window.innerWidth/2, y: window.innerHeight/2 },
        rotation: 0,
        moveRate: 125 / 1000,         // Pixels per second
        rotateRate: Math.PI / 1000    // Radians per second
    }
    function moveForward(elapsedTime) {
            // Create a normalized direction vector
            let vectorX = Math.cos(ship.rotation);
            let vectorY = Math.sin(ship.rotation);
            // With the normalized direction vector, move the center of the sprite
            ship.center.x += (vectorX * ship.moveRate * elapsedTime);
            ship.center.y += (vectorY * ship.moveRate * elapsedTime);
    }

    function rotateLeft(elapsedTime) {
        ship.rotation -= ship.rotateRate * (elapsedTime);
    }

    function rotateRight(elapsedTime) {
        ship.rotation += ship.rotateRate * (elapsedTime);
    }

    function shoot(){
      let laser = {
          center: {x: ship.center.x, y: ship.center.y},
          size: { x: 25, y: 10 },
          direction: { x: Math.cos(ship.rotation), y: Math.sin(ship.rotation)},
          speed: 700, // pixels per second
          rotation: ship.rotation
      };
      console.log(laser.center);
      lasers[laserIndex++] = laser;
    }

    function laserUpdate(elapsedTime) {
        let removeMe = [];

        elapsedTime = elapsedTime / 1000;
        Object.getOwnPropertyNames(lasers).forEach(value => {
            let object = lasers[value];
            console.log(object.center);
            object.center.x += (elapsedTime * object.speed * object.direction.x);
            object.center.y += (elapsedTime * object.speed * object.direction.y);

            if (object.center.x < 0 || object.center.x > window.innerWidth || object.center.y < 0 || object.center.y >  window.innerHeight) {
                removeMe.push(value);
            }
        });

        for (let object = 0; object < removeMe.length; object++) {
            delete lasers[removeMe[object]];
        }
    }

    let api = {
        get size() { return ship.size; },
        get center() { return ship.center; },
        // get rotation() { return ship.rotation; },
        get objects() {return {1: ship};},
        get ship() {return ship;},
        get lasers() {return lasers;},
        moveForward: moveForward,
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        shoot: shoot,
        laserUpdate: laserUpdate
    };

    return api;
};
