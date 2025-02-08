import React, { useEffect, useRef, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import "./App.css";
import Board from "./components/Board";
import { createArray } from "./constant/arr";

function App() {
  const [connection, setConnection] = useState(null);
  const [player, setPlayer] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const size = 10;
  const lines = createArray(size, size);
  const handleOutput = (row, col) => {
    lines[row][col] = player;
  };
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
        newConnection.invoke("JoinGame");
      })
      .catch((err) => console.error("Connection failed: ", err));

    newConnection.on("YourPlayer", (player) => {
      setPlayer(player);
      setMessages((prevMessages) => [
        ...prevMessages,
        `Bạn là người chơi ${player}`,
      ]);
    });

    newConnection.on("Log", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
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

  const handleTest = () => {
    if (connection) {
      connection
        .invoke("Log", `${player} vừa đi`)
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="w-[100%] h-full flex flex-row">
      <div className="w-[80%] border h-screen overflow-scroll flex justify-center items-center">
        <Board
          initialLines={lines}
          player={player}
          handleOutput={handleOutput}
        />
      </div>
      <div className="fixed right-0 top-0 bg-purple-200 w-[20%] h-screen flex flex-col space-y-2 p-2 overflow-auto">
        {messages.map((msg, index) => (
          <div key={index} className="p-1 border-b">
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default App;
