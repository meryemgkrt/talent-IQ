import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';

const app = express();

// ES Module için __dirname alternatifi
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug Logs
console.log('🔍 NODE_ENV:', ENV.NODE_ENV);
console.log('🔍 __dirname:', __dirname);

// API Routes (static middleware'den ÖNCE tanımla)
app.get('/health', (req, res) => {
  res.status(200).json({ msg: 'Hello, World! Server is up and running.' });
});

app.get('/books', (req, res) => {
  res.status(200).json({ msg: 'List of books will be here.' });
});

// Production için static dosyalar ve SPA routing
if (ENV.NODE_ENV === 'production') {
  // Path: /app/backend/src -> /app/frontend/dist
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  
  console.log('📁 Frontend Path:', frontendPath);
  
  // Static dosyalar
  app.use(express.static(frontendPath, {
    maxAge: '1d',
    index: false // index.html'i otomatik serve etme
  }));

  // SPA için fallback
  app.get('*', (req, res) => {
    console.log('🔄 Fallback route triggered:', req.path);
    res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
      if (err) {
        console.error('❌ Error sending index.html:', err);
        res.status(500).send('Internal Server Error');
      }
    });
  });
}

const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = ENV.PORT || 8080;
    
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`✅ Environment: ${ENV.NODE_ENV || 'development'}`);
      console.log(`🌐 Access URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();