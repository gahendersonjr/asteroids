MyGame.systems.ParticleSystem = function () {
    let nextName = 1;
    let objects = {};

    function create(x,y, direction=Random.nextCircleVector()) {
        let size = Random.nextGaussian(15, 5);
        let p = {
            center: { x: x, y: y },
            size: { x: size, y: size },
            direction: direction,
            speed: Random.nextGaussian(65,35), // pixels per second
            rotation: 0,
            lifetime: Random.nextGaussian(.75, .2), // seconds
            alive: 0
        };

        objects[nextName++] = p;
    }

    function update(elapsedTime) {
        let removeMe = [];
        // console.log(Random.nextCircleVector());

        elapsedTime = elapsedTime / 1000;
        Object.getOwnPropertyNames(objects).forEach(value => {
            let object = objects[value];

            object.alive += elapsedTime;
            object.center.x += (elapsedTime * object.speed * object.direction.x);
            object.center.y += (elapsedTime * object.speed * object.direction.y);

            object.rotation += object.speed / 500;

            if (object.alive > object.lifetime) {
                removeMe.push(value);
            }
        });

        for (let object = 0; object < removeMe.length; object++) {
            delete objects[removeMe[object]];
        }
    }

    let api = {
        update: update,
        create: create,
        get objects() { return objects; }
    };

    return api;
};
