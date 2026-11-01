const { Notification } = require('../models');
const { emitToRoom } = require('../config/socket');

const createNotification = async ({ recipientType, recipientKey, title, message, eventType, payload = {} }) => {
  const notification = await Notification.create({
    recipientType,
    recipientKey,
    title,
    message,
    eventType,
    payload,
  });

  emitToRoom(recipientType, recipientKey, 'notification:new', notification.toJSON());
  return notification;
};

const broadcastNotification = async ({ title, message, eventType, payload = {} }) => {
  const notification = await Notification.create({
    recipientType: 'broadcast',
    recipientKey: 'global',
    title,
    message,
    eventType,
    payload,
  });

  // Broadcast to ALL connected clients since this is a public broadcast
  const { getIO } = require('../config/socket');
  const io = getIO();
  if (io) {
    io.emit('notification:broadcast', notification.toJSON());
  }
  return notification;
};

module.exports = {
  createNotification,
  broadcastNotification,
};