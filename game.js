document.addEventListener("DOMContentLoaded", function () {
  // Create background halves
  const topHalf = document.createElement("div");
  topHalf.id = "top-half";
  topHalf.classList.add("background-half");
  topHalf.style.backgroundImage =
    "url('media/graphics/sprites/ui/horizon.png')";

  const bottomHalf = document.createElement("div");
  bottomHalf.id = "bottom-half";
  bottomHalf.classList.add("background-half");
  bottomHalf.style.backgroundImage =
    "url('media/graphics/sprites/ui/foreground.png')";

  // Create logo container
  const logoContainer = document.createElement("div");
  logoContainer.id = "logo-container";
  const logoImage = document.createElement("img");
  logoImage.src = "media/graphics/sprites/ui/title.png";
  logoImage.alt = "Game Logo";
  logoContainer.appendChild(logoImage);

  // Append elements to the body
  document.body.appendChild(topHalf);
  document.body.appendChild(bottomHalf);
  document.body.appendChild(logoContainer);

  // Create Play button
  const playButton = document.createElement("button");
  playButton.id = "play-button";
  playButton.textContent = "PLAY";

  const logoContainerBottomPosition = 10; // Example value; adjust based on actual layout
  playButton.style.bottom = `${logoContainerBottomPosition}%`;

  // Append Play button to the body
  document.body.appendChild(playButton);

  // Event listener for the Play button
  playButton.addEventListener("click", function () {
    // Logic to transition to the main game scene goes here
    console.log("Play button clicked. Transition to the main game scene.");

    document.getElementById("top-half").style.display = "none";
    document.getElementById("bottom-half").style.display = "none";
    document.getElementById("logo-container").style.display = "none";
    playButton.style.display = "none";

    document.getElementById("background").style.display = "block";
    document.getElementById("character").style.display = "block";
    document.getElementById("status").style.display = "block";

    init();
  });
});

var game;
function init() {
  game = new Game();
  if (game.init()) game.start();
}

function soundBgm()  {
  let sound = new Audio("media/audio/bgm.mp3");
  if(sound.currentTime == 0 || sound.ended) {
    sound.play();
  }
}
var imageRepository = new (function () {
  var numImages = 50;
  var numLoaded = 0;

  this.control = new Image();
  this.island = new Image();
  this.tree = new Image();

  this.background = {
    "tile-water-1": new Image(),
    "tile-water-2": new Image(),
  };

  this.character = {
    "walk-up": new Image(),
    "walk-down": new Image(),
    "walk-left": new Image(),
    "walk-right": new Image(),
    "walk-up-left": new Image(),
    "walk-down-left": new Image(),
    "walk-up-right": new Image(),
    "walk-down-right": new Image(),
    "work-up": new Image(),
    "work-down": new Image(),
  };

  this.bridge = {
    horizontal: new Image(),
    vertical: new Image(),
  };

  this.particles = {
    ruby: new Image(),
    emerald: new Image(),
    amethyst: new Image(),
    money: new Image(),
  };

  this.status = {
    ruby: new Image(),
    emerald: new Image(),
    amethyst: new Image(),
    money: new Image(),
  };

  this.jewel = {
    "amethyst-mine": new Image(),
    "emerald-mine": new Image(),
    "ruby-mine": new Image(),
  };

  this.factory = {
    amethyst: new Image(),
    emerald: new Image(),
    ruby: new Image(),
    barn: new Image(),
  };

  function imageLoaded() {
    numLoaded++;
    if (numLoaded === numImages) {
      window.init();
    }
  }

  this.tree.src = "media/graphics/sprites/ingame/tree.png";
  this.island.src = "media/graphics/sprites/ingame/island.png";
  this.control.src = "media/graphics/sprites/ui/control.png";

  this.island.onload = function () {
    imageLoaded();
  };

  this.control.onload = function () {
    imageLoaded();
  };

  this.tree.onload = function () {
    imageLoaded();
  };

  Object.keys(this.character).forEach((key) => {
    this.character[key].src = `media/graphics/sprites/character/${key}.png`;
    this.character[key].onload = function () {
      imageLoaded();
    };
  });

  Object.keys(this.background).forEach((key) => {
    this.background[key].src = `media/graphics/sprites/ingame/${key}.png`;
    this.background[key].onload = function () {
      imageLoaded();
    };
  });

  Object.keys(this.jewel).forEach((key) => {
    this.jewel[key].src = `media/graphics/sprites/ingame/${key}.png`;
    this.jewel[key].onload = function () {
      imageLoaded();
    };
  });

  Object.keys(this.bridge).forEach((key) => {
    this.bridge[key].src = `media/graphics/sprites/ingame/bridge-${key}.png`;
    this.bridge[key].onload = function () {
      imageLoaded();
    };
  });

  Object.keys(this.factory).forEach((key) => {
    this.factory[key].src = `media/graphics/sprites/ingame/factory-${key}.png`;
    this.factory[key].onload = function () {
      imageLoaded();
    };
  });

  Object.keys(this.particles).forEach((key) => {
    this.particles[
      key
    ].src = `media/graphics/sprites/ingame/${key}-gem-particle.png`;
    this.particles[key].onload = function () {
      imageLoaded();
    };
  });

  Object.keys(this.status).forEach((key) => {
    this.status[key].src = `media/graphics/sprites/ui/${key}-gem.png`;
    this.status[key].onload = function () {
      imageLoaded();
    };
  });
})();

function Drawable() {
  this.init = function (x, y, width, height) {
    // Defualt variables
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  };

  this.speed = 0;
  this.canvasWidth = 0;
  this.canvasHeight = 0;
  this.type = "";

  // Define abstract function to be implemented in child objects
  this.draw = function () {};
  this.move = function () {};
}

function Background() {
  this.speed = 0; // Redefine speed of the background for panning
  this.acc = 0;
  this.tileSizeX = 720;
  this.tileSizeY = 720;

  this.drawTile = function (tileName, direction = 1) {
    let tileCountX =
      parseInt(game.viewSizeX / imageRepository.background[tileName].width) + 1;
    let tileCountY =
      parseInt(game.viewSizeY / imageRepository.background[tileName].height) +
      1;

    for (let offsetX = -10 * tileCountX; offsetX < 10 * tileCountX; offsetX++)
      for (
        let offsetY = -10 * tileCountY;
        offsetY < 10 * tileCountY;
        offsetY++
      ) {
        this.context.drawImage(
          imageRepository.background[tileName],
          0,
          0,
          imageRepository.background[tileName].width,
          imageRepository.background[tileName].height,
          direction * offsetX * this.tileSizeX +
            direction * this.x -
            game.characterX,
          direction * offsetY * this.tileSizeY +
            direction * this.y -
            game.characterY,
          imageRepository.background[tileName].width,
          imageRepository.background[tileName].height
        );
      }
  };

  this.draw = function () {
    this.x += this.speed;
    this.y += this.speed;
    this.acc += 0.001;
    this.context.clearRect(0, 0, game.viewSizeX, game.viewSizeY);
    this.drawTile("tile-water-2", -1);
    this.drawTile("tile-water-1", 1);
    this.speed = 0.5 * Math.sin(this.acc);
  };
}
Background.prototype = new Drawable();

function Character() {
  this.speed = 6;
  this.type = "character";
  this.shadowOffsetY = 0;
  this.shadowOffsetX = 0;

  this.moveImage = imageRepository.character["walk-up"];
  this.workImage = imageRepository.character["work-up"];
  this.curMoveIdx = 0;
  this.curWorkIdx = 0;
  this.maxMoveIdx = 12;
  this.maxWorkIdx = 6;

  this.init = function (x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  };

  this.moveSx = function () {
    return parseInt(this.curMoveIdx % 6);
  };

  this.moveSy = function () {
    return parseInt(this.curMoveIdx / 6);
  };

  this.workSx = function () {
    return parseInt(this.curWorkIdx % 6);
  };

  this.workSy = function () {
    return parseInt(this.curWorkIdx / 6);
  };

  this.moveIdx = function () {
    this.curMoveIdx += 0.2;
    if (this.curMoveIdx >= this.maxMoveIdx) this.curMoveIdx = 0;
  };

  this.workIdx = function () {
    this.curWorkIdx += 0.2;
    if (this.curWorkIdx >= this.maxWorkIdx) this.curWorkIdx = 0;
  };

  this.draw = function () {
    this.context.clearRect(0, 0, game.viewSizeX, game.viewSizeY);
    this.context.fillStyle = "rgba(33, 33, 33, 0.5)";
    this.context.beginPath();
    this.context.ellipse(
      this.shadowOffsetX +
        game.characterX -
        game.viewPosX +
        game.characterWidth / 2,
      this.shadowOffsetY +
        game.characterY -
        game.viewPosY +
        game.characterHeight,
      game.characterWidth / 2 + 30,
      50,
      0,
      0,
      Math.PI * 2
    );
    this.context.fill();

    //draw character
    if (game.mining) {
      this.workImage = this.moveImage.src.includes("down")
        ? imageRepository.character["work-down"]
        : imageRepository.character["work-up"];
      this.workIdx();
      this.work();
    } else {
      this.move();
    }
    //draw control
    if (game.control) {
      this.context.fillStyle = "rgba(255, 0, 0, 0.5)";
      this.context.beginPath();
      this.context.arc(
        game.controlX + game.controlOffsetX,
        game.controlY + game.controlOffsetY,
        30,
        0,
        Math.PI * 2
      );

      this.context.drawImage(
        imageRepository.control,
        game.controlX - imageRepository.control.width / 2,
        game.controlY - imageRepository.control.height / 2
      );
      this.context.fill();
    }
  };

  this.move = function () {
    if (
      KEY_STATUS.left ||
      KEY_STATUS.right ||
      KEY_STATUS.down ||
      KEY_STATUS.up ||
      game.control
    ) {
      this.moveIdx();
      if ((KEY_STATUS.left && KEY_STATUS.down) || game.direction == "DL") {
        this.moveImage = imageRepository.character["walk-down-left"];
        this.shadowOffsetX =
          this.shadowOffsetX < 30 ? this.shadowOffsetX + 1 : 30;

        if (game.movableLeft && game.movableDown) {
          game.characterX -= this.speed;
          game.characterY += this.speed;
        }
      } else if (
        (KEY_STATUS.right && KEY_STATUS.down) ||
        game.direction == "DR"
      ) {
        this.moveImage = imageRepository.character["walk-down-right"];
        this.shadowOffsetX =
          this.shadowOffsetX > -30 ? this.shadowOffsetX - 1 : -30;

        if (game.movableRight && game.movableDown) {
          game.characterX += this.speed;
          game.characterY += this.speed;
        }
      } else if ((KEY_STATUS.left && KEY_STATUS.up) || game.direction == "UL") {
        this.moveImage = imageRepository.character["walk-up-left"];

        if (game.movableLeft && game.movableUp) {
          game.characterX -= this.speed;
          game.characterY -= this.speed;
        }
        this.shadowOffsetX =
          this.shadowOffsetX < 30 ? this.shadowOffsetX + 1 : 30;
      } else if (
        (KEY_STATUS.right && KEY_STATUS.up) ||
        game.direction == "UR"
      ) {
        this.moveImage = imageRepository.character["walk-up-right"];
        this.shadowOffsetX =
          this.shadowOffsetX > -30 ? this.shadowOffsetX - 1 : -30;

        if (game.movableRight && game.movableUp) {
          game.characterX += this.speed;
          game.characterY -= this.speed;
        }
      } else if (KEY_STATUS.left || game.direction == "L") {
        this.moveImage = imageRepository.character["walk-left"];
        this.shadowOffsetX =
          this.shadowOffsetX < 30 ? this.shadowOffsetX + 1 : 30;
        if (game.movableLeft) {
          game.characterX -= this.speed;
        }
      } else if (KEY_STATUS.right || game.direction == "R") {
        this.moveImage = imageRepository.character["walk-right"];
        this.shadowOffsetX =
          this.shadowOffsetX > -30 ? this.shadowOffsetX - 1 : -30;

        if (game.movableRight) {
          game.characterX += this.speed;
        }
      } else if (KEY_STATUS.up || game.direction == "U") {
        this.moveImage = imageRepository.character["walk-up"];

        if (game.movableUp) {
          game.characterY -= this.speed;
        }
      } else if (KEY_STATUS.down || game.direction == "D") {
        this.moveImage = imageRepository.character["walk-down"];

        if (game.movableDown) {
          game.characterY += this.speed;
        }
      } else this.shadowOffsetX = 0;
    }

    let dx = game.characterX - game.viewSizeX / 2 - game.viewPosX;
    let dy = game.characterY - game.viewSizeY / 2 - game.viewPosY;

    game.viewPosX += dx / 5;
    game.viewPosY += dy / 5;

    this.context.drawImage(
      this.moveImage,
      this.moveSx() * 150,
      this.moveSy() * 160,
      150,
      160,
      game.characterX - game.viewPosX - 75,
      game.characterY - game.viewPosY - 80,
      game.characterWidth + 150,
      game.characterHeight + 160
    );
  };

  this.work = function () {
    this.context.drawImage(
      this.workImage,
      this.workSx() * 187,
      0,
      187,
      188,
      game.characterX - game.viewPosX - 187 / 2,
      game.characterY - game.viewPosY - 188 / 2,
      game.characterWidth + 187,
      game.characterHeight + 188
    );
  };
}
Character.prototype = new Drawable();

function Islands() {
  const respawnDelay = 8000; // Delay for jewel respawn (in milliseconds)
  this.jewelMoveSpeed = 0;
  this.touchedJewelId = null;
  this.insideBridge = null;
  this.timer = 0;
  this.minValue = 0;
  // Fade-out properties
  this.fadeOutDuration = 250; // Duration for fade-out in milliseconds
  this.fadeOutStartTime = null; // Tracks when fade-out starts
  this.bridgeStatusSize = 300;

  this.drawParticles = function () {
    if (game.curMintJewel !== null) {
      game.curMintJewel = game.curMintJewel.filter(
        (curMintJewel) => curMintJewel.pieces.length
      );

      game.curMintJewel.forEach((curMintJewel) => {
        curMintJewel.pieces.forEach((piece, id) => {
          piece.speed = piece.speed < 2 ? piece.speed + 0.03 : piece.speed;
          let dx = 0;
          let dy = 0;
          let targetX = piece.motion[piece.curMotionId].targetX;
          let targetY = piece.motion[piece.curMotionId].targetY;

          if (
            piece.motion[piece.curMotionId].type &&
            piece.motion[piece.curMotionId].type === "absolute"
          ) {
            targetX = game.viewPosX + piece.motion[piece.curMotionId].targetX;
            targetY = game.viewPosY + piece.motion[piece.curMotionId].targetY;
            dx = ((targetX - piece.x) / 50) * Math.log(piece.speed);
            dy = ((targetY - piece.y) / 50) * Math.log(piece.speed);
          } else {
            dx = ((targetX - piece.x) / 50) * Math.log(piece.speed);
            dy = ((targetY - piece.y) / 50) * Math.log(piece.speed);
          }
          if (
            Math.abs(piece.x - targetX) > 5 &&
            Math.abs(piece.y - targetY) > 5
          ) {
          } else {
            if (piece.curMotionId === piece.motion.length - 1) {
              if (curMintJewel.isBridge) {
                game.islandData[curMintJewel.id.islandId].bridges[
                  curMintJewel.id.bridgeId
                ].animationStarted = false;
                game.islandData[curMintJewel.id.islandId].bridges[
                  curMintJewel.id.bridgeId
                ].value -= piece.amount;
              } else if (curMintJewel.isFactory) {
                game.islandData[
                  curMintJewel.id.islandId
                ].factory.chargingJewel = false;
                game.islandData[
                  curMintJewel.id.islandId
                ].factory.chargedValue += piece.amount;
              }
              curMintJewel.pieces.splice(id, 1);
              game.ownedJewel[curMintJewel.type] = curMintJewel.isMint
                ? game.ownedJewel[curMintJewel.type] + piece.amount
                : game.ownedJewel[curMintJewel.type] - piece.amount;
            } else {
              piece.curMotionId++;
            }
          }

          piece.x += dx;
          piece.y += dy;

          let x = piece.x - game.viewPosX;
          let y = piece.y - game.viewPosY;

          if (
            piece.motion[piece.curMotionId].type &&
            piece.motion[piece.curMotionId].type === "absolute"
          ) {
            // x = piece.x;
            // y = piece.y;
            // x = game.characterX - game.viewSizeX/2 + piece.x;
            // y = game.characterY - game.viewSizeY/2 + piece.y;
            // x = game.characterX - game.viewPosX;
            // y = game.characterY - game.viewPosY;
            // x = game.characterX - game.viewPosX - 75 - game.viewSizeX/2;
            // y = game.characterY - game.viewPosY - 80 - game.viewSizeY/2;
          }

          this.context.drawImage(
            imageRepository.particles[curMintJewel.type],
            0,
            0,
            imageRepository.particles[curMintJewel.type].width,
            imageRepository.particles[curMintJewel.type].height,
            x,
            y,
            piece.width,
            piece.height
          );
          let text = curMintJewel.isMint
            ? "+" + curMintJewel.totalAmount
            : "-" + curMintJewel.totalAmount;

          if (curMintJewel.pieces.length) {
            this.context.font = "bold 60px Arial";
            this.context.fillStyle = "black";
            this.context.strokeStyle = "white";
            this.context.lineWidth = 5;
            this.context.strokeText(
              text,
              curMintJewel.x - game.viewPosX,
              curMintJewel.y - game.viewPosY
            );
            this.context.fillText(
              text,
              curMintJewel.x - game.viewPosX,
              curMintJewel.y - game.viewPosY
            );
            this.context.drawImage(
              imageRepository.status[curMintJewel.type],
              0,
              0,
              imageRepository.status[curMintJewel.type].width,
              imageRepository.status[curMintJewel.type].height,
              curMintJewel.x - game.viewPosX,
              curMintJewel.y - game.viewPosY,
              80,
              80
            );
            // this.context.globalAlpha = 1;
          }
        });
      });
    }
  };

  this.drawJewel = function (island, x, y, jewel) {
    this.context.drawImage(
      imageRepository.jewel[island.jewelType],
      0,
      0,
      imageRepository.jewel[island.jewelType].width,
      imageRepository.jewel[island.jewelType].height,
      x,
      y,
      jewel.width,
      jewel.height
    );
  };

  this.drawFactory = function (island, xD, yD, xR, yR, down, right) {
    this.context.drawImage(
      imageRepository.factory[island.factory.type],
      0,
      0,
      imageRepository.factory[island.factory.type].width,
      imageRepository.factory[island.factory.type].height,
      island.x + island.factory.x - game.viewPosX,
      island.y + island.factory.y - game.viewPosY,
      island.factory.width,
      island.factory.height
    );

    island.factory.type !== "barn" &&
      this.context.drawImage(
        imageRepository.status[island.factory.type],
        0,
        0,
        imageRepository.status[island.factory.type].width,
        imageRepository.status[island.factory.type].height,
        island.x +
          island.factory.x +
          island.factory.width / 2 -
          game.viewPosX -
          50,
        island.y +
          island.factory.y +
          island.factory.height / 2 -
          game.viewPosY -
          50,
        100,
        100
      );

    this.context.font = "bold 60px Arial";
    this.context.fillStyle = "black";
    this.context.strokeStyle = "white";
    this.context.lineWidth = 2;
    let offsetX = -17 * island.factory.chargedValue.toString().length;
    // let offsetX = -20;

    island.factory.type !== "barn" &&
      this.context.fillText(
        parseInt(island.factory.chargedValue),
        island.x +
          island.factory.x +
          island.factory.width / 2 -
          game.viewPosX +
          offsetX,
        island.y +
          island.factory.y +
          island.factory.height / 2 -
          game.viewPosY +
          100
      );
    island.factory.type !== "barn" &&
      this.context.strokeText(
        parseInt(island.factory.chargedValue),
        island.x +
          island.factory.x +
          island.factory.width / 2 -
          game.viewPosX +
          offsetX,
        island.y +
          island.factory.y +
          island.factory.height / 2 -
          game.viewPosY +
          100
      );

    island.factory.rectSize =
      island.factory.rectSize > island.factory.rectMinSize
        ? island.factory.rectSize - 0.5
        : island.factory.rectMaxSize;
    let strokeStyle = down ? "yellow" : "white";
    //draw down rect
    drawRoundedRect(
      this.context,
      xD - game.viewPosX,
      yD - game.viewPosY,
      island.factory.rectMaxSize,
      island.factory.rectMaxSize,
      20,
      strokeStyle,
      10
    );

    drawRoundedRect(
      this.context,
      xD -
        (island.factory.width / 2 - island.factory.rectMaxSize / 2) +
        (island.factory.width / 2 - island.factory.rectSize / 2) -
        game.viewPosX,
      yD -
        (island.factory.height + island.factory.rectMaxSize / 2) +
        (island.factory.height +
          island.factory.rectMaxSize -
          island.factory.rectSize / 2) -
        game.viewPosY,
      island.factory.rectSize,
      island.factory.rectSize,
      20,
      strokeStyle,
      10
    );
    island.factory.rectSizeR =
      island.factory.rectSize < island.factory.rectMaxSize
        ? island.factory.rectSizeR + 0.5
        : island.factory.rectMinSize;
    //draw right rect
    strokeStyle = right ? "yellow" : "white";
    island.factory.type !== "barn" &&
      drawRoundedRect(
        this.context,
        xR - game.viewPosX,
        yR - game.viewPosY,
        island.factory.rectMaxSize,
        island.factory.rectMaxSize,
        20,
        strokeStyle,
        10
      );

    island.factory.type !== "barn" &&
      drawRoundedRect(
        this.context,
        island.x +
          island.factory.x +
          (island.factory.width + 250 - island.factory.rectSizeR / 2) -
          game.viewPosX,
        island.y +
          island.factory.y +
          (island.factory.height / 2 + 50 - island.factory.rectSizeR / 2) -
          game.viewPosY,
        island.factory.rectSizeR,
        island.factory.rectSizeR,
        20,
        strokeStyle,
        10
      );

    if (island.factory.chargedValue) {
      // console.log("island.factory.curPercent", island.factory.curPercent);
      if (island.factory.curPercent > 300) {
        island.factory.curPercent = 0;
        if (island.factory.chargedValue > 0) {
          let mint = Array.from(
            {
              length: Math.min(
                island.factory.chargedValue,
                island.factory.perCharge
              ),
            },
            (el) => ({
              x: parseInt(xD + 50),
              y: yR,
              targetX: parseInt(xR + Math.random() * 200 - 100),
              targetY: parseInt(yR + Math.random() * 200 - 100),
              targetH: parseInt(Math.random() * 50 + 150),
              t: 0,
            })
          );
          island.factory.mint = [...island.factory.mint, ...mint];
          // island.factory.chargedValue -= Math.min(
          //   island.factory.chargedValue,
          //   island.factory.perCharge
          // );
          island.factory.chargedValue -= 1;
        }
      } else {
        island.factory.curPercent += 2.5;
      }

      this.context.fillStyle = "white";
      drawRoundedRect(
        this.context,
        xD - game.viewPosX - 50,
        island.y +
          island.factory.y +
          island.factory.height / 2 -
          game.viewPosY +
          200,
        300,
        40,
        20,
        "black",
        25
      );
      this.context.fill();
      this.context.fillStyle = "#fe38b5";
      drawRoundedRect(
        this.context,
        xD - game.viewPosX - 50,
        island.y +
          island.factory.y +
          island.factory.height / 2 -
          game.viewPosY +
          200,
        island.factory.curPercent,
        40,
        20,
        "none",
        0
      );
      this.context.fill();
    }

    island.factory.mint.length &&
      island.factory.mint.forEach((money) => {
        let dx = money.targetX - money.x;
        let dy = money.targetY - money.y;
        let tTotal = 80;

        let x = money.x + (dx / tTotal) * money.t;
        let y = money.y + (dy / tTotal) * money.t;

        x = x < money.targetX ? x : money.targetX;
        y = x < money.targetX ? y : money.targetY;
        money.t += 1;
        this.context.drawImage(
          imageRepository.particles["money"],
          0,
          0,
          imageRepository.particles["money"].width,
          imageRepository.particles["money"].height,
          x - game.viewPosX,
          y - game.viewPosY,
          120,
          120
        );
      });
  };

  this.drawIsland = function (island) {
    this.context.drawImage(
      imageRepository.island,
      0,
      0,
      imageRepository.island.width,
      imageRepository.island.height,
      island.x - game.viewPosX,
      island.y - game.viewPosY,
      imageRepository.island.width,
      imageRepository.island.height
    );
  };

  this.drawTree = function (x, y) {
    this.context.drawImage(
      imageRepository.tree,
      0,
      0,
      imageRepository.tree.width,
      imageRepository.tree.height,
      x,
      y,
      game.treeWidth,
      game.treeHeight
    );
  };

  this.draw = function () {
    this.data.forEach((island, islandId) => {
      // Initialize movement flags
      let movementFlags = {
        movableUp: true,
        movableDown: true,
        movableLeft: true,
        movableRight: true,
      };

      let collisionJewel;
      let insideIsland;
      let collisionTree;

      // Helper function to update movement flags
      const updateMovementFlags = (conditions) => {
        conditions.forEach((condition) => {
          movementFlags.movableRight =
            movementFlags.movableRight && condition.right;
          movementFlags.movableDown =
            movementFlags.movableDown && condition.down;
          movementFlags.movableLeft =
            movementFlags.movableLeft && condition.left;
          movementFlags.movableUp = movementFlags.movableUp && condition.up;
        });
      };

      // Draw the island
      this.drawIsland(island);
      if (island.factory) {
        let collisionDownRect;
        let collisionRightRect;
        let xD =
          island.x +
          island.factory.x +
          (island.factory.width / 2 - island.factory.rectMaxSize / 2);
        let yD =
          island.y +
          island.factory.y +
          (island.factory.height + island.factory.rectMaxSize / 2);
        if (island.factory.isDown) yD -= 900;
        let xR =
          island.x +
          island.factory.x +
          (island.factory.width + 250 - island.factory.rectMaxSize / 2);
        let yR =
          island.y +
          island.factory.y +
          (island.factory.height / 2 + 50 - island.factory.rectMaxSize / 2);
        collisionDownRect = checkCollision(
          game.characterX,
          game.characterY,
          xD,
          yD,
          game.characterWidth,
          island.factory.rectMaxSize,
          game.characterHeight,
          island.factory.rectMaxSize
        );

        collisionRightRect = checkCollision(
          game.characterX,
          game.characterY,
          xR,
          yR,
          game.characterWidth,
          island.factory.rectMaxSize,
          game.characterHeight,
          island.factory.rectMaxSize
        );

        collisionFactory = checkCollision(
          game.characterX,
          game.characterY,
          island.factory.x + island.x - 300,
          island.factory.y + island.y,
          game.characterWidth,
          island.factory.width + 600,
          game.characterHeight,
          island.factory.height
        );

        collisionDownRect =
          !collisionDownRect.up ||
          !collisionDownRect.down ||
          !collisionDownRect.left ||
          !collisionDownRect.right;
        collisionRightRect =
          !collisionRightRect.up ||
          !collisionRightRect.down ||
          !collisionRightRect.left ||
          !collisionRightRect.right;
        if (
          collisionDownRect &&
          !island.factory.chargingJewel &&
          !game.curMintJewel.some((jewel) => jewel.isFactory)
        ) {
          if (island.factory.type === "barn") game.isFinished = true;
          island.factory.chargingJewel = true;
          let minValue = game.ownedJewel[island.factory.type];
          if (minValue > 0) {
            console.log("Animation Started", minValue);
            let newMintJewel = {
              id: { islandId },
              isFactory: true,
              isMint: false,
              type: island.factory.type,
              index: 0,
              x: xD + island.factory.rectMaxSize / 2,
              y: yD + island.factory.rectMaxSize / 2,
              totalAmount: minValue,
              pieces: generateRandomArrayWithLength(
                minValue,
                Math.min(minValue, 8)
              ).map((amount) => {
                let size = parseInt(Math.random() * 50 + 50);
                return {
                  x: xD,
                  y: yD,
                  speed: 1,
                  width: size,
                  height: size,
                  amount: amount,
                  curMotionId: 0,
                  motion: [
                    {
                      type: "relative",
                      targetX:
                        parseInt(
                          (Math.random() * 100 + 200) * (Math.random() * 2 - 1)
                        ) +
                        xD +
                        100,
                      targetY:
                        parseInt(
                          (Math.random() * 100 + 200) * (Math.random() * 2 - 1)
                        ) +
                        yD +
                        100,
                    },
                    {
                      type: "relative",
                      targetX:
                        island.x + island.factory.x + island.factory.width / 2,
                      targetY:
                        island.y + island.factory.y + island.factory.height / 2,
                    },
                  ],
                };
              }),
            };
            game.curMintJewel =
              game.curMintJewel !== null
                ? [...game.curMintJewel, newMintJewel]
                : [newMintJewel];
          } else {
            island.factory.chargingJewel = false;
          }
        }
        // console.log("island.factory.mint", island.factory.mint);
        if (
          collisionRightRect &&
          island.factory.mint.some((mint) => mint.t > 80)
        ) {
          let mintMoney = island.factory.mint.filter((mint) => mint.t > 80);

          island.factory.mint = island.factory.mint.filter(
            (mint) => mint.t < 80
          );

          let newMintJewel = {
            isMint: true,
            x: xR + island.factory.rectMaxSize / 2,
            y: yR + island.factory.rectMaxSize / 2,
            totalAmount: mintMoney.length,
            type: "money",
            index: 0,
            pieces: mintMoney.map((money, i) => {
              let size = 120;
              return {
                x: money.targetX,
                y: money.targetY,
                speed: 1,
                width: size,
                height: size,
                amount: 1,
                curMotionId: 0,
                motion: [
                  {
                    type: "relative",
                    targetX: money.targetX + 50,
                    targetY: money.targetY + 50,
                  },
                  {
                    type: "absolute",
                    targetX: 0,
                    targetY:
                      Object.keys(game.ownedJewel).indexOf("money") * 100,
                    delay: 3000,
                  },
                ],
              };
            }),
          };

          game.curMintJewel =
            game.curMintJewel !== null
              ? [...game.curMintJewel, newMintJewel]
              : [newMintJewel];
        }

        if (islandId === game.curIslandId)
          updateMovementFlags([collisionFactory]);
        this.drawFactory(
          island,
          xD,
          yD,
          xR,
          yR,
          collisionDownRect,
          collisionRightRect
        );
      }
      let hole = { up: false, left: false, right: false, down: false };
      if (island.bridges) {
        island.bridges.forEach((bridge, bridgeId) => {
          let type =
            bridge.direction == "left" || bridge.direction == "right"
              ? "horizontal"
              : "vertical";
          bridge.width = imageRepository.bridge[type].width;
          bridge.height = imageRepository.bridge[type].height;

          switch (bridge.direction) {
            case "up":
              bridge.x = island.x + island.width / 2 - bridge.width / 2;
              bridge.y = island.y - bridge.height;
              bridge.statusX = bridge.x + bridge.width / 2;
              bridge.statusY = bridge.y + bridge.height + 200;
              break;
            case "down":
              bridge.x = island.x + island.width / 2 - bridge.width / 2;
              bridge.y = island.y + island.height;
              bridge.statusX = bridge.x + bridge.width / 2;
              bridge.statusY = bridge.y - 200;
              break;
            case "left":
              bridge.x = island.x - bridge.width;
              bridge.y = island.y + island.height / 2 - bridge.height / 2;
              bridge.statusX = bridge.x + bridge.width + 200;
              bridge.statusY = bridge.y + bridge.height / 2;
              break;
            case "right":
              bridge.x = island.x + island.width;
              bridge.y = island.y + island.height / 2 - bridge.height / 2;
              bridge.statusX = bridge.x - 200;
              bridge.statusY = bridge.y + bridge.height / 2;
              break;
            default:
              bridge.x = 0;
              bridge.y = 0;
              break;
          }

          // console.log("value", bridge.value)
          if (bridge.value > 0) {
            // console.log("bridge.statusX", bridge.statusX, bridge.statusY);
            const collisionTrigger = checkCollision(
              game.characterX,
              game.characterY,
              bridge.statusX - this.bridgeStatusSize / 2,
              bridge.statusY - this.bridgeStatusSize / 2,
              game.characterWidth,
              this.bridgeStatusSize,
              game.characterHeight,
              this.bridgeStatusSize
            );

            let strokeStyle;
            let minValue;

            const { up, down, left, right } = collisionTrigger;

            // console.log("length:", game.curMintJewel && game.curMintJewel.length);

            if (![up, down, left, right].every(Boolean)) {
              strokeStyle = "red";
              minValue = Math.min(game.ownedJewel[bridge.type], bridge.value);

              // Call console.log only once while minValue is non-zero
              if (
                minValue !== 0 &&
                !bridge.animationStarted &&
                !game.curMintJewel.some((jewel) => jewel.isBridge)
              ) {
                console.log("Animation Started");
                bridge.animationStarted = true; // Prevent further logs
                let newMintJewel = {
                  id: { islandId, bridgeId },
                  x: bridge.statusX - 50,
                  y: bridge.statusY + 50,
                  totalAmount: minValue,
                  isBridge: true,
                  isMint: false,
                  type: bridge.type,
                  index: 0,
                  pieces: generateRandomArrayWithLength(
                    minValue,
                    Math.min(minValue, 8)
                  ).map((amount) => {
                    let size = parseInt((500 * amount) / minValue);
                    return {
                      x: bridge.statusX - 50,
                      y: bridge.statusY - 50,
                      speed: 1,
                      width: size,
                      height: size,
                      amount: amount,
                      curMotionId: 0,
                      motion: [
                        {
                          targetX:
                            parseInt(
                              (Math.random() * 100 + 200) *
                                (Math.random() * 2 - 1)
                            ) +
                            bridge.statusX +
                            100,
                          targetY:
                            parseInt(
                              (Math.random() * 100 + 200) *
                                (Math.random() * 2 - 1)
                            ) +
                            bridge.statusY +
                            50,
                        },
                        {
                          targetX: bridge.statusX - 50,
                          targetY: bridge.statusY - 50,
                        },
                      ],
                    };
                  }),
                };
                game.curMintJewel =
                  game.curMintJewel !== null
                    ? [...game.curMintJewel, newMintJewel]
                    : [newMintJewel];
              }
            } else {
              strokeStyle = "white";
            }

            // Reset the flag if minValue becomes 0
            if (minValue === 0) {
              bridge.animationStarted = false;
            }

            drawRoundedRect(
              this.context,
              bridge.statusX - this.bridgeStatusSize / 2 - game.viewPosX,
              bridge.statusY - this.bridgeStatusSize / 2 - game.viewPosY,
              this.bridgeStatusSize,
              this.bridgeStatusSize,
              20,
              strokeStyle,
              10
            );

            this.context.drawImage(
              imageRepository.status[bridge.type],
              0,
              0,
              imageRepository.status[bridge.type].width,
              imageRepository.status[bridge.type].height,
              bridge.statusX -
                imageRepository.status[bridge.type].width / 2 -
                game.viewPosX,
              bridge.statusY -
                imageRepository.status[bridge.type].height / 2 -
                game.viewPosY,
              imageRepository.status[bridge.type].width,
              imageRepository.status[bridge.type].height
            );

            this.context.font = "bold 60px Arial";
            this.context.fillStyle = "white";
            this.context.strokeStyle = strokeStyle;
            this.context.lineWidth = 2;
            let offsetX = -17 * bridge.value.toString().length;
            this.context.fillText(
              parseInt(bridge.value),
              bridge.statusX - game.viewPosX + offsetX,
              bridge.statusY - 50 - game.viewPosY
            );
            this.context.strokeText(
              parseInt(bridge.value),
              bridge.statusX - game.viewPosX + offsetX,
              bridge.statusY - 50 - game.viewPosY
            );
          }

          if (bridge.value === 0) {
            bridge.type !== "none" &&
              this.context.drawImage(
                imageRepository.bridge[type],
                0,
                0,
                imageRepository.bridge[type].width,
                imageRepository.bridge[type].height,
                bridge.x - game.viewPosX,
                bridge.y - game.viewPosY,
                bridge.width,
                bridge.height
              );
            hole[bridge.direction] = true;
          }
        });
      }
      if (
        isInside(
          island.x,
          island.y,
          game.characterX,
          game.characterY,
          island.width,
          game.characterWidth,
          island.height,
          game.characterHeight
        )
      )
        game.curIslandId = islandId;

      insideIsland = checkInside(
        island.x,
        island.y,
        game.characterX,
        game.characterY,
        island.width,
        game.characterWidth,
        island.height,
        game.characterHeight,
        {
          size: imageRepository.bridge["vertical"].width,
          length: imageRepository.bridge["vertical"].height,
          direction: hole,
        }
      );
      if (islandId === game.curIslandId) updateMovementFlags([insideIsland]);
      // if (insideIsland.out.right || insideIsland.out.left||insideIsland.out.up||insideIsland.out.down)
      // game.onBridge = insideIsland;

      // console.log("game.onBridge", islandId, game.onBridge);
      // Helper function to calculate the distance between two points
      const calculateDistance = (x1, y1, x2, y2) => {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      };

      // Modified function to respawn a jewel after removal, now with position condition
      const respawnJewel = (x, y, lifecycle) => {
        const checkAndRespawn = () => {
          // Calculate the distance between the character and the jewel's respawn point
          const distance = calculateDistance(
            game.characterX,
            game.characterY,
            x,
            y
          );

          // Only respawn if the character is farther than 500 units away
          if (distance > 500) {
            island.jewels.push(
              game.initJewel(
                x,
                y,
                0.5 * game.jewelWidth,
                0.5 * game.jewelHeight,
                lifecycle
              )
            );
          } else {
            // If the character is too close, check again after a short delay
            setTimeout(checkAndRespawn, 1000); // Re-check every second
          }
        };

        // Start the respawn process after the initial respawn delay
        setTimeout(checkAndRespawn, respawnDelay);
      };

      // Process jewels and check collisions
      island.jewelType !== "none" &&
        island.jewels &&
        island.jewels.forEach((jewel, i) => {
          const jewelX = island.x + jewel.x;
          const jewelY = island.y + jewel.y;

          // Check collision with character
          collisionJewel = checkCollision(
            game.characterX,
            game.characterY,
            jewelX,
            jewelY,
            game.characterWidth,
            game.jewelWidth,
            game.characterHeight,
            game.jewelHeight
          );

          // Update movement flags based on collisions
          if (islandId === game.curIslandId)
            updateMovementFlags([collisionJewel]);
          // Handle jewel touching logic
          if (
            (!collisionJewel.up ||
              !collisionJewel.down ||
              !collisionJewel.left ||
              !collisionJewel.right) &&
            !jewel.isFadingOut
          ) {
            game.mining = true;
            this.touchedJewelId = i;
            this.jewelMoveSpeed += 0.04;
            if (!jewel.touched) {
              jewel.touched = true;
              jewel.touchStartTime = Date.now(); // Start tracking touch time
              jewel.totalTouchedTime = jewel.totalTouchedTime || 0; // Initialize total touch time
            } else {
              // Accumulate the touch time
              let currentTouchTime = Date.now() - jewel.touchStartTime;
              jewel.totalTouchedTime += currentTouchTime;
              jewel.touchStartTime = Date.now(); // Reset start time for the next check

              // Remove the jewel if it has been touched for longer than its lifecycle
              if (jewel.totalTouchedTime >= jewel.lifecycle) {
                jewel.fadeOutAlpha = 1; // Start fade-out with full opacity
                jewel.isFadingOut = true; // Set fading out state
                jewel.touched = false;
                this.touchedJewelId = null;
                this.jewelMoveSpeed = 0;
                game.mining = false;

                // Start fade out process
                this.fadeOutStartTime = Date.now();
                return; // Skip the rest of the loop for this jewel since it's marked for fade out
              }
            }
          } else {
            // If the jewel was touched but is no longer being touched, stop tracking
            if (jewel.touched) {
              jewel.touched = false;
              let currentTouchTime = Date.now() - jewel.touchStartTime;
              jewel.totalTouchedTime += currentTouchTime; // Accumulate total touch time

              this.jewelMoveSpeed = 0;
              this.touchedJewelId = null;
              game.mining = false;
            }
          }

          // Draw the jewel
          if (jewel.isFadingOut) {
            const elapsedTime = Date.now() - this.fadeOutStartTime;
            const fadeOutProgress = elapsedTime / this.fadeOutDuration;
            jewel.fadeOutAlpha = Math.max(0, 1 - fadeOutProgress); // Calculate current alpha

            // Remove the jewel after it fades out
            if (jewel.fadeOutAlpha === 0) {
              const removedJewelPosition = {
                x: jewel.x,
                y: jewel.y,
                lifecycle: jewel.lifecycle,
              }; // Store position
              island.jewels.splice(i, 1); // Remove the jewel
              this.touchedJewelId = null;
              this.jewelMoveSpeed = 0;
              game.mining = false;
              // Respawn the jewel after a delay
              respawnJewel(
                removedJewelPosition.x,
                removedJewelPosition.y,
                removedJewelPosition.lifecycle
              );

              let mintAmount;
              switch (island.jewelType) {
                case "ruby-mine":
                  mintAmount = parseInt(Math.random() * 4 + 8);
                  break;
                case "emerald-mine":
                  mintAmount = parseInt(Math.random() * 10 + 60);
                  break;
                case "amethyst-mine":
                  mintAmount = parseInt(Math.random() * 20 + 100);
                  break;
                default:
                  break;
              }

              let newMintJewel = {
                isMint: true,
                type: island.jewelType.split("-")[0],
                index: 0,
                alpha: 1,
                totalAmount: mintAmount,
                x: island.x + jewel.x + game.jewelWidth - jewel.width / 2,
                y: island.y + jewel.y + game.jewelHeight - jewel.height / 2,
                pieces: Array(mintAmount)
                  .fill()
                  .map((_, i) => {
                    let size = parseInt(Math.random() * 50 + 50);
                    let randomX =
                      parseInt(
                        (Math.random() * 50 + 100) * (Math.random() * 2 - 1)
                      ) +
                      island.x +
                      jewel.x +
                      game.jewelWidth -
                      jewel.width / 2;
                    let randomY =
                      parseInt(
                        (Math.random() * 50 + 100) * (Math.random() * 2 - 1)
                      ) +
                      island.y +
                      jewel.y +
                      game.jewelHeight -
                      jewel.height / 2;
                    return {
                      x: island.x + jewel.x + game.jewelWidth - jewel.width / 2,
                      y:
                        island.y +
                        jewel.y +
                        game.jewelHeight -
                        jewel.height / 2,
                      speed: 1,
                      width: size,
                      height: size,
                      amount: 1,
                      curMotionId: 0,
                      motion: [
                        {
                          type: "relative",
                          targetX: randomX,
                          targetY: randomY,
                        },
                        {
                          type: "relative",
                          targetX: randomX + 50,
                          targetY: randomY + 50,
                        },
                        {
                          type: "absolute",
                          targetX: 0,
                          targetY:
                            Object.keys(game.ownedJewel).indexOf(
                              island.jewelType.split("-")[0]
                            ) * 100,
                          delay: 3000,
                        },
                      ],
                    };
                  }),
              };

              game.curMintJewel =
                game.curMintJewel !== null
                  ? [...game.curMintJewel, newMintJewel]
                  : [newMintJewel];
              return; // Skip the rest of the loop for this jewel since it's removed
            }
          }

          jewel.width =
            jewel.width < game.jewelWidth
              ? (jewel.width += game.jewelWidth * 0.005)
              : game.jewelWidth;
          jewel.height =
            jewel.height < game.jewelHeight
              ? (jewel.height += game.jewelHeight * 0.005)
              : game.jewelHeight;
          let x =
            i === this.touchedJewelId
              ? island.x -
                game.viewPosX +
                jewel.x +
                15 * Math.sin(this.jewelMoveSpeed)
              : island.x -
                game.viewPosX +
                jewel.x +
                game.jewelWidth / 2 -
                jewel.width / 2;
          let y =
            island.y -
            game.viewPosY +
            jewel.y +
            game.jewelHeight / 2 -
            jewel.height / 2;

          // Set the global alpha value for the context before drawing
          this.context.globalAlpha = jewel.isFadingOut ? jewel.fadeOutAlpha : 1;

          this.drawJewel(island, x, y, jewel);

          // Reset the alpha for subsequent drawings
          this.context.globalAlpha = 1;
        });
      island.trees &&
        island.trees.forEach((tree) => {
          const treeX = island.x + tree.x;
          const treeY = island.y + tree.y;

          collisionTree = checkCollision(
            game.characterX,
            game.characterY,
            treeX,
            treeY,
            game.characterWidth,
            game.treeWidth,
            game.characterHeight,
            game.treeHeight
          );
          updateMovementFlags([collisionTree]);

          let x = island.x - game.viewPosX + tree.x;
          let y = island.y - game.viewPosY + tree.y;

          this.drawTree(x, y);
        });
      // Update game's movement flags based on the results of collisionJewels
      this.drawParticles();

      if (islandId === game.curIslandId) Object.assign(game, movementFlags);
    });

    // Allow character to move even while touching a jewel or during fade-out
    game.character.move();
  };
}
Islands.prototype = new Drawable();

function Status() {
  this.showScoreAlpha = 1;
  this.showScoreY = 0;

  this.init = function (x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  };
  this.mintJewelMotion = [
    {
      type: "linear",
      targetX: game.viewSizeX / 2,
      targetY: game.viewSizeY / 2,
      delay: 3000,
    },
  ];
  this.curMotionId = 0;
  this.oneComplete = false;

  this.drawJewelStatus = function (jewel, x, y) {
    this.context.globalAlpha = 1;
    this.context.drawImage(
      imageRepository.status[jewel],
      0,
      0,
      imageRepository.status[jewel].width,
      imageRepository.status[jewel].height,
      x,
      y,
      100,
      100
    );

    this.context.font = "bold 60px Arial";
    this.context.fillStyle = "black";
    this.context.strokeStyle = "white";
    this.context.lineWidth = 5;
    this.context.strokeText(parseInt(game.ownedJewel[jewel]), x + 100, y + 70);
    this.context.fillText(parseInt(game.ownedJewel[jewel]), x + 100, y + 70);
    // console.log("fill", game.ownedJewel[jewel]);
  };

  this.drawMint = function () {
    if (game.curMintJewel) {
      this.showScoreAlpha -= 0.01;
      this.showScoreY += 1;
      this.context.globalAlpha = this.showScoreAlpha;
      this.context.drawImage(
        imageRepository.status[game.curMintJewel.type],
        0,
        0,
        imageRepository.status[game.curMintJewel.type].width,
        imageRepository.status[game.curMintJewel.type].height,
        game.characterX - game.viewPosX + game.characterWidth / 4,
        game.characterY -
          game.viewPosY -
          game.characterHeight -
          this.showScoreY,
        100,
        100
      );

      this.context.globalAlpha = 1;
    }
  };

  this.draw = function () {
    // this.context.beginPath();
    this.context.fillStyle = "red";
    this.context.clearRect(0, 0, game.viewSizeX, game.viewSizeY);
    Object.keys(game.ownedJewel).forEach((key, index) => {
      this.drawJewelStatus(key, 0, 100 * index);
    });
    // this.drawMint();
  };
}
Status.prototype = new Drawable();

function Game() {
  this.SizeX = 5000;
  this.SizeY = 5000;
  this.characterX = Math.random() * 1000;
  this.characterY = Math.random() * 1000;
  this.characterWidth = 80;
  this.characterHeight = 120;
  this.viewSize = 1200;
  this.viewPosX = 0;
  this.viewPosY = 0;
  this.movableUp = true;
  this.movableDown = true;
  this.movableLeft = true;
  this.movableRight = true;
  this.controlOffsetX = 0;
  this.controlOffsetY = 0;
  this.control = false;
  this.controlAngle = 0;
  this.controlRadius = 0;
  this.direction = null;
  this.jewelWidth = 250;
  this.jewelHeight = 330;
  this.mining = false;
  this.curMintJewel = [];
  this.onBridge = null;
  this.treeWidth = 350;
  this.treeHeight = 500;
  this.ownedJewel = {
    ruby: 0,
    emerald: 0,
    amethyst: 0,
    money: 0,
  };

  this.initJewel = function (x, y, width, height, lifecycle) {
    return {
      x: x,
      y: y,
      width: width,
      height: height,
      lifecycle: lifecycle, // Total lifecycle time in milliseconds
      touched: false, // Tracks if the jewel was touched
      touchedTime: null, // Time when it was first touched
      touchElapsedTime: 0, // Total time jewel has been touched
    };
  };
  this.generateJewelArray = function (
    numJewels,
    xStart,
    yStart,
    xRange,
    yRange,
    minLifecycle,
    maxLifecycle
  ) {
    const jewels = [];

    // Helper function to check if two jewels overlap
    const isOverlapping = (x1, y1, x2, y2, width, height) => {
      return (
        x1 < x2 + width &&
        x1 + width > x2 &&
        y1 < y2 + height &&
        y1 + height > y2
      );
    };

    for (let i = 0; i < numJewels; i++) {
      let x, y, isValidPosition;

      do {
        // Generate random x and y positions within bounds
        x = xStart + Math.floor(Math.random() * (xRange - this.jewelWidth));
        y = yStart + Math.floor(Math.random() * (yRange - this.jewelHeight));

        // Check if the new jewel overlaps with any existing jewels
        isValidPosition = jewels.every(
          (jewel) =>
            !isOverlapping(
              x,
              y,
              jewel.x,
              jewel.y,
              this.jewelWidth,
              this.jewelHeight
            )
        );
      } while (!isValidPosition); // Retry if overlapping occurs

      // Random lifecycle between minLifecycle and maxLifecycle (in milliseconds)
      const lifecycle =
        Math.random() * (maxLifecycle - minLifecycle) + minLifecycle;

      // Add the new jewel with random position and lifecycle
      jewels.push(
        this.initJewel(x, y, this.jewelWidth, this.jewelHeight, lifecycle)
      );
    }

    return jewels;
  };
  this.islandData = [
    {
      id: 1,
      x: 0,
      y: 0,
      width: 1800,
      height: 1800,
      jewelType: "ruby-mine",
      trees: [
        {
          x: 1200,
          y: 100,
        },
        {
          x: 100,
          y: 1000,
        },
      ],
      bridges: [
        {
          type: "ruby",
          value: 35,
          // value: 0,
          direction: "up",
        },
        {
          type: "emerald",
          value: 200,
          // value: 0,
          direction: "right",
        },
        {
          type: "amethyst",
          value: 385,
          // value: 0,
          direction: "down",
        },
      ],
      jewels: (initialJewels = this.generateJewelArray(
        6,
        300,
        300,
        1200,
        1200,
        4000,
        5000
      )),
    },
    {
      id: 2,
      x: 0,
      y: -1800 - 1375,
      width: 1800,
      height: 1800,
      jewelType: "emerald-mine",
      factory: {
        type: "ruby",
        curPercent: 0,
        chargedValue: 0,
        perCharge: 1,
        mint: [],
        x: 450,
        y: -100,
        width: 800,
        height: 600,
        rectMaxSize: 200,
        rectMinSize: 100,
        rectSize: 200,
        rectSizeR: 100,
      },
      trees: [
        {
          x: 1200,
          y: 1000,
        },
      ],
      bridges: [
        {
          type: "money",
          value: 18,
          // value: 0,
          direction: "right",
        },
        {
          type: "none",
          value: 0,
          direction: "down",
        },
      ],
    },
    {
      id: 3,
      x: 1800 + 1375,
      y: -1800 - 1375,
      width: 1800,
      height: 1800,
      jewelType: "emerald-mine",
      trees: [
        {
          x: 1200,
          y: 100,
        },
        {
          x: 100,
          y: 1000,
        },
      ],
      bridges: [
        {
          type: "none",
          value: 0,
          direction: "left",
        },
      ],
      jewels: (initialJewels = this.generateJewelArray(
        6,
        300,
        300,
        1200,
        1200,
        4000,
        5000
      )),
    },
    {
      id: 4,
      x: 1800 + 1375,
      y: 0,
      width: 1800,
      height: 1800,
      jewelType: "emerald-mine",
      factory: {
        type: "emerald",
        curPercent: 0,
        chargedValue: 0,
        perCharge: 3,
        mint: [],
        x: 450,
        y: -100,
        width: 800,
        height: 600,
        rectMaxSize: 200,
        rectMinSize: 100,
        rectSize: 200,
        rectSizeR: 100,
      },
      trees: [
        {
          x: 1200,
          y: 1000,
        },
      ],
      bridges: [
        {
          type: "money",
          value: 125,
          // value: 0,
          direction: "right",
        },
        {
          type: "none",
          value: 0,
          direction: "left",
        },
      ],
      jewels: (initialJewels = this.generateJewelArray(
        2,
        300,
        800,
        900,
        900,
        4000,
        5000
      )),
    },
    {
      id: 5,
      x: 2 * (1800 + 1375),
      y: 0,
      width: 1800,
      height: 1800,
      jewelType: "amethyst-mine",
      trees: [
        {
          x: 100,
          y: 1000,
        },
        {
          x: 1000,
          y: 1000,
        },
      ],
      bridges: [
        {
          type: "none",
          value: 0,
          direction: "left",
        },
      ],
      jewels: (initialJewels = this.generateJewelArray(
        6,
        300,
        300,
        1200,
        1200,
        4000,
        5000
      )),
    },
    {
      id: 6,
      x: 0,
      y: 1800 + 1375,
      width: 1800,
      height: 1800,
      jewelType: "amethyst-mine",
      factory: {
        type: "amethyst",
        curPercent: 0,
        chargedValue: 0,
        perCharge: 6,
        mint: [],
        x: 450,
        y: 900,
        width: 800,
        height: 600,
        rectMaxSize: 200,
        rectMinSize: 100,
        rectSize: 200,
        rectSizeR: 100,
        isDown: 1,
      },
      trees: [
        {
          x: 1200,
          y: 100,
        },
      ],
      bridges: [
        {
          type: "money",
          value: 315,
          // value: 0,
          direction: "right",
        },
        {
          type: "none",
          value: 0,
          direction: "up",
        },
      ],
      jewels: (initialJewels = this.generateJewelArray(
        2,
        50,
        50,
        1000,
        900,
        4000,
        5000
      )),
    },
    {
      id: 7,
      x: 1800 + 1375,
      y: 1800 + 1375,
      width: 1800,
      height: 1800,
      jewelType: "none",
      factory: {
        type: "barn",
        curPercent: 0,
        chargedValue: 0,
        perCharge: 1,
        mint: [],
        x: 450,
        y: -100,
        width: 800,
        height: 600,
        rectMaxSize: 200,
        rectMinSize: 100,
        rectSize: 200,
        rectSizeR: 100,
      },
      trees: [
        {
          x: 1200,
          y: 1000,
        },
      ],
      bridges: [
        {
          type: "none",
          value: 0,
          direction: "left",
        },
      ],
    },
  ];

  this.viewSizeX = this.viewSize;
  this.viewSizeY = this.viewSize;
  this.bridgeWidth = 418;
  this.bridgeHeight = 1375;

  this.init = function () {
    this.canvas = document.getElementById("background");
    this.ctx = this.canvas.getContext("2d");

    this.characterCanvas = document.getElementById("character");
    this.characterCtx = this.characterCanvas.getContext("2d");

    this.statusCanvas = document.getElementById("status");
    this.statusCtx = this.statusCanvas.getContext("2d");

    if (this.ctx && this.characterCtx && this.statusCtx) {
      // Initialize contexts
      Background.prototype.context = this.ctx;
      Character.prototype.context = this.characterCtx;
      Status.prototype.context = this.statusCtx;

      // Initialize background
      this.background = new Background();
      this.background.init(0, 0);
      Background.prototype.canvasHeight = this.canvas.height;
      Background.prototype.canvasWidth = this.canvas.width;
      // Initialize character
      this.character = new Character();
      Character.prototype.canvasHeight = this.characterCanvas.height;
      Character.prototype.canvasWidth = this.characterCanvas.width;
      Character.prototype.sizeX = 150;
      Character.prototype.sizeY = 160;

      this.character.init(0, 0, 150, 160);

      // Make the canvas responsive
      this.islands = new Islands();
      Islands.prototype.data = this.islandData;
      Islands.prototype.context = this.ctx;

      this.status = new Status();
      Status.prototype.canvasHeight = this.statusCanvas.height;
      Status.prototype.canvasWidth = this.statusCanvas.width;

      this.resizeCanvas();
      window.addEventListener("resize", () => this.resizeCanvas());
      window.addEventListener("mousedown", (e) => this.mouseDown(e));
      window.addEventListener("mouseup", (e) => this.mouseUp(e));
      window.addEventListener("mousemove", (e) => this.mouseMove(e));

      return true;
    } else {
      return false;
    }
  };

  this.mouseDown = function (e) {
    this.control = true;
    this.controlX = (e.clientX / this.canvas.width) * this.viewSizeX;
    this.controlY = (e.clientY / this.canvas.height) * this.viewSizeY;

    // Reset control angle and radius when mouse is pressed
    this.controlOffsetX = 0;
    this.controlOffsetY = 0;
    this.controlAngle = 0;
    this.controlRadius = 0;
  };

  this.mouseUp = function (e) {
    this.control = false;
    this.direction = "";
  };

  this.mouseMove = function (e) {
    if (this.control) {
      let controlOffsetX =
        (e.clientX / this.canvas.width) * this.viewSizeX - this.controlX;
      let controlOffsetY =
        (e.clientY / this.canvas.height) * this.viewSizeY - this.controlY;

      // Calculate angle of movement
      this.controlAngle = Math.atan2(controlOffsetY, controlOffsetX);

      if (this.controlAngle < 0) {
        this.controlAngle += 2 * Math.PI;
      }

      // Now divide the angle into 8 equal sections
      let section = Math.floor(this.controlAngle / ((2 * Math.PI) / 8)); // Each section is π/4 radians

      // Do something based on the section (0 through 7)
      switch (section) {
        case 0:
          // Movement is to the right (0 to π/4)
          this.direction = "R";
          break;
        case 1:
          // Movement is in the upper-right direction (π/4 to π/2)
          this.direction = "DR";
          break;
        case 2:
          // Movement is upwards (π/2 to 3π/4)
          this.direction = "D";
          break;
        case 3:
          // Movement is in the upper-left direction (3π/4 to π)
          this.direction = "DL";
          break;
        case 4:
          // Movement is to the left (π to 5π/4)
          this.direction = "L";
          break;
        case 5:
          // Movement is in the lower-left direction (5π/4 to 3π/2)
          this.direction = "UL";
          break;
        case 6:
          // Movement is downwards (3π/2 to 7π/4)
          this.direction = "U";
          break;
        case 7:
          // Movement is in the lower-right direction (7π/4 to 2π)
          this.direction = "UR";
          break;
      }

      let distance = Math.sqrt(
        controlOffsetX * controlOffsetX + controlOffsetY * controlOffsetY
      );
      this.controlRadius = distance > 0 ? 85 : 0;

      this.controlOffsetX = this.controlRadius * Math.cos(this.controlAngle);
      this.controlOffsetY = this.controlRadius * Math.sin(this.controlAngle);
    } else {
      this.controlAngle = 0;
      this.controlRadius = 0;
    }
  };

  this.resizeCanvas = function () {
    // Get the current window size
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.characterCanvas.width = window.innerWidth;
    this.characterCanvas.height = window.innerHeight;

    this.statusCanvas.width = window.innerWidth;
    this.statusCanvas.height = window.innerHeight;

    if (this.canvas.width > this.canvas.height) {
      this.viewSizeX =
        (this.canvas.width * this.viewSizeY) / this.canvas.height;
      this.viewSizeY = this.viewSize;
    } else {
      this.viewSizeY =
        (this.canvas.height * this.viewSizeX) / this.canvas.width;
      this.viewSizeX = this.viewSize;
    }

    this.viewPosX = this.characterX - this.viewSizeX / 2;
    this.viewPosY = this.characterY - this.viewSizeY / 2;

    let ratioX =
      Math.min(this.viewSizeX, this.canvas.width) /
      Math.max(this.viewSizeX, this.canvas.width);
    let ratioY =
      Math.min(this.viewSizeY, this.canvas.height) /
      Math.max(this.viewSizeY, this.canvas.height);

    Background.prototype.canvasHeight = this.canvas.height;
    Background.prototype.canvasWidth = this.canvas.width;

    Character.prototype.canvasHeight = this.characterCanvas.height;
    Character.prototype.canvasWidth = this.characterCanvas.width;
    Character.prototype.drawX = this.viewSizeX / 2 - Character.prototype.sizeX;
    Character.prototype.drawY = this.viewSizeY / 2 - Character.prototype.sizeY;

    Status.prototype.canvasHeight = this.statusCanvas.height;
    Status.prototype.canvasWidth = this.statusCanvas.width;

    this.ctx.scale(ratioX, ratioY);
    this.characterCtx.scale(ratioX, ratioY);
    this.statusCtx.scale(ratioX, ratioY);
  };

  this.start = function () {
    animate();
    soundBgm();
  };
}

function endGame() {
  console.log("here!");
  game = null;
  document.getElementById("top-half").style.display = "block";
  document.getElementById("bottom-half").style.display = "block";
  document.getElementById("logo-container").style.display = "block";
  document.getElementById("buttom").style.display = "block";
  
  document.getElementById("background").style.display = "none";
  document.getElementById("character").style.display = "none";
  document.getElementById("status").style.display = "none";
}
function animate() {
  if (game.isFinished) {
    console.log("finish:");
    endGame();
    return; // Stop further drawing if the game is finished
  }

  requestAnimationFrame(animate); // Call itself recursively for animation

  // Draw game components
  game.background.draw();
  game.islands.draw();
  game.character.draw();
  game.status.draw();
}

function checkCollision(x1, y1, x2, y2, w1, w2, h1, h2) {
  let centerX1 = x1 + w1 / 2;
  let centerY1 = y1 + h1 / 2;
  let centerX2 = x2 + w2 / 2;
  let centerY2 = y2 + h2 / 2;

  let minDistance = Math.min(w1, h1) / 2 + Math.min(w2, h2) / 2;
  let dx = centerX1 - centerX2;
  let dy = centerY1 - centerY2;
  let distance = Math.sqrt(dx * dx + dy * dy);

  let right = true;
  let down = true;
  let up = true;
  let left = true;

  if (distance < minDistance) {
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        left = false;
      } else {
        right = false;
      }
    } else {
      if (dy > 0) {
        up = false;
      } else {
        down = false;
      }
    }
  }

  return { up, down, left, right };
}

function checkInside(x1, y1, x2, y2, w1, w2, h1, h2, hole = null) {
  let outRight = x1 + w1 < x2 + w2;
  let outLeft = x1 > x2;
  let outUp = y1 > y2;
  let outDown = y1 + h1 < y2 + h2;
  let out = {
    up: outUp,
    down: outDown,
    left: outLeft,
    right: outRight,
  };

  let up, down, left, right;

  right = x1 + w1 > x2 + w2;
  down = y1 + h1 > y2 + h2;
  left = x1 < x2;
  up = y1 < y2;

  if (out.up && out.left) {
    up = false;
    left = false;
    right = true;
    down = true;
  } else if (out.up && out.right) {
    up = false;
    left = true;
    down = true;
    right = false;
  } else if (out.down && out.left) {
    down = false;
    left = false;
    right = true;
    up = true;
  } else if (out.down && out.right) {
    down = false;
    left = true;
    right = false;
    up = true;
  } else if (out.up) {
    left =
      hole &&
      hole.size &&
      hole.direction.up &&
      x1 + w1 / 2 - hole.size / 2 < x2;
    right =
      hole &&
      hole.size &&
      hole.direction.up &&
      x1 + w1 / 2 + hole.size / 2 > x2 + w2;
    up = left && right;
    down = y1 - 10 > y2 ? left && right : true;
    left = y1 - 10 > y2 ? left : true;
    right = y1 - 10 > y2 ? right : true;
    if (!up && !down && (left || right)) {
      up = true;
      down = true;
    }
  } else if (out.down) {
    left =
      hole &&
      hole.size &&
      hole.direction.down &&
      x1 + w1 / 2 - hole.size / 2 < x2;
    right =
      hole &&
      hole.size &&
      hole.direction.down &&
      x1 + w1 / 2 + hole.size / 2 > x2 + w2;
    down = left && right;
    up = y1 + w1 + 10 < y2 ? left && right : true;
    left = y1 + w1 + 10 < y2 ? left : true;
    right = y1 + w1 + 10 < y2 ? right : true;
    if (!up && !down && (left || right)) {
      up = true;
      down = true;
    }
  } else if (out.left) {
    up =
      hole &&
      hole.size &&
      hole.direction.left &&
      y1 + h1 / 2 - hole.size / 2 < y2;
    down =
      hole &&
      hole.size &&
      hole.direction.left &&
      y1 + h1 / 2 + hole.size / 2 > y2 + h2;
    left = up && down;
    right = x1 - 10 > x2 ? up && down : true;
    up = x1 - 10 > x2 ? up : true;
    down = x1 - 10 > x2 ? down : true;

    if (!left && !right && (up || down)) {
      left = true;
      right = true;
    }
  } else if (out.right) {
    up =
      hole &&
      hole.size &&
      hole.direction.right &&
      y1 + h1 / 2 - hole.size / 2 < y2;
    down =
      hole &&
      hole.size &&
      hole.direction.right &&
      y1 + h1 / 2 + hole.size / 2 > y2 + h2;
    right = up && down;
    left = x1 + w1 + 10 < x2 ? up && down : true;
    up = x1 + w1 + 10 < x2 ? up : true;
    down = x1 + w1 + 10 < x2 ? down : true;
    if (!left && !right && (up || down)) {
      left = true;
      right = true;
    }
  }
  // console.log("checkInside", out, { up, down, left, right });
  let holeBoundary = {
    left: x1 + h1 / 2 - hole.size / 2,
    right: x1 + h1 / 2 + hole.size / 2,
    up: y1 + h1 / 2 - hole.size / 2,
    down: y1 + h1 / 2 + hole.size / 2,
  };

  return { up, down, left, right, out, holeBoundary };
}

function drawRoundedRect(
  ctx,
  x,
  y,
  width,
  height,
  radius,
  strokeStyle,
  lineWidth
) {
  // Ensure radius is not too large
  if (radius > width / 2) radius = width / 2;
  if (radius > height / 2) radius = height / 2;

  ctx.strokeStyle = strokeStyle !== "none" ? strokeStyle : "white";
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x + radius, y); // Start at top-left corner (with radius offset)

  // Top side
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);

  // Right side
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);

  // Bottom side
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);

  // Left side
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);

  ctx.closePath();
  if (strokeStyle !== "none") ctx.stroke(); // Draw the outline
}

function generateRandomArrayWithLength(sum, length) {
  if (length > sum) {
    throw new Error("Length cannot be greater than the sum.");
  }

  // Step 1: Initialize the array with 1 in each position
  let result = Array(length).fill(1);

  // Step 2: Calculate the remaining sum to distribute
  let remaining = sum - length;

  // Step 3: Distribute the remaining sum
  while (remaining > 0) {
    let index = Math.floor(Math.random() * length); // Choose a random index
    result[index]++; // Increment the value at the chosen index
    remaining--; // Decrease the remaining sum
  }

  return result;
}

function isInside(x1, y1, x2, y2, w1, w2, h1, h2) {
  return x1 + w1 > x2 + w2 && x1 < x2 && y1 < y2 && y1 + h1 > y2 + h2;
}
// The keycodes that will be mapped when a user presses a button.
// Original code by Doug McInnes
KEY_CODES = {
  32: "space",
  37: "left",
  38: "up",
  39: "right",
  40: "down",
};

// Creates the array to hold the KEY_CODES and sets all their values
// to false. Checking true/flase is the quickest way to check status
// of a key press and which one was pressed when determining
// when to move and which direction.
KEY_STATUS = {};

for (code in KEY_CODES) {
  KEY_STATUS[KEY_CODES[code]] = false;
}
/**
 * Sets up the document to listen to onkeydown events (fired when
 * any key on the keyboard is pressed down). When a key is pressed,
 * it sets the appropriate direction to true to let us know which
 * key it was.
 */
document.onkeydown = function (e) {
  // Firefox and opera use charCode instead of keyCode to
  // return which key was pressed.
  var keyCode = e.keyCode ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
};

/**
 * Sets up the document to listen to ownkeyup events (fired when
 * any key on the keyboard is released). When a key is released,
 * it sets teh appropriate direction to false to let us know which
 * key it was.
 */
document.onkeyup = function (e) {
  var keyCode = e.keyCode ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
};

window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (/* function */ callback, /* DOMElement */ element) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();
