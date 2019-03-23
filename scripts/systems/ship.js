MyGame.systems.Ship = function() {

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

    let api = {
        get size() { return ship.size; },
        get center() { return ship.center; },
        // get rotation() { return ship.rotation; },
        get objects() {return {1: ship};},
        get ship() {return ship;},
        moveForward: moveForward,
        rotateLeft: rotateLeft,
        rotateRight: rotateRight
    };

    return api;
};
