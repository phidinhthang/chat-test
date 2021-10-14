import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocketInstance = () => {
  if (!socket) {
    socket = io(`${process.env.REACT_APP_API!}`);
  }

  return socket;
};
