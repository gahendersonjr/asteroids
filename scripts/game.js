MyGame.main = (function (systems, input, renderer, graphics) {
    'use strict';

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
        asteroidRenderer.render();
        shipRenderer.render();
        // smokeRenderer.render();
        // fireRenderer.render();
    }

    function gameLoop(time) {
        let elapsedTime = (time - lastTimeStamp);
        processInput(elapsedTime);
        update(elapsedTime);
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
}(MyGame.systems, MyGame.input, MyGame.render, MyGame.graphics));

function resize(){
    let canvas = document.getElementById("id-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
