import http from 'http';
import expressSetup from './src/app/express.js';

async function start() {
  const app = await expressSetup();
  const server = http.createServer(app);

  server.listen(3000, () => {
      console.log('Server running on port 3000...');
  });
}

start();