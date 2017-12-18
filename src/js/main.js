$(document).ready(function () {
  const gd_startX = 90;
  const gd_startY = 45;
  const gd_endX = 190;
  const gd_endY = 660;
  const bg_color = '#29005E';
  const gd_startColor = 'rgba(0,0,0,0.39)';
  const gd_endColor = 'rgba(0,0,0,0)';
  const block_size = 30.6;
  const block_gap = 2.11;
  const zoomRatio = (block_size / 21);

  var stage;
  var draggerObj;
  var dropObj;
  var destination;
  var containerHitArea;

  var curr_score = "417";
  var best_score = "56,435";
  var drag = false;
  var cellPos = Array(10);
  var mainBkObj = [
    {
      pos_x: 169,
      pos_y: 621.78,
      width: 19.22,
      height: 19.22,
      roundRadius: 4,
      startColor: "rgba(28, 108, 241, 1)",
      endColor: "rgba(20, 225, 255, 1)"
    },
    {
      pos_x: 190.78,
      pos_y: 621.78,
      width: 19.22,
      height: 19.22,
      roundRadius: 4,
      startColor: "rgba(28, 108, 241, 1)",
      endColor: "rgba(20, 225, 255, 1)"
    },
    {
      pos_x: 169,
      pos_y: 643.56,
      width: 19.22,
      height: 19.22,
      roundRadius: 4,
      startColor: "rgba(28, 108, 241, 1)",
      endColor: "rgba(20, 225, 255, 1)"
    }
  ];

  var block = new function () {
    this.drawPanel = function (startX, startY, width, height, roundRadius, blockType) {
      var cell = new createjs.Shape();
      cell.graphics.beginStroke("#FFFFFF");
      cell.graphics.setStrokeStyle(1);
      cell.snapToPixel = true;
      if (blockType == 'cellBlock') {
        cell.graphics.beginRadialGradientFill(["rgba(255, 255, 255, 0.2)", "rgba(200, 242, 255, 0.16)"], [0, .5, 1], startX + width / 2, startY + height / 2, 12, startX + width / 2, startY + height / 2, 15);
        cell.graphics.drawRoundRect(startX, startY, width, height, roundRadius);
        cell.name = "cell";
        destination.addChild(cell);
      }
      else if (blockType == 'ctrlBlock') {
        cell.graphics.beginRadialGradientFill(["rgba(255, 255, 255, 0.2)", "rgba(200, 242, 255, 0.16)"], [0, .5, 1], startX + width / 2, startY + height / 2, width / 2, startX + width / 2, startY + height / 2, width / 2 + 30);
        cell.graphics.drawRoundRect(startX, startY, width, height, roundRadius);
        stage.addChild(cell);
      }
      else {
        cell.graphics.beginRadialGradientFill(["rgba(0, 0, 0, 0.4)", "rgba(0, 0, 0, 0.4)"], [0, .5, 1], startX + width / 2, startY + height / 2, width / 2, startX + width / 2, startY + height / 2, width);
        cell.graphics.drawRoundRect(startX, startY, width, height, roundRadius);
        stage.addChild(cell);
      }
      stage.update();
    };

    this.drawBlock = function (blockObj, drag) {
      for (var i = 0; i < blockObj.length; i++) {
        var blockcell = new createjs.Shape();
        blockcell.graphics.beginLinearGradientFill([blockObj[i].startColor, blockObj[i].endColor], [0, 1], blockObj[i].pos_x, blockObj[i].pos_y, blockObj[i].pos_x + blockObj[i].width, blockObj[i].pos_y + blockObj[i].height)
          .drawRoundRect(blockObj[i].pos_x, blockObj[i].pos_y, blockObj[i].width, blockObj[i].height, blockObj[i].roundRadius);
        if (drag) {
          blockcell.name = "bkpiece" + i;
          draggerObj.addChild(blockcell);
        } else {
          stage.addChild(blockcell);
          stage.update();
        }
      }
      if (drag) {
        draggerObj.x = 0;
        draggerObj.y = 0;
        draggerObj.setBounds(0, 0, 190, 190);
        stage.addChild(destination, draggerObj);
        stage.mouseMoveOutside = true;
        stage.update();
      }
    };
  }
  init();

  function init() {
    stage = new createjs.Stage("canvas");
    draggerObj = new createjs.Container();
    dropObj = new createjs.Container();
    destination = new createjs.Container();
    containerHitArea = new createjs.DisplayObject();
    enableHitArea(containerHitArea);

    for (var i = 0; i < 10; i++) {
      cellPos[i] = Array(10);
    }
    //-------------------------------------------Background color
    var bg = new createjs.Shape();
    bg.graphics
      .beginLinearGradientFill([gd_startColor, gd_endColor], [.1, .9], gd_startX, gd_startY, gd_endX, gd_endY)
      .beginFill(bg_color)
      .drawRect(0, 0, canvas.width, canvas.height)
      .endFill();
    stage.addChild(bg);
    //--------------------------------------------Logo Icon
    var img = new Image();
    var logo_startX = 25;
    var logo_startY = 46;
    var bitmap = new createjs.Bitmap(img);
    img.src = "src/img/B_Logo.png";
    bitmap.x = logo_startX;
    bitmap.y = logo_startY;
    bitmap.width = 40;
    bitmapheight = 40;
    stage.addChild(bitmap);
    stage.update();
    //--------------------------------------------Static text
    drawText(244, 75, "LEADERBOARD", "14px Helvetica", "white");
    //--------------------------------------------Dynamic text
    drawCurrentScore(curr_score);
    drawBestScore(best_score);
    drawPlayGround();
    drawControlPanel();
    drawBottomPanel();
    createCtrlBlocks();
  }
  function enableHitArea(displayObject) {
    displayObject.hitArea = new createjs.Shape();
    displayObject.hitArea.graphics.beginFill('#000').drawRect(0, 0, 200, 200).endFill();
  }
  function drawCurrentScore(score) {
    drawText(25, 106, score, "36px Helvetica", 'white');
  }

  function drawBestScore(score) {
    drawText(25, 160, "The best", "12px Helvetica", 'white');
    drawText(25, 190, score, "26px Helvetica", 'white');
  }
  function drawText(posX, posY, text, font, color) {
    var text = new createjs.Text(text, font, color);
    text.x = posX;
    text.y = posY;
    stage.addChild(text);
    stage.update();
  }
  function drawPlayGround() {
    var initPosX = 0;
    var initPostY = 0;
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        block.drawPanel(initPosX + j * (block_size + block_gap), initPostY + i * (block_size + block_gap), block_size, block_size, 6, 'cellBlock');
      }
    }
    destination.x = 25;
    destination.y = 226;
    destination.setBounds(-180, -640, 60, 60);
    // destination.addEventListener('click', containerClickEventListener);
    // destination.addChild(containerHitArea);
  }
  function containerClickEventListener(event) {
    console.log(event);
    event.stopPropagation();
  }
  function drawControlPanel() {
    var ctrlData = [
      {
        pos_x: 25,
        pos_y: 597,
        width: 101.56,
        height: 101.56,
        radius: 6
      },
      {
        pos_x: 130,
        pos_y: 583,
        width: 115.56,
        height: 115.56,
        radius: 6
      },
      {
        pos_x: 249,
        pos_y: 597,
        width: 101.56,
        height: 101.56,
        radius: 6
      }
    ]
    for (var i = 0; i < ctrlData.length; i++) {
      block.drawPanel(ctrlData[i].pos_x, ctrlData[i].pos_y, ctrlData[i].width, ctrlData[i].height, ctrlData[i].radius, 'ctrlBlock');
    }
    drawText(65.5, 580, "Hold", "10px Helvetica", "rgba(255,255,255,0.5");
    drawText(284, 580, "Next", "10px Helvetica", "rgba(255,255,255,0.5");
  }
  function drawBottomPanel() {
    var ctrlData = [
      {
        pos_x: 20,
        pos_y: 739,
        width: 143,
        height: 24,
        radius: 4
      },
      {
        pos_x: 20,
        pos_y: 768,
        width: 143,
        height: 24,
        radius: 4
      },
      {
        pos_x: 210,
        pos_y: 739,
        width: 143,
        height: 53,
        radius: 6
      }
    ]
    for (var i = 0; i < ctrlData.length; i++) {
      block.drawPanel(ctrlData[i].pos_x, ctrlData[i].pos_y, ctrlData[i].width, ctrlData[i].height, ctrlData[i].radius, 'bottomBlock');
    }
    drawText(36, 745, "Your Rank: 56 of 145", "12px Helvetica", "rgba(255,255,255,1)");
    drawText(44, 774, "Your best: 56,435", "12px Helvetica", "rgba(255,255,255,1)");
    drawText(251, 750, "00:35", "26px Helvetica", "rgba(255,255,255,1)");
  }

  function createCtrlBlocks() {
    var holdBkObj = [
      {
        pos_x: 51,
        pos_y: 632,
        width: 15,
        height: 15,
        roundRadius: 4,
        startColor: "rgba(28, 108, 241, 1)",
        endColor: "rgba(20, 225, 255, 1)"
      },
      {
        pos_x: 68,
        pos_y: 632,
        width: 15,
        height: 15,
        roundRadius: 4,
        startColor: "rgba(28, 108, 241, 1)",
        endColor: "rgba(20, 225, 255, 1)"
      },
      {
        pos_x: 85,
        pos_y: 632,
        width: 15,
        height: 15,
        roundRadius: 4,
        startColor: "rgba(28, 108, 241, 1)",
        endColor: "rgba(20, 225, 255, 1)"
      },
      {
        pos_x: 51,
        pos_y: 649,
        width: 15,
        height: 15,
        roundRadius: 4,
        startColor: "rgba(28, 108, 241, 1)",
        endColor: "rgba(20, 225, 255, 1)"
      }
    ];
    var nextBkObj = [
      {
        pos_x: 274.5,
        pos_y: 648.5,
        width: 15,
        height: 15,
        roundRadius: 4,
        startColor: "rgba(241, 160, 28, 1)",
        endColor: "rgba(255, 77, 67, 1)"
      },
      {
        pos_x: 291.5,
        pos_y: 648.5,
        width: 15,
        height: 15,
        roundRadius: 4,
        startColor: "rgba(241, 160, 28, 1)",
        endColor: "rgba(255, 77, 67, 1)"
      },
      {
        pos_x: 291.5,
        pos_y: 631.5,
        width: 15,
        height: 15,
        roundRadius: 4,
        startColor: "rgba(241, 160, 28, 1)",
        endColor: "rgba(255, 77, 67, 1)"
      },
      {
        pos_x: 308.5,
        pos_y: 631.5,
        width: 15,
        height: 15,
        roundRadius: 4,
        startColor: "rgba(241, 160, 28, 1)",
        endColor: "rgba(255, 77, 67, 1)"
      }
    ];
    block.drawBlock(holdBkObj, false);
    block.drawBlock(mainBkObj, true);
    block.drawBlock(nextBkObj, false);

  }

  //----------------------------------------------------------------------------------------------------------------Game Logic
  draggerObj.on("pressmove", function (evt) {
    evt.currentTarget.x = evt.stageX - evt.target.graphics.command.x * zoomRatio;
    evt.currentTarget.y = evt.stageY - evt.target.graphics.command.y * zoomRatio;
    draggerObj.scaleX = draggerObj.scaleY = zoomRatio;
    stage.update(); //much smoother because it refreshes the screen every pixel movement instead of the FPS set on the Ticker
    if (intersect(evt.currentTarget, destination)) {
      var matchedBks = getMatchedBlocks(evt.stageX, evt.stageY);
      if (matchedBks.blockX != -1 && matchedBks.blockY != -1) {
        evt.currentTarget.alpha = 1;
      } else {
        evt.currentTarget.alpha = 0.2;
      }
    } else {
      evt.currentTarget.alpha = 0.2;
    }

  });
  var dropCnt = 1;
  //Mouse UP and SNAP====================
  draggerObj.on("pressup", function (evt) {

    if (intersect(evt.currentTarget, destination)) {
      var matchedBks = getMatchedBlocks(evt.stageX, evt.stageY);
      if (matchedBks.blockX != -1 && matchedBks.blockY != -1) {
        draggerObj.alpha = 1;
        draggerObj.x = -244.55 + matchedBks.blockX * (block_size + block_gap);
        draggerObj.y = -904.4 + matchedBks.blockY * (block_size + block_gap);

        for (var i = 0; i < evt.currentTarget.children.length; i++) {
          var x = evt.stageX + evt.currentTarget.children[i].graphics.command.x;
          var y = evt.stageY + evt.currentTarget.children[i].graphics.command.y;
          var matrix = checkBkIntersect(x, y);
          for (var j = 0; j < 10; j++) {
            for (var k = 0; k < 10; k++) {
              if (cellPos[matrix.blockX][matrix.blockY] == 1) {
                evt.currentTarget.alpha = 1;
                draggerObj.scaleX = draggerObj.scaleY = 1;
                draggerObj.x = 0;
                draggerObj.y = 0
                stage.update(evt);
                return;
              }
            }
          }
          cellPos[matrix.blockX][matrix.blockY] = 1;
        }
        dropObj = draggerObj.clone(true);
        dropObj.name = "blocks" + dropCnt;
        destination.addChild(dropObj);
        dropCnt++;
      }
      evt.currentTarget.alpha = 1;
      draggerObj.scaleX = draggerObj.scaleY = 1;
      draggerObj.x = 0;
      draggerObj.y = 0
      stage.update(evt);
    } else {
      evt.currentTarget.alpha = 1;
      draggerObj.scaleX = draggerObj.scaleY = 1;
      draggerObj.x = 0;
      draggerObj.y = 0
      stage.update(evt);
    }

    var index;
    for (var i = 1; i < dropCnt; i++) {
      var blocks = destination.getChildByName("blocks" + i);
      //console.log(blocks);
      for (var j = 0; j < blocks.children.length; j++) {
        index = j;
        // var x = evt.stageX - blocks.children[j].graphics.command.x * zoomRatio;
        // var y = evt.stageY - blocks.children[j].graphics.command.y * zoomRatio;

        // blocks.children[j].addEventListener("dblclick", function(evt) {
        //   blocks.removeChild(evt.currentTarget);
        //   stage.update();
        // });
        blocks.children[j].addEventListener("click", function (selEvt) {
          var x = evt.stageX + selEvt.currentTarget.graphics.command.x;
          var y = evt.stageY + selEvt.currentTarget.graphics.command.y;
          var w = selEvt.currentTarget.graphics.command.w;
          var h = selEvt.currentTarget.graphics.command.h;
          // var selPos = checkBkIntersect(x, y);
          var target = selEvt.currentTarget;
          
          //target.alpha = 0.5;
          var tar = selEvt.target
          tar.graphics.clear().beginFill('#FF0000').drawRect(0, 0, 100,100).endFill();
          console.log(target);
          stage.update();
        });
      }
    }
  });


  function getMatchedBlocks(x, y) {
    var orgX = 24, orgY = 226;
    if ((x - orgX) % 32 < 10 && (y - orgY) % 32 < 10) {
      return { blockX: parseInt((x - orgX) / 32), blockY: parseInt((y - orgY) / 32) };
    } else {
      return { blockX: -1, blockY: -1 };
    }
  }
  function checkBkIntersect(x, y) {
    var orgX = 194.89999389648438, orgY = 847.78;
    return { blockX: Math.round((x - orgX) / 32.71), blockY: Math.round((y - orgY) / 32.71) };
  }
  function intersect(obj1, obj2) {
    var objBounds1 = obj1.getBounds().clone();
    var objBounds2 = obj2.getBounds().clone();
    var pt = obj1.globalToLocal(objBounds2.x, objBounds2.y);

    var h1 = -(objBounds1.height / 2 + objBounds2.height);
    var h2 = objBounds2.width / 2;
    var w1 = -(objBounds1.width / 2 + objBounds2.width);
    var w2 = objBounds2.width / 2;


    if (pt.x > w2 || pt.x < w1) return false;
    if (pt.y > h2 || pt.y < h1) return false;

    return true;
  }

});