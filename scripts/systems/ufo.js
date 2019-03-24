MyGame.systems.UFOs = function () {
    let nextName = 1;
    let objects = {};
    let lasers = {};
    let laserIndex = 1;

    function create(size) {
        let object = {
            center: getStartingLocation(),
            size: { x: size, y: size },
            direction: Random.nextCircleVector(),
            speed: Random.nextGaussian(200, 40), // pixels per second
            rotation: 0
        };

        return object;
    }

    function update(elapsedTime) {
        let removeMe = [];

        elapsedTime = elapsedTime / 1000;
        if (Random.nextRange(0,100)==0 && Object.keys(objects).length < 1){
            let size = Random.nextRange(0,2)==1 ? 80 : 160;
            objects[nextName++] = create(size);
        }

        Object.getOwnPropertyNames(objects).forEach(value => {
            let object = objects[value];
            if(Random.nextRange(0,30)==0){
              shoot(object.center.x, object.center.y);
            }

            object.center.x += (elapsedTime * object.speed * object.direction.x);
            object.center.y += (elapsedTime * object.speed * object.direction.y);
            if (object.center.x < 0 || object.center.x > window.innerWidth || object.center.y < 0 || object.center.y >  window.innerHeight) {
                removeMe.push(value);
            }
        });

        for (let object = 0; object < removeMe.length; object++) {
            delete objects[removeMe[object]];
        }
    }

    function laserUpdate(elapsedTime) {
        let removeMe = [];

        elapsedTime = elapsedTime / 1000;
        Object.getOwnPropertyNames(lasers).forEach(value => {
            let object = lasers[value];
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

    function shoot(x,y){
      let laser = {
          center: {x: x, y: y},
          size: { x: 30, y: 30 },
          direction: Random.nextCircleVector(),
          speed: 400, // pixels per second
          rotation: 0,
          count: false
      };
      lasers[laserIndex++] = laser;
    }

    function getStartingLocation(){
      let width = window.innerWidth;
      let height = window.innerHeight;
      switch (Random.nextRange(0,4)){
        case 0:
          return { x: width, y: Random.nextRange(0,height)};
        case 1:
          return { x: Random.nextRange(0,width), y: 0};
        case 2:
          return { x: Random.nextRange(0,width), y: height};
        case 3:
          return { x: 0, y: Random.nextRange(0,height)};
        default:
          break;
      }
    }

    let api = {
        update: update,
        get objects() { return objects; },
        get lasers() {return lasers;},
        laserUpdate: laserUpdate
    };

    return api;
};
