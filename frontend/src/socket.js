
import { io } from 'socket.io-client';

const socket = io('http://localhost:8000'); // Connect to the server

export default socket;
