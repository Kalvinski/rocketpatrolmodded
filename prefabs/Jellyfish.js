//Spaceship prefab
class Jellyfish extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, texture, frame, pointValue) {
        super (scene, x, y, texture, frame);
        scene.add.existing(this); //add to existing scene
        //store pointValue
        this.points = pointValue;
    }

    update() {
        //move spaceship right
        this.x += game.settings.spaceshipSpeed*2;
        //warp from right to left
        if (this.x >= game.config.width+this.width) {
            this.reset();
        }
    }
    reset() {
        this.x = 0 - this.width;
    }
}