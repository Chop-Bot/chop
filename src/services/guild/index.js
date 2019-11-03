const SocketServer = require('socket.io');

const log = require('../../config/log');

module.exports = function guildRelay(httpServer) {
  const io = new SocketServer(httpServer);

  io.on('connection', (socket) => {
    log.info('[GuildRelay] A user connected!');
    socket.on('disconnect', () => {
      log.info('[GuildRelay] A user disconnected!');
    });
    socket.on('chat', console.log);
  });
};
