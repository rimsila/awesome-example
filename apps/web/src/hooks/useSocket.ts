import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket, SocketOptions } from 'socket.io-client';

type EventListeners = { [event: string]: (...args: any[]) => void };


export const useSocket = (
  url: string,
  options?: SocketOptions,
) => {
  const [isConnected, setIsConnected] = useState(false);
  const eventListenersRef = useRef<EventListeners>({});
  const socketRef = useRef<Socket>();

  const socketOn = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      if (socketRef.current) {
        if (eventListenersRef.current[event]) {
          console.warn(
            `An event listener was already registered for event "${event}".`
          );
          return;
        }
        socketRef.current.on(event, callback);
        eventListenersRef.current[event] = callback;
      }
    },
    []
  );

  const socketEmit = useCallback(
    (event: string, ...args: any[]) => {
      socketRef.current?.emit(event, ...args);
    },
    []
  );

  useEffect(() => {
    socketRef.current = io(url, options);

    socketRef.current.on("connect", () => {
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      for (const event in eventListenersRef.current) {
        socketRef.current?.off(event, eventListenersRef.current[event]);
      }
      eventListenersRef.current = {};
      socketRef.current?.disconnect();
    };
  }, []);

  return { isConnected, socketOn, socketEmit };
};