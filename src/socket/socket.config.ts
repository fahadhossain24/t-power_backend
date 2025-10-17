import { Server as SocketIOServer } from 'socket.io';
import SocketManager from './socket.manager';

const configSocket = (io: SocketIOServer): void => {
  const socketManager = SocketManager.getInstance();
  socketManager.init(io);
};

export default configSocket;