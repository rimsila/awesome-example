import { useSocket } from "../hooks/useSocket";
import { useEffect, useState } from "react";

export default function Home() {
  const { socketOn, socketEmit, isConnected } = useSocket(
    "http://localhost:4000"
  );
  const [msg, setMsg] = useState("");

  useEffect(() => {
    socketOn("chatMessage", (data: string) => {
      console.log(`Received message: ${data}`);
      setMsg(data);
    });
  }, []);

  useEffect(() => {
    socketEmit("joinRoom", 1);
  }, []);

  const sendMessage = () => {
    socketEmit("chatMessage", { roomId: 2, message: "Hello, world!" });
  };

  return (
    <div>
      <p>{msg}</p>
      <button onClick={sendMessage} disabled={!isConnected}>
        Send
      </button>
    </div>
  );
}
