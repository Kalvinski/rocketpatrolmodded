class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }

    preload() {
        //load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        //this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('astroids', './assets/astroids.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('jellybullet', './assets/jellybullet.png');
        //load spritesheets
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('spaceship', './assets/spaceship.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 1});
        this.load.spritesheet('jellyfish', './assets/jellyfish.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1});
        this.load.spritesheet('jellyburst', './assets/jellyburst.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 4});
    }


    create() {
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.astroids = this.add.tileSprite(0, 0, 640, 480, 'astroids').setOrigin(0, 0);
        //white rectangle borders
        this.add.rectangle(0, 0, 640, 37, 0x000000).setOrigin(0, 0);
        this.add.rectangle(0, 443, 640, 40, 0x000000).setOrigin(0, 0);
        this.add.rectangle(0, 5, 37, 455, 0x000000).setOrigin(0, 0);
        this.add.rectangle(603, 5, 40, 455, 0x000000).setOrigin(0, 0);
        //green UI background
        this.add.rectangle(37, 32, 566, 64, 0x00FF00).setOrigin(0, 0);
        //add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);
        //add spaceships (x3)
        this.ship01 = new Spaceship (this, game.config.width + 192, 132, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship (this, game.config.width + 96, 196, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship (this, game.config.width, 260, 'spaceship', 0, 10).setOrigin(0,0);
        this.Jfish = new Jellyfish (this, -100, 100, 'jellyfish', 0, 50).setOrigin(0,0);
        //add bullets (for when jellyfish explodes)
        this.Bullet1 = new JellyBullet (this, 500, 500, 'jellybullet', 0, 0).setOrigin(0,0);
        this.Bullet2 = new JellyBullet (this, 500, 500, 'jellybullet', 0, 3).setOrigin(0,0);
        this.Bullet3 = new JellyBullet (this, 500, 500, 'jellybullet', 0, -3).setOrigin(0,0);

        let config = {
            key: 'ship_animate',
            frames: this.anims.generateFrameNumbers('spaceship', {start:0, end:1, first: 0}),
            frameRate: 4,
            repeat: -1
        };

        let config2 = {
            key: 'jellyfloat',
            frames: this.anims.generateFrameNumbers('jellyfish', {start:0, end:1, first: 0}),
            frameRate: 6,
            repeat: -1
        };

        let config3 = {
            key: 'jellybust',
            frames: this.anims.generateFrameNumbers('jellyburst', {start:0, end:3, first: 0}),
            frameRate: 12,
        };

        this.anims.create(config);
        this.anims.create(config2);
        this.anims.create(config3);

        this.spaceship1animated = this.add.sprite(this.ship01.x, this.ship01.y, 'spaceship').play('ship_animate').setOrigin(0,0);
        this.spaceship2animated = this.add.sprite(this.ship02.x, this.ship02.y, 'spaceship').play('ship_animate').setOrigin(0,0);
        this.spaceship3animated = this.add.sprite(this.ship03.x, this.ship03.y, 'spaceship').play('ship_animate').setOrigin(0,0);
        this.Janimated = this.add.sprite(this.Jfish.x, this.Jfish.y, 'jellyfish').play('jellyfloat').setOrigin(0,0);

        //define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        //animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start:0, end:9, first:0}),
            frameRate: 30
        });
        
        
        //score
        this.p1Score = 0;

        //score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 44, this.p1Score, scoreConfig);

        //game over flag
        this.gameOver = false;

        //60 sec clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Return to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            }, null, this);

            this.disappear(this.ship01);
            this.disappear(this.ship02);
            this.disappear(this.ship03);
            this.disappear(this.Jfish);

    }

    update() {
        //check restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.start("menuScene");
        }
        this.starfield.tilePositionX -= 4;
        this.astroids.tilePositionX -= 2;
        if (!this.gameOver) {
            this.p1Rocket.update();
            this.ship01.update();
            this.spaceship1animated.x = this.ship01.x;
            this.ship02.update();
            this.spaceship2animated.x = this.ship02.x;
            this.ship03.update();
            this.spaceship3animated.x = this.ship03.x;
            this.Jfish.update();
            this.Janimated.x = this.Jfish.x;
            this.Bullet1.update();
            this.Bullet2.update();
            this.Bullet3.update();
        }
        //check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.Jfish)) {
            this.p1Rocket.reset();
            this.jellyExplode(this.Jfish);
        }


        if (this.checkCollision(this.Bullet1, this.ship03)) {
            this.Bullet1.x = 500;
            this.Bullet1.y = 500;
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.Bullet1, this.ship02)) {
            this.Bullet1.x = 500;
            this.Bullet1.y = 500;
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.Bullet1, this.ship01)) {
            this.Bullet1.x = 500;
            this.Bullet1.y = 500;
            this.shipExplode(this.ship01);
        }


        if (this.checkCollision(this.Bullet2, this.ship03)) {
            this.Bullet2.x = 500;
            this.Bullet2.y = 500;
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.Bullet2, this.ship02)) {
            this.Bullet2.x = 500;
            this.Bullet2.y = 500;
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.Bullet2, this.ship01)) {
            this.Bullet2.x = 500;
            this.Bullet2.y = 500;
            this.shipExplode(this.ship01);
        }

        if (this.checkCollision(this.Bullet3, this.ship03)) {
            this.Bullet3.x = 500;
            this.Bullet3.y = 500;
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.Bullet3, this.ship02)) {
            this.Bullet3.x = 500;
            this.Bullet3.y = 500;
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.Bullet3, this.ship01)) {
            this.Bullet3.x = 500;
            this.Bullet3.y = 500;
            this.shipExplode(this.ship01);
        }


        if (this.checkCollision(this.p1Rocket, this.Jfish)) {
            this.p1Rocket.reset();
            this.jellyExplode(this.Jfish);
        }
    }

    checkCollision(rocket, ship) {
        //simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
            } else {
                return false;
            }
    }

    shipExplode(ship) {
        //ship.alpha = 0; //hides ship
        //create explosion at ship location
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        ship.reset();
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
           // ship.alpha = 1;
            boom.destroy();
        });
        //score increment / repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }

    jellyExplode(jellyfish) {
        //ship.alpha = 0; //hides ship
        //create explosion at ship location
        this.Bullet1.x = jellyfish.x;
        this.Bullet2.x = jellyfish.x;
        this.Bullet3.x = jellyfish.x;
        this.Bullet1.y = jellyfish.y;
        this.Bullet2.y = jellyfish.y;
        this.Bullet3.y = jellyfish.y;
        let boom = this.add.sprite(jellyfish.x, jellyfish.y, 'jellyburst').setOrigin(0,0);
        jellyfish.reset();
        boom.anims.play('jellybust');
        boom.on('animationcomplete', () => {
           // ship.alpha = 1;
            boom.destroy();
        });
        //score increment / repaint
        this.p1Score += jellyfish.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }

    disappear(ship) {
        ship.alpha = 0; //hide original sprite
    }
}

