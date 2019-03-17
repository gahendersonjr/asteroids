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

    let api = {
        render: render
    };

    return api;
};
