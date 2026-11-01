const http = require('http');
const app = require('./app');
const config = require('./config');
const sequelize = require('./config/database');
const { initSocket } = require('./config/socket');

const startServer = async () => {
  try {
    await sequelize.authenticate();

    const server = http.createServer(app);
    initSocket(server);

    server.listen(config.port, () => {
      console.log(`FIX KARACHI backend listening on port ${config.port}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
};

startServer();