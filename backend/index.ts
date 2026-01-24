import { connectDB } from "./src/config/database";
import app from "./src/app";
import http from 'http';
import { initializeSocket } from "./src/utils/socket";


const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);




connectDB().then(() => {
  const io = initializeSocket(httpServer);
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to start server:", error);
});