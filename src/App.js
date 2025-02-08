import React, { useEffect, useRef, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import "./App.css";
import Board from "./components/Board";
import { createArray } from "./constant/arr";

function App() {
  const { REACT_APP_API_URL } = process.env;

  const [connection, setConnection] = useState(null);
  const [player, setPlayer] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const size = 20;
  const [lines, setLines] = useState(createArray(size, size));
  const [playerTurn, setPlayerTurn] = useState("X");
  const [winner, setWinner] = useState("");
  const [newPosition, setNewPosition] = useState({ row: null, col: null });

  const handleOutput = (row, col) => {
    const newLines = [...lines];
    newLines[row][col] = player;
    const newPo = { row: row, col: col };
    setLines(newLines);
    handleMakeMove(lines, newPo);
  };

  // useEffect(() => {}, [lines, playerTurn, newPosition]);
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${REACT_APP_API_URL}gameHub`, {
        withCredentials: true,
      })
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR Hub!");
        newConnection.invoke("JoinGame");
      })
      .catch((err) => console.error("Connection failed: ", err));

    newConnection.on("YourPlayer", (player) => {
      setPlayer(player);
    });

    newConnection.on("Log", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newConnection.on(
      "MakeMove",
      (_board, _playerTurn, _winner, _newPosition) => {
        const newLines = [...JSON.parse(_board)];
        setLines(newLines);
        setPlayerTurn(_playerTurn);
        setWinner(_winner);
        const newPostion_ = JSON.parse(_newPosition);
        setNewPosition(newPostion_);
      }
    );

    newConnection.on("NewGame", () => {
      const newLines = [...createArray(size, size)];
      setLines(newLines);
      setPlayerTurn("X");
      setWinner("");
      setNewPosition({ row: null, col: null });
    });

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const showName = (text) => {
    return (
      <span
        className={`font-bold ${
          text === "X" ? "text-red-500" : "text-blue-500"
        }`}>
        {" "}
        {text}
      </span>
    );
  };
  const handleMakeMove = (data, newPo) => {
    const winner = checkWinner(data);
    if (winner) {
      setWinner(winner);
    }
    if (connection) {
      connection
        .invoke(
          "MakeMove",
          JSON.stringify(data),
          playerTurn,
          winner,
          JSON.stringify(newPo)
        )
        .catch((err) => console.error(err));
    }
  };
  const handleNewGame = () => {
    if (connection) {
      connection.invoke("NewGame").catch((err) => console.error(err));
    }
  };
  const checkWinner = (board) => {
    const size = board.length;

    // Kiểm tra hàng ngang
    for (let i = 0; i < size; i++) {
      for (let j = 0; j <= size - 5; j++) {
        const row = board[i].slice(j, j + 5);
        if (row.every((cell) => cell === "X")) return "X";
        if (row.every((cell) => cell === "O")) return "O";
      }
    }

    // Kiểm tra hàng dọc
    for (let j = 0; j < size; j++) {
      for (let i = 0; i <= size - 5; i++) {
        const col = [];
        for (let k = 0; k < 5; k++) {
          col.push(board[i + k][j]);
        }
        if (col.every((cell) => cell === "X")) return "X";
        if (col.every((cell) => cell === "O")) return "O";
      }
    }

    // Kiểm tra đường chéo chính (từ trên trái xuống dưới phải)
    for (let i = 0; i <= size - 5; i++) {
      for (let j = 0; j <= size - 5; j++) {
        const diag = [];
        for (let k = 0; k < 5; k++) {
          diag.push(board[i + k][j + k]);
        }
        if (diag.every((cell) => cell === "X")) return "X";
        if (diag.every((cell) => cell === "O")) return "O";
      }
    }

    // Kiểm tra đường chéo phụ (từ trên phải xuống dưới trái)
    for (let i = 0; i <= size - 5; i++) {
      for (let j = 4; j < size; j++) {
        const diag = [];
        for (let k = 0; k < 5; k++) {
          diag.push(board[i + k][j - k]);
        }
        if (diag.every((cell) => cell === "X")) return "X";
        if (diag.every((cell) => cell === "O")) return "O";
      }
    }

    return null; // Không có người thắng
  };
  return (
    <div className="w-[100%] h-full flex lg:flex-row flex-col">
      <div className="lg:fixed lg:right-0 lg:top-0 bg-purple-200 lg:w-[20%] w-full lg:h-screen flex flex-col space-y-2 p-2 overflow-auto">
        <span>Người đánh tiếp theo: {showName(playerTurn)}</span>
        <span>
          Bạn là người chơi: {player ? showName(player) : "Đang kết nối..."}
        </span>
        <span>Người thắng: {winner ? showName(winner) : "Chưa có"}</span>
        <button
          className="border bg-gray-200 hover:bg-white cursor-pointer"
          onClick={handleNewGame}>
          Chơi game mới
        </button>
        {/* {messages.map((msg, index) => (
          <div key={index} className="p-1 border-b">
            {msg}
          </div>
        ))} */}
        <div ref={messagesEndRef} />
      </div>
      <div className="lg:w-[80%] w-full border lg:h-screen overflow-scroll flex justify-center items-center">
        <Board
          key={JSON.stringify(lines)}
          initialLines={lines}
          player={player}
          playerTurn={playerTurn}
          winner={winner}
          newPosition={newPosition}
          handleOutput={handleOutput}
        />
      </div>
    </div>
  );
}

export default App;
