import React, { useEffect, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import "./App.css";

function App() {
  const [connection, setConnection] = useState(null);
  const [player, setPlayer] = useState("");

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
      console.log("Your are ", player, " player");
      setPlayer(player);
    });

    newConnection.on("Log", (message) => {
      console.log("message :", message);
    });

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  const handleTest = () => {
    connection
      .invoke("Log", player + "call " + new Date().toString())
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <button onClick={handleTest}>test</button>
    </div>
  );
}

export default App;
