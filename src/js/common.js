function getMatchedBlocks(x, y) {
  var orgX = 24, orgY = 226;
  if ((x - orgX) % 32 < 10 && (y - orgY) % 32 < 10) {
    //return { blockX: parseInt((x - orgX) / 32), blockY: parseInt((y - orgY) / 32) };
    return { blockX: Math.round((x - orgX) / 32), blockY: Math.round((y - orgY) / 32) };
  } else {
    return { blockX: -1, blockY: -1 };
  }
}
function getBkPosition(orgX, orgY, x, y, step) {
  return { blockX: Math.round((x - orgX) / step), blockY: Math.round((y - orgY) / step) };
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
