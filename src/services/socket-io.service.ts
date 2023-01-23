import socketio from 'socket.io';
import http from 'http';

const io = (server: http.Server) => {
  const io = new socketio.Server(server);

  io.on('connection', (socket: socketio.Socket) => {
    console.log('a user is connected', socket.id);

    socket.on('disconnect', () => {
      console.log('a user is disconnected', socket.id);
      socket.disconnect(true);
    });
  });

  return io;
};

export default io;