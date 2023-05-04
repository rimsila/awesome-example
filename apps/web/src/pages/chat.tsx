import React, { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import classnames from 'classnames'
export default function Home() {
  const { socketOn, socketEmit, isConnected } = useSocket(
    "http://localhost:4000"
  );
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    socketOn("chatMessage", (data: string) => {
      console.log(`Received message: ${data}`);
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, []);

  useEffect(() => {
    socketEmit("joinRoom", 1);
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() === "") return;

    socketEmit("chatMessage", { roomId: 1, message: inputMessage });
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const renderEmpty = <h3>No chat history</h3>;
  const renderChat = messages.map((message, index) => (
    <div key={index} className="max-w-sm p-3 mb-2 rounded-lg bg-blue-400 text-white">
      {message}
    </div>
  ));

  const isHasData = messages?.length > 0

  return (
    <div className="flex flex-col h-screen w-full max-w-xl mx-auto">
      <div className={classnames('flex flex-col flex-grow p-4 overflow-y-auto bg-gray-100', !isHasData && 'items-center justify-center')}>
        { isHasData ? renderChat : renderEmpty}
      </div>

      <div className="flex p-4 bg-gray-200">
        <input
          type="text"
          className="flex-grow px-4 py-2 mr-4 text-gray-700 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Type your message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected}
          className={`px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg ${
            !isConnected ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
