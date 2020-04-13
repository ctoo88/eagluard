import Phaser from 'phaser';
import loadingJpg from './assets/loading.jpg';
import imgInsideA2 from './assets/Inside_A2.png';
import imgInsideB from './assets/Inside_B.png';
import imgOutsideA2 from './assets/Outside_A2.png';
import imgOutsideA3 from './assets/Outside_A3.png';
import imgOutsideB from './assets/Outside_B.png';
import jsonYing from './assets/ying.json';
import spriteActor1 from './assets/Actor1.png';
import imgDialog1 from './assets/dialog1.png';

const gameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
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
          url: loadingJpg
        }
      ]
    }
  }
};

const game = new Phaser.Game(gameConfig);
const myFontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif';
let player = {};
let worldX = 768;
let worldY = 1008;

function preload() {
  const loading = this.add.image(gameConfig.width / 2, gameConfig.height / 2, 'loading');
  const progressBarFrame = this.add.rectangle((gameConfig.width - 270) / 2, gameConfig.height / 1.2, 270, 15, 0x000000, 0.5);
  const progressBar = this.add.rectangle((gameConfig.width - 270) / 2, gameConfig.height / 1.2, 100, 15, 0xFFA500);
  const progressValue = this.add.text(gameConfig.width / 2, gameConfig.height / 1.2);
  
  loading.setScale(gameConfig.width / loading.width);
  progressBarFrame.setOrigin(0, 0.5);
  progressBar.setOrigin(0, 0.5);
  progressValue.setOrigin(0.5, 0.5);

  this.load.on('progress', function (value) {
    progressBar.setSize(270 * value, 15);
    progressValue.setText(Math.floor(value * 100) + ' %');
  });

  this.load.on('complete', function () {
    progressValue.destroy();
    progressBar.destroy();
    progressBarFrame.destroy();
    loading.destroy();
  });

  this.load.image('insideA2', imgInsideA2);
  this.load.image('insideB', imgInsideB);
  this.load.image('outsideA2', imgOutsideA2);
  this.load.image('outsideA3', imgOutsideA3);
  this.load.image('outsideB', imgOutsideB);
  this.load.image('dialog1', imgDialog1);
  this.load.tilemapTiledJSON('ying', jsonYing);
  this.load.spritesheet('actor1', spriteActor1, { frameWidth: 48, frameHeight: 48 });
}

function create() {
  const yingMap = this.make.tilemap({ key: 'ying'});
  const insideA2Tile = yingMap.addTilesetImage('Inside_A2', 'insideA2');
  const insideBTile = yingMap.addTilesetImage('Inside_B', 'insideB');
  const outsideA2Tile = yingMap.addTilesetImage('Outside_A2', 'outsideA2');
  const outsideA3Tile = yingMap.addTilesetImage('Outside_A3', 'outsideA3');
  const outsideBTile = yingMap.addTilesetImage('Outside_B', 'outsideB');

  const groundLayer = yingMap.createStaticLayer('ground', [insideA2Tile, outsideA2Tile]);
  const buildLayer = yingMap.createStaticLayer('build', [insideBTile, outsideA2Tile, outsideA3Tile, outsideBTile]);
  const overLayer = yingMap.createStaticLayer('over', outsideBTile);

  const camera = this.cameras.main;
  const mark = this.add.rectangle(worldX, worldY, 48, 48, 0x000000, 0.3);
  const npc = this.physics.add.staticSprite(672, 1200, 'actor1', 10);

  const dialog = this.add.group();
  const leftDialog = this.add.arc(48, gameConfig.height - 48, 48, 90, 270, false, 0x000000, 0.5);
  const middleDialog = this.add.rectangle(gameConfig.width / 2, gameConfig.height - 48, gameConfig.width - 96, 96, 0x000000, 0.5);
  const rightDialog = this.add.arc(gameConfig.width - 48, gameConfig.height - 48, 48, 270, 90, false, 0x000000, 0.5);
  const dialog1Img = this.add.image(16, gameConfig.height - 48, 'dialog1');
  const dialog2Img = this.add.image(gameConfig.width - 16, gameConfig.height - 48, 'dialog1');
  const npcName = this.add.text(48, gameConfig.height - 96, '', { fontFamily: myFontFamily });
  const npcText = this.add.text(gameConfig.width / 2, gameConfig.height - 48, '西塞山前白鹭飞，桃花流水鳜鱼肥', { fontFamily: myFontFamily });
  const taskButton = this.add.circle(gameConfig.width / 5, gameConfig.height - 144, 24, 0x000000, 0.5);
  const checkButton = this.add.circle(gameConfig.width * 2 / 5, gameConfig.height - 144, 24, 0x000000, 0.5);
  const battleButton = this.add.circle(gameConfig.width * 3 / 5, gameConfig.height - 144, 24, 0x000000, 0.5);
  const cancelButton = this.add.circle(gameConfig.width * 4 / 5, gameConfig.height - 144, 24, 0x000000, 0.5);

  let tagetID = 0;

  player = this.physics.add.sprite(worldX, worldY, 'actor1', 31);
  overLayer.setDepth(5);
  camera.startFollow(player, false, 0.4, 0.4);
  camera.setBounds(0, 0, yingMap.widthInPixels, yingMap.heightInPixels);
  player.setOrigin(0, 0);
  mark.setOrigin(0, 0);
  npc.setOrigin(0, 0);
  npc.setOffset(24, 24);
  npc.setInteractive();
  npc.tagetID = 20;

  // dialog group
  dialog.setDepth(10);
  leftDialog.setDepth(10);
  middleDialog.setDepth(10);
  rightDialog.setDepth(10);
  dialog1Img.setDepth(10);
  dialog2Img.setDepth(10);
  npcName.setDepth(15);
  npcText.setDepth(15);
  taskButton.setDepth(15);
  checkButton.setDepth(15);
  battleButton.setDepth(15);
  cancelButton.setDepth(15);
  dialog.add(leftDialog);
  dialog.add(middleDialog);
  dialog.add(rightDialog);
  dialog.add(dialog1Img);
  dialog.add(dialog2Img);
  dialog.add(npcName);
  dialog.add(npcText);
  dialog.add(taskButton);
  dialog.add(checkButton);
  dialog.add(battleButton);
  dialog.add(cancelButton);
  dialog.setVisible(false);
  dialog.visible = false;
  leftDialog.setScrollFactor(0, 0);
  middleDialog.setScrollFactor(0, 0);
  rightDialog.setScrollFactor(0, 0);
  dialog1Img.setScrollFactor(0, 0);
  dialog2Img.setScrollFactor(0, 0);
  npcName.setScrollFactor(0, 0);
  npcText.setScrollFactor(0, 0);
  taskButton.setScrollFactor(0, 0);
  checkButton.setScrollFactor(0, 0);
  battleButton.setScrollFactor(0, 0);
  cancelButton.setScrollFactor(0, 0);
  npcName.setOrigin(0, 0.5);
  npcText.setOrigin(0.5, 0.5);
  dialog2Img.setAngle(180);
  cancelButton.setInteractive();
  cancelButton.tagetID = 1;

  // collides
  buildLayer.setCollisionByProperty({ collide: true });
  this.physics.add.collider(player, buildLayer);
  this.physics.add.collider(player, npc, function() {
    if (tagetID == 20) {
      npcName.setText('钓鱼翁');
      dialog.setVisible(true);
      dialog.visible = true;
    }
  });

  // player anims
  this.anims.create({
    key : 'left',
    frames : this.anims.generateFrameNumbers('actor1', { start: 18, end: 20 }),
    frameRate : 8,
    repeat : -1
  });
  this.anims.create({
    key : 'right',
    frames : this.anims.generateFrameNumbers('actor1', { start: 30, end: 32 }),
    frameRate : 8,
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
      worldX = formatPoint(pointer.worldX);
      worldY = formatPoint(pointer.worldY);
      mark.setPosition(worldX, worldY);

      if (moveX()) {
        player.anims.play(moveX() > 0 ? 'right' : 'left', true);
        player.body.setVelocityX(moveX() > 0 ? 96 : -96);
      }

      if (moveY()) {
        player.body.setVelocityY(moveY() > 0 ? 96 : -96);
      }
    }
  }, this);

  // debug
  // buildLayer.renderDebug(this.add.graphics(), { tileColor: null });
}

function update() {
  if (moveX()) {
    if (Math.abs(moveX()) < 2) {
      player.body.setVelocityX(0);
      player.setPosition(worldX, player.y);
    }
  }

  if (moveY()) {
    if (Math.abs(moveY()) < 2) {
      player.body.setVelocityY(0);
      player.setPosition(player.x, worldY);
    }
  }
}

// utils
function formatPoint(num) {
  return Math.floor(num / 48) * 48;
}

function moveX() {
  return worldX - player.x;
}

function moveY() {
  return worldY - player.y;
}
