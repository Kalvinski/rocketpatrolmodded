/*
 - paralax scrolling (15)
 - control rocket after fire (10)
 - animated ships (15)
 - new smaller /faster spaceship w/ animated artwork and death sprite sheet + releases projectiles that can hit other ships for more points (30?)
 - new artwork for all assets (25)
 - created two original music tracks, which track you hear depends on difficulty (20?)
 (I know I can't get over 100)
*/

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu , Play ]
  }
  
  let game = new Phaser.Game(config);

  //define game settings
  game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000
  }

  //reserve keyboard vars
  let keyF, keyLEFT, keyRIGHT;