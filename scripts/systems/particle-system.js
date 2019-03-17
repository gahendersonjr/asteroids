MyGame.systems.ParticleSystem = function (spec) {
    let nextName = 1;
    let objects = {};

    function create() {
        let size = Random.nextGaussian(spec.size.mean, spec.size.stdev);
        let p = {
            center: { x: spec.center.x, y: spec.center.y },
            size: { x: size, y: size },
            direction: Random.nextCircleVector(),
            speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
            rotation: 0,
            lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev), // seconds
            alive: 0
        };

        return p;
    }

    function update(elapsedTime) {
        let removeMe = [];

        elapsedTime = elapsedTime / 1000;

        for (let object = 0; object < 2; object++) {
            objects[nextName++] = create();
        }

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
        get objects() { return objects; }
    };

    return api;
};
