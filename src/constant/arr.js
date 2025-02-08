export const createArray = (rows, cols) => {
  var arr = new Array(rows);
  for (var i = 0; i < rows; i++) {
    arr[i] = new Array(cols).fill(" ");
  }
  return arr;
};
