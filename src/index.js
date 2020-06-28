import Phaser from 'phaser';
import spriteActor1 from './assets/_actor1.png';
import imgBuild from './assets/_build.png';
import imgLine from './assets/_line.png';
import imgLoading from './assets/_loading.jpg';
import imgWorld from './assets/_world.png';
import jsonYing from './assets/ying.json';

const devicePixelRatio = window.devicePixelRatio || 1;
const gameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth * devicePixelRatio,
  height: window.innerHeight * devicePixelRatio,
  zoom: 1 / devicePixelRatio,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      // debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
    pack: {
      files: [
        {
          type: 'image',
          key: 'loading',
          url: imgLoading
        }
      ]
    }
  }
};
const game = new Phaser.Game(gameConfig);
const myFontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif';
let player = {};
let playerX = scaleSize(360);
let playerY = scaleSize(160);
let baseSize = scaleSize(40);

function preload() {
  const loading = this.add.image(gameConfig.width / 2, gameConfig.height / 2, 'loading');
  const progressBarFrame = this.add.rectangle((gameConfig.width - scaleSize(270)) / 2, gameConfig.height / 1.2, scaleSize(270), scaleSize(15), 0x000000, 0.5);
  const progressBar = this.add.rectangle((gameConfig.width - scaleSize(270)) / 2, gameConfig.height / 1.2, 0, scaleSize(15), 0xFFA500);
  const progressValue = this.add.text(gameConfig.width / 2, gameConfig.height / 1.2, '', { fontSize: scaleSize(16) + 'px' });
  
  loading.setScale(gameConfig.width / loading.width);
  progressBarFrame.setOrigin(0, 0.5);
  progressBar.setOrigin(0, 0.5);
  progressValue.setOrigin(0.5, 0.5);

  this.load.on('progress', function (value) {
    progressBar.setSize(scaleSize(270 * value), scaleSize(15));
    progressValue.setText(Math.floor(value * 100) + ' %');
  });

  this.load.on('complete', function () {
    progressValue.destroy();
    progressBar.destroy();
    progressBarFrame.destroy();
    loading.destroy();
  });

  this.load.spritesheet('actor1', spriteActor1, { frameWidth: 40, frameHeight: 40 });
  this.load.image('build', imgBuild);
  this.load.image('line', imgLine);
  this.load.image('world', imgWorld);
  this.load.tilemapTiledJSON('ying', jsonYing);
}

function create() {
  const mapYing = this.make.tilemap({ key: 'ying'});
  const tileBuild = mapYing.addTilesetImage('_build', 'build');
  const tileWorld = mapYing.addTilesetImage('_world', 'world');

  const layerGround = mapYing.createStaticLayer('ground', tileWorld);
  const layerBuild = mapYing.createStaticLayer('build', [tileWorld, tileBuild]);
  const layerCover = mapYing.createStaticLayer('cover', tileWorld);
  
  const camera = this.cameras.main;
  const mark = this.add.rectangle(playerX, playerY, baseSize, baseSize, 0x000000, 0.3);
  player = this.physics.add.sprite(playerX, playerY, 'actor1', 31);
  const npc = this.physics.add.staticSprite(0, scaleSize(640), 'actor1', 10);

  const dialog = this.add.group();
  const dialogLeft = this.add.arc(baseSize, gameConfig.height - baseSize, baseSize, 90, 270, false, 0x000000, 0.5);
  const dialogMiddle = this.add.rectangle(gameConfig.width / 2, gameConfig.height - baseSize, gameConfig.width - baseSize * 2, baseSize * 2, 0x000000, 0.5);
  const dialogRight = this.add.arc(gameConfig.width - baseSize, gameConfig.height - baseSize, baseSize, 270, 90, false, 0x000000, 0.5);
  const dialogLineLeft = this.add.image(scaleSize(16), gameConfig.height - baseSize, 'line');
  const dialogLineRight = this.add.image(gameConfig.width - scaleSize(16), gameConfig.height - baseSize, 'line');
  const npcName = this.add.text(baseSize, gameConfig.height - baseSize * 2, '', { fontFamily: myFontFamily, fontSize: scaleSize(16) + 'px' });
  const npcText = this.add.text(gameConfig.width / 2, gameConfig.height - baseSize, '西塞山前白鹭飞， 桃花流水鳜鱼肥', { fontFamily: myFontFamily, fontSize: scaleSize(16) + 'px' });
  const buttonTask = this.add.circle(gameConfig.width - baseSize, gameConfig.height - scaleSize(252), scaleSize(20), 0xff0000);
  const buttonCheck = this.add.circle(gameConfig.width - baseSize, gameConfig.height - scaleSize(204), scaleSize(20), 0x00ff00);
  const buttonBattle = this.add.circle(gameConfig.width - baseSize, gameConfig.height - scaleSize(156), scaleSize(20), 0x0000ff);
  const buttonCancel = this.add.circle(gameConfig.width - baseSize, gameConfig.height - scaleSize(108), scaleSize(20), 0xffffff);

  let tagetID = 0;

  layerGround.setScale(devicePixelRatio);
  layerBuild.setScale(devicePixelRatio);
  layerCover.setScale(devicePixelRatio);
  layerCover.setDepth(5);
  camera.startFollow(player, false, scaleSize(0.4), scaleSize(0.4));
  camera.setBounds(0, 0, scaleSize(mapYing.widthInPixels), scaleSize(mapYing.heightInPixels));
  mark.setOrigin(0, 0);
  player.setOrigin(0, 0);
  player.setScale(devicePixelRatio);
  npc.setOrigin(0, 0);
  npc.setScale(devicePixelRatio);
  npc.setSize(baseSize, baseSize);
  npc.setOffset(20, 20);
  npc.setInteractive();
  npc.tagetID = 11;

  // dialog group
  dialog.setDepth(10);
  dialogLeft.setDepth(10);
  dialogMiddle.setDepth(10);
  dialogRight.setDepth(10);
  dialogLineLeft.setDepth(10);
  dialogLineRight.setDepth(10);
  npcName.setDepth(15);
  npcText.setDepth(15);
  buttonTask.setDepth(15);
  buttonCheck.setDepth(15);
  buttonBattle.setDepth(15);
  buttonCancel.setDepth(15);
  dialogLineLeft.setScale(devicePixelRatio);
  dialogLineRight.setScale(devicePixelRatio);
  dialog.add(dialogLeft);
  dialog.add(dialogMiddle);
  dialog.add(dialogRight);
  dialog.add(dialogLineLeft);
  dialog.add(dialogLineRight);
  dialog.add(npcName);
  dialog.add(npcText);
  dialog.add(buttonTask);
  dialog.add(buttonCheck);
  dialog.add(buttonBattle);
  dialog.add(buttonCancel);
  dialog.setVisible(false);
  dialog.visible = false;
  dialogLeft.setScrollFactor(0, 0);
  dialogMiddle.setScrollFactor(0, 0);
  dialogRight.setScrollFactor(0, 0);
  dialogLineLeft.setScrollFactor(0, 0);
  dialogLineRight.setScrollFactor(0, 0);
  npcName.setScrollFactor(0, 0);
  npcText.setScrollFactor(0, 0);
  buttonTask.setScrollFactor(0, 0);
  buttonCheck.setScrollFactor(0, 0);
  buttonBattle.setScrollFactor(0, 0);
  buttonCancel.setScrollFactor(0, 0);
  npcName.setOrigin(0, 0.5);
  npcText.setOrigin(0.5, 0.5);
  dialogLineRight.setAngle(180);
  buttonCancel.setInteractive();
  buttonCancel.tagetID = 1;

  // collides
  layerBuild.setCollisionByProperty({ collide: true });
  this.physics.add.collider(player, layerBuild);
  this.physics.add.collider(player, npc, function() {
    if (tagetID == 11) {
      npcName.setText('钓鱼翁');
      dialog.setVisible(true);
      dialog.visible = true;
    }
  });

  // player anims
  this.anims.create({
    key : 'left',
    frames : this.anims.generateFrameNumbers('actor1', { start: 18, end: 20 }),
    frameRate : 5,
    repeat : -1
  });
  this.anims.create({
    key : 'right',
    frames : this.anims.generateFrameNumbers('actor1', { start: 30, end: 32 }),
    frameRate : 5,
    repeat : -1
  });
  player.anims.play('right', true);

  // main events
  this.input.on('pointerdown', function(pointer, currentlyOver) {
    const gameObject = currentlyOver[0];

    // interact
    if (gameObject) {
      tagetID = gameObject.tagetID;

      if (tagetID == 1) {
        dialog.setVisible(false);
        dialog.visible = false;
        return;
      }
    }

    // player move
    if (!dialog.visible) {
      playerX = formatPoint(pointer.worldX);
      playerY = formatPoint(pointer.worldY);
      mark.setPosition(playerX, playerY);

      if (moveX()) {
        player.anims.play(moveX() > 0 ? 'right' : 'left', true);
        player.body.setVelocityX(moveX() > 0 ? scaleSize(80) : scaleSize(-80));
      }

      if (moveY()) {
        player.body.setVelocityY(moveY() > 0 ? scaleSize(80) : scaleSize(-80));
      }
    }
  }, this);

  // debug
  // layerBuild.renderDebug(this.add.graphics(), { tileColor: null });
}

function update() {
  if (moveX()) {
    if (Math.abs(moveX()) < scaleSize(2)) {
      player.body.setVelocityX(0);
      player.setPosition(playerX, player.y);
    }
  }
  
  if (moveY()) {
    if (Math.abs(moveY()) < scaleSize(2)) {
      player.body.setVelocityY(0);
      player.setPosition(player.x, playerY);
    }
  }
}

// utils
function scaleSize(num) {
  return num * devicePixelRatio;
}
function formatPoint(num) {
  return Math.floor(num / baseSize) * baseSize;
}

function moveX() {
  return playerX - player.x;
}

function moveY() {
  return playerY - player.y;
}
