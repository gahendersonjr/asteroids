MyGame.systems.Asteroids = function () {
    let nextName = 1;
    let objects = {};

    function create(starting, forceSmall) {
        let sizes = [40,60,80]
        let size = sizes[Random.nextRange(0,3)];
        if(forceSmall){
          size = 40;
        }
        let object = {
            center: starting,
            size: { x: size, y: size },
            direction: Random.nextCircleVector(),
            speed: Random.nextGaussian(200, 40), // pixels per second
            rotation: 0
        };

        return object;
    }

    function split(num, center){

      for(let i = 0; i < num; i++){
        console.log(nextName++);
        objects[nextName++] = create({x: center.x, y: center.y}, true);
      }
    }

    function update(elapsedTime) {
        let removeMe = [];

        elapsedTime = elapsedTime / 1000;

        if (Random.nextRange(0,15)==0){
            objects[nextName++] = create(getStartingLocation(), false);
        }

        Object.getOwnPropertyNames(objects).forEach(value => {
            let object = objects[value];

            object.center.x += (elapsedTime * object.speed * object.direction.x);
            object.center.y += (elapsedTime * object.speed * object.direction.y);

            object.rotation += object.speed / 2000;
            if (object.center.x < 0 || object.center.x > window.innerWidth || object.center.y < 0 || object.center.y >  window.innerHeight) {
                removeMe.push(value);
            }
        });

        for (let object = 0; object < removeMe.length; object++) {
            delete objects[removeMe[object]];
        }
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
        split: split,
        get objects() { return objects; }
    };

    return api;
};
