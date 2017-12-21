$(document).ready(function () {
  var stage;
  var context;
  var draggerObj;
  var dropObj;
  var destination;
  var containerHitArea;

  var curr_score = "1";
  var best_score = "1";
  var drag = false;
  var dropCnt = 1;
  var cellPos = new Array(10);
  var temp;

  var dragOffsetX;
  var dragOffsetY;
  var blockIndex = 0;
  $(window).resize(function() {
    // This will execute whenever the window is resized
    $('.cell').remove();
    blockIndex = 0;
    drawPlayGround();
  });

  CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();
    return this;
  }
  var block = new function () {
    
    this.drawPanel = function (startX, startY, width, height, roundRadius, blockType) {
      var cell = new createjs.Shape();
      blockIndex ++;
      cell.graphics.beginStroke("rgba(255,255,255,0.55)");
      cell.graphics.setStrokeStyle(1);
      cell.snapToPixel = true;
      if (blockType == 'cellBlock') {
        var p = $("#canvas");
        var offset = p.offset();
        $('.bg').append("<div class='cell' id='cell" + blockIndex +"'></div>");
        $('#cell' + blockIndex).css({
          left: offset.left + startX + 25,
          top: offset.top + startY + 226
        });
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
    var dragNum = 0;
    this.drawBlock = function (blockObj, drag) {
      if(drag) {
        draggerObj.removeAllChildren();
      }
      for (var i = 0; i < blockObj.length; i++) {
        var blockcell = new createjs.Shape();
        blockcell.graphics.beginLinearGradientFill([blockObj[i].startColor, blockObj[i].endColor], [0, 1], blockObj[i].pos_x, blockObj[i].pos_y, blockObj[i].pos_x + blockObj[i].width, blockObj[i].pos_y + blockObj[i].height)
          .drawRoundRect(blockObj[i].pos_x, blockObj[i].pos_y, blockObj[i].width, blockObj[i].height, blockObj[i].roundRadius);
        if (drag) {
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
        draggerObj.name = "dragger" + dragNum;
        if(dragNum == 1) {
          stage.addChild(destination);
        } else {
          stage.removeChild("dragger" + (dragNum - 1));
        }
        draggerObj.scaleX = draggerObj.scaleY = 1;
        stage.addChild(draggerObj);
        stage.mouseMoveOutside = true;
        dragNum ++;
        stage.update();
      }
    }
  }
  init();

  function init() {
    stage = new createjs.Stage("canvas");
    context = stage.canvas.getContext("2d");
    createjs.Ticker.setFPS(FPS);
    createjs.Touch.enable(stage);
    draggerObj = new createjs.Container();
    dropObj = new createjs.Container();
    destination = new createjs.Container();
    temp = new createjs.Container();
    for (var i = 0; i < 10; i++) {
      cellPos[i] = new Array(10);
      for(var j = 0; j < 10; j ++) {
        cellPos[i][j] = null;
      }
    }
    screenWidth = $(window).height(); // New height
    screenHeight = $(window).width(); // New width
    //-------------------------------------------Background color
    var bg = new createjs.Shape();
    bg.graphics
      .beginLinearGradientFill([bg_color, gd_endColor], [0, .9], gd_startX, gd_startY, gd_endX, gd_endY)
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
    drawText(244, 75, "LEADERBOARD", "14px Cera-Black", "white");
    //--------------------------------------------Dynamic text
    drawCurrentScore(curr_score);
    drawBestScore(best_score);
    drawPlayGround();
    drawControlPanel();
    drawBottomPanel();
    createCtrlBlocks();
  }

  function drawCurrentScore(score) {
    drawText(25, 106, score, "36px Cera-BlackItalic", 'white');
  }

  function drawBestScore(score) {
    drawText(25, 160, "The best", "12px Cera-MediumItalic", 'white');
    drawText(25, 180, score, "26px Cera-BlackItalic", 'white');
  }
  function drawText(posX, posY, text, font, color) {
    var text = new createjs.Text(text, font, color);
    text.x = posX;
    text.y = posY;
    stage.addChild(text);
    //stage.update();
    createjs.Ticker.on("tick", stage)
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
    destination.setBounds(-165, -640, 80, 80);

  }

  function drawControlPanel() {

    for (var i = 0; i < ctrlData.length; i++) {
      block.drawPanel(ctrlData[i].pos_x, ctrlData[i].pos_y, ctrlData[i].width, ctrlData[i].height, ctrlData[i].radius, 'ctrlBlock');
    }
    drawText(65.5, 580, "Hold", "10px Cera-Black", "rgba(255,255,255,0.5");
    drawText(284, 580, "Next", "10px Cera-Black", "rgba(255,255,255,0.5");
  }
  function drawBottomPanel() {
    for (var i = 0; i < bottomCtrlData.length; i++) {
      block.drawPanel(bottomCtrlData[i].pos_x, bottomCtrlData[i].pos_y, bottomCtrlData[i].width, bottomCtrlData[i].height, bottomCtrlData[i].radius, 'bottomBlock');
    }
    drawText(36, 745, "Your Rank:", "12px Cera-MediumItalic", "rgba(255,255,255,1)");
    drawText(105, 745, "1 of 1", "12px Cera-BlackItalic", "rgba(255,255,255,1)");
    drawText(44, 774, "Your best:", "12px Cera-MediumItalic", "rgba(255,255,255,1)");
    drawText(105, 774, "1", "12px Cera-BlackItalic", "rgba(255,255,255,1)");
    drawText(251, 750, "00:00", "26px Cera-BlackItalic", "rgba(255,255,255,1)");
  }

  function createCtrlBlocks() {
    generateBlock();
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
  //Mouse UP and SNAP====================
  draggerObj.on("pressup", function (evt) {
    var pt = draggerObj.globalToLocal(stage.mouseX, stage.mouseY);
    var bkOrigin = evt.currentTarget.children[0].graphics.command;
    dragOffsetX = Math.ceil((pt.x - bkOrigin.x) / 32) * 32;
    dragOffsetY = Math.ceil((pt.y - bkOrigin.y) / 32) * 32;
    
    if (intersect(evt.currentTarget, destination)) {
      matchedBks = getMatchedBlocks(evt.stageX - dragOffsetX, evt.stageY - dragOffsetY);
      if (matchedBks.blockX != -1 && matchedBks.blockY != -1) {
        draggerObj.alpha = 1;
        draggerObj.x = -244.55 + matchedBks.blockX * (block_size + block_gap) - Math.round((bkOrigin.x - 169) * zoomRatio);
        draggerObj.y = -904.4 + matchedBks.blockY * (block_size + block_gap) - Math.round((bkOrigin.y - 621.78) * zoomRatio);
        var x = evt.stageX - dragOffsetX;
        var y = evt.stageY - dragOffsetY;
        var orgX = 25, orgY = 226;
        var matrix;
        for (var i = 0; i < evt.currentTarget.children.length; i++) {
          matrix = getBkPosition(orgX, orgY, x, y, 32.6);
          matrix.blockX = matrix.blockX + Math.round((evt.currentTarget.children[i].graphics.command.x - bkOrigin.x) / 21.78);
          matrix.blockY = matrix.blockY + Math.round((evt.currentTarget.children[i].graphics.command.y - bkOrigin.y) / 21.78);
          if (cellPos[matrix.blockX][matrix.blockY] != null) {
            evt.currentTarget.alpha = 1;
            draggerObj.scaleX = draggerObj.scaleY = 1;
            draggerObj.x = 0;
            draggerObj.y = 0
            stage.update(evt);
            return;
          }
        }
        for (var i = 0; i < evt.currentTarget.children.length; i++) {
          matrix = getBkPosition(orgX, orgY, x, y, 32.6);
          matrix.blockX = matrix.blockX + Math.round((evt.currentTarget.children[i].graphics.command.x - bkOrigin.x) / 21.78);
          matrix.blockY = matrix.blockY + Math.round((evt.currentTarget.children[i].graphics.command.y - bkOrigin.y) / 21.78);
          $('#cell' + (matrix.blockY * 10 + matrix.blockX + 1)).css({
            'z-index': -1
          });
          cellPos[matrix.blockX][matrix.blockY] = evt.currentTarget.children[i].graphics._fill.style.props.colors[0];
        }
        dropObj = draggerObj.clone(true);
        dropObj.name = "blocks" + dropCnt;
        dropObj.offSetX = dragOffsetX;
        dropObj.offSetY = dragOffsetY;
        destination.addChild(dropObj);
        var blocks = destination.getChildByName("blocks" + dropCnt);
        for (var j = 0; j < blocks.children.length; j++) {
          blocks.children[j].name = "bkpiece" + dropCnt + j;
          blocks.children[j].addEventListener("click", function (selEvt) {
            var x = evt.stageX - blocks.offSetX;
            var y = evt.stageY - blocks.offSetY; 
            var orgX = 25, orgY = 226;
            var matrix = getBkPosition(orgX, orgY, x, y, 32.76);
            matrix.blockX = matrix.blockX + Math.round((selEvt.currentTarget.graphics.command.x - bkOrigin.x) / 21.78);
            matrix.blockY = matrix.blockY + Math.round((selEvt.currentTarget.graphics.command.y - bkOrigin.y) / 21.78);
            
            drawSelArea(matrix);
            stage.update();
          });
        }
        
        dropCnt++;
        generateBlock();
        createCtrlBlocks();
      } else {
        evt.currentTarget.alpha = 1;
        draggerObj.scaleX = draggerObj.scaleY = 1;
        draggerObj.x = 0;
        draggerObj.y = 0
      }
      stage.update(evt);
    } else {
      evt.currentTarget.alpha = 1;
      draggerObj.scaleX = draggerObj.scaleY = 1;
      draggerObj.x = 0;
      draggerObj.y = 0
      stage.update(evt);
    }
    
    stage.update();
  });
  
  function drawSelArea(matrix) {
    var col = matrix.blockX;
    var row = matrix.blockY;
    var blocks = [];
    if (cellPos[col - 1][row - 1] == cellPos[col][row] && cellPos[col - 1][row] == cellPos[col][row] && cellPos[col][row - 1] == cellPos[col][row]) {
      temp.removeAllChildren();
      stage.removeChild(temp);
      temp.removeAllEventListeners('dblclick');
      temp.addEventListener('dblclick', function (evt) {
        var removedBlocks = [];
        for (var i = 1; i < dropCnt; i++) {
          blocks = destination.getChildByName("blocks" + i);
          for (var j = 0; j < blocks.children.length; j++) {
            var x = blocks.x + blocks.children[j].graphics.command.x * zoomRatio;
            var y = blocks.y + blocks.children[j].graphics.command.y * zoomRatio;
            var matrix = getBkPosition(1.707142857142884, 1.6222857142857947, x, y, 32);
            if ((col - matrix.blockX >= 0) && (row - matrix.blockY >= 0) && (col - matrix.blockX < 2) && (row - matrix.blockY < 2)) {
              cellPos[matrix.blockX][matrix.blockY] = null;
              $('#cell' + (matrix.blockY * 10 + matrix.blockX + 1)).css({
                'z-index': 1
              })
              removedBlocks.push(blocks.children[j]);
            }
          }

        }
        if (removedBlocks.length != 0) {
          for (var j = 0; j < removedBlocks.length; j++) {
            for (var i = 1; i < dropCnt; i++) {
              blocks = destination.getChildByName("blocks" + i);
              for (var k = 0; k < blocks.children.length; k++) {
                if (blocks.children[k].name == removedBlocks[j].name) {
                  blocks.removeChild(blocks.children[k]);
                }
              }
            }
          }
        }
        temp.removeAllChildren();
        stage.removeChild(temp);
        stage.update();
      });
      for (var i = col - 1; i <= col; i++) {
        for (var j = row - 1; j <= row; j++) {
          var clone = new createjs.Shape();
          clone.graphics.beginLinearGradientFill(["rgba(255,255,255,1)", "rgba(255,255,255,0.4)"], [0, 1],
            26 + i * (block_size + block_gap), 226 + j * (block_size + block_gap), 26 + i * (block_size + block_gap) + 30.6, 226 + j * (block_size + block_gap) + 30.6);
          
          clone.graphics.beginStroke("RGB(255, 255, 255)");
          clone.graphics.setStrokeStyle(10);
          clone.graphics.drawRoundRect(30 + i * (block_size + block_gap), 233 + j * (block_size + block_gap), 19.2, 19.2, 1);
          var blurFilter = new createjs.BlurFilter(6, 6, 1);
          clone.filters = [blurFilter];
          var bounds = blurFilter.getBounds();
          if (bounds != undefined)
            clone.cache(30 + i * (block_size + block_gap), 233 + j * (block_size + block_gap), 19.2, 19.2);
          temp.addChild(clone);
        }
      }
      stage.addChild(temp);

    } else {
      temp.removeAllChildren();
      stage.removeChild(temp);
    }
    stage.update();
  }

  function generateBlock() {
    var Cmax = bkColors.length - 1, Cmin = 0;
    var Bmax = bkPositions.length - 1, Bmin = 0;
    var bk_size = 21.78;
    var rndColor = bkColors[Math.floor(Math.random() * (Cmax - Cmin + 1)) + Cmin];
    var rndBkPos = bkPositions[Math.floor(Math.random() * (Bmax - Bmin + 1)) + Bmin];
    mainBkObj = [];
    for(var i = 0; i < rndBkPos.offset_data.length; i ++) {
      var rndBlock = {};
      rndBlock.pos_x = rndBkPos.start_x + rndBkPos.offset_data[i].bk_x * bk_size;
      rndBlock.pos_y = rndBkPos.start_y + rndBkPos.offset_data[i].bk_y * bk_size;
      rndBlock.startColor = rndColor.startColor;
      rndBlock.endColor = rndColor.endColor;
      rndBlock.width = 19.22;
      rndBlock.height = 19.22;
      rndBlock.roundRadius = 4;
      mainBkObj.push(rndBlock);
    }
  }
});