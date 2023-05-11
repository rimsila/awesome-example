import React, { useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import classnames from "classnames";
import { enterEtvWrapper } from "../../utils/dom";
import { Button, Modal } from "antd";
import { useLocalStorageState, useUpdateEffect } from "ahooks";
import Router from "next/router";

export default function Home() {
  const { socketOn, socketEmit, isConnected } = useSocket(
    "http://localhost:4000",
    {
      onConnectFailed: () => {
        Modal.destroyAll();
        Modal.error({
          title: "Server Error",
          content: "Socket server is not connect",
          onOk: ()=> {
            Router.back()
            Modal.destroyAll();
          },
          okText: "Back Home",
        });
      },
    }
  );

  const [messages, setMessages] = useLocalStorageState<string[]>(
    "messages-state",
    { defaultValue: [] }
  );
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

  const renderEmpty = <h3>No chat history</h3>;
  const renderChat = messages.map((message, index) => (
    <div
      key={index}
      className="max-w-sm p-3 mb-2 rounded-lg bg-blue-400 text-white"
    >
      {message}
    </div>
  ));

  const isHasData = messages?.length > 0;

  return (
    <div className="flex flex-col h-screen w-full max-w-xl mx-auto">
      <div
        className={classnames(
          "flex flex-col flex-grow p-4 overflow-y-auto bg-gray-100",
          !isHasData && "items-center justify-center"
        )}
      >
        {isHasData ? renderChat : renderEmpty}
      </div>

      <div className="flex p-4 bg-gray-200">
        <input
          type="text"
          className="flex-grow px-4 py-2 mr-4 text-gray-700 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Type your message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={enterEtvWrapper(sendMessage)}
        />
        <Button onClick={sendMessage} disabled={!isConnected} type="primary">
          Send
        </Button>
      </div>
    </div>
  );
}
