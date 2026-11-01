const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('./index');

let ioInstance = null;

const roomFor = (role, key) => `${role}:${key}`;

const initSocket = (server) => {
  ioInstance = new Server(server, {
    cors: { origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(','), credentials: true },
  });

  ioInstance.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next();
    try {
      socket.data.actor = jwt.verify(token, config.jwtSecret);
    } catch (_error) {
      socket.data.actor = null;
    }
    next();
  });

  ioInstance.on('connection', (socket) => {
    const actor = socket.data.actor;
    if (actor?.role === 'authority' && actor.organization) socket.join(roomFor('authority', actor.organization));
    if (actor?.role === 'citizen' && actor.id) socket.join(roomFor('citizen', actor.id));
    if (actor?.role === 'admin') socket.join(roomFor('admin', 'global'));

    socket.on('join-room', ({ role, key }) => {
      if (role && key) socket.join(roomFor(role, key));
    });
  });

  return ioInstance;
};

const getIO = () => ioInstance;

const emitToRoom = (role, key, event, payload) => {
  if (!ioInstance) return;
  ioInstance.to(roomFor(role, key)).emit(event, payload);
};

module.exports = { initSocket, getIO, emitToRoom, roomFor };