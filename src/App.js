import React, { useEffect, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import "./App.css";

function App() {
  const [connection, setConnection] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [player, setPlayer] = useState("X");

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7294/gameHub", {
        withCredentials: true,
      })
      .build();
    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR Hub!");
        newConnection.invoke("JoinGame", "game1"); // Tham gia vào game
      })
      .catch((err) => console.error("Connection failed: ", err));

    newConnection.on("Log", (id) => {
      console.log("User joined :", id);
    });

    newConnection.on("ReceiveBoard", (newBoard) => {
      setBoard(newBoard);
    });

    newConnection.on("ReceivePlayer", (nextPlayer) => {
      setCurrentPlayer(nextPlayer);
    });

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  const handleClick = (index) => {
    if (board[index] || player !== currentPlayer) return;

    // Gửi di chuyển đến server
    connection
      .invoke("MakeMove", index, player)
      .catch((err) => console.error(err));
  };

  const renderCell = (index) => {
    return (
      <div className="cell" onClick={() => handleClick(index)}>
        {board[index]}
      </div>
    );
  };

  const handleTest = () => {
    connection
      .invoke("Log", new Date().toString())
      .catch((err) => console.error(err));
  };

  return (
    <div className="game">
      <button onClick={handleTest}>test</button>
      <div className="board">{board.map((_, index) => renderCell(index))}</div>
      <p>Current Player: {currentPlayer}</p>
    </div>
  );
}

export default App;
