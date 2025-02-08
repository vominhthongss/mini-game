export const createArray = (rows, cols) => {
  var arr = new Array(rows);
  var count = 0;
  for (var i = 0; i < rows; i++) {
    arr[i] = new Array(cols).fill(" ");
    // for (var k = 0; k < cols; k++) {
    //   arr[i][k] = count;
    //   count++;
    // }
  }
  return arr;
};
