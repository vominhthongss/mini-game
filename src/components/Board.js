import { useState } from "react";

function Board({ initialLines, player, handleOutput }) {
  const [lines, setLines] = useState(initialLines);
  const cellSize = 50;

  const handleMove = (row, col) => {
    const newLines = [...lines];
    newLines[row][col] = player;
    setLines(newLines);
    handleOutput(row, col);
  };
  const renderCell = (row, col, cell) => {
    return (
      <div
        onClick={() => handleMove(row, col)}
        key={col}
        className={`${
          player === "X"
            ? "text-red-500 font-bold text-md"
            : player === "O"
            ? "text-blue-500 font-bold text-md"
            : ""
        } bg-gray-200 hover:bg-white cursor-pointer border-2 border-black min-w-[${cellSize}px] h-[${cellSize}px] flex justify-center items-center`}>
        {cell}
      </div>
    );
  };
  return (
    <div className={`flex flex-col justify-start`}>
      {lines.map((line, row) => {
        return (
          <div key={row} className="flex flex-row justify-start">
            {line.map((cell, col) => {
              return renderCell(row, col, cell);
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Board;
