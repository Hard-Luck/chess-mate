import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function Home() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomIdInput, setRoomIdInput] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to server");
    });

    if (roomId) {
      socket.on("message", (message: string) => {
        console.log(message);
      });
    }

    return () => {
      socket.off("connect");
      if (roomId) {
        socket.off(roomId);
      }
    };
  }, [roomId]);

  function generateRoomId() {
    const newRoomId = uuidv4();
    console.log(newRoomId);
    setRoomId(newRoomId);
    socket.emit("joinRoom", newRoomId);
    setRoomIdInput("");
  }

  function handleRoomIdInput(e: React.ChangeEvent<HTMLInputElement>) {
    setRoomIdInput(e.target.value);
  }

  function joinRoom() {
    socket.emit("joinRoom", roomIdInput);
    setRoomId(roomIdInput);
  }

  function sendMessage() {
    if (!roomId) return;
    console.log(roomId);
    socket.emit("sendMessageToRoom", { roomId, message });
    setMessage("");
  }

  return (
    <main className="bg-slate-400">
      <div className="joinRoom">
        <p>{roomId}</p>
        <button onClick={() => generateRoomId()}>Set Room ID</button>
        <input
          className="border-black border-2"
          onChange={handleRoomIdInput}
          type="text"
          value={roomIdInput}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
      <div className="bg-green-500">
        <input
          className="border-black border-2"
          type="text"
          placeholder="message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>
    </main>
  );
}
export default Home;
