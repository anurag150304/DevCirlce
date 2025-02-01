import 'dotenv/config';
import * as http from 'http';
import App from './app.js';
import * as socket from './socket.js';

const port = process.env.PORT || 3000;
const server = http.createServer(App);
socket.initializeSocket(server);

server.listen(port, () => console.log(`Server listining on port ${port}`));