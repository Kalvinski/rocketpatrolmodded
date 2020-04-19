//Spaceship prefab
class JellyBullet extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, texture, frame, xdir) {
        super (scene, x, y, texture, frame);
        scene.add.existing(this); //add to existing scene
        this.dir = xdir;
    }

    update() {
        if (this.x < 0 || this.x > game.config.width || this.y > game.config.height) {
            this.x = 500;
            this.y = 500;
        } else {
        //move bullet in specified direction
        this.y += 3;
        this.x += this.dir; 
        }
    }
}