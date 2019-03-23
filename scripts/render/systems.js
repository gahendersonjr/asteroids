MyGame.render = function (system, graphics, imageSrc) {
    let image = new Image();
    let isReady = false;

    image.onload = () => {
        isReady = true;
    };
    image.src = imageSrc;

    function render() {
        if (isReady) {
            Object.getOwnPropertyNames(system.objects).forEach(function (value) {
                let object = system.objects[value];
                graphics.drawTexture(image, object.center, object.rotation, object.size);
            });
        }
    }

    function laserRender() {
        if (isReady) {
            Object.getOwnPropertyNames(system.lasers).forEach(function (value) {
                let laser = system.lasers[value];
                graphics.drawTexture(image, laser.center, laser.rotation, laser.size);
            });
        }
    }

    let api = {
        render: render,
        laserRender: laserRender
    };

    return api;
};
