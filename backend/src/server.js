import express from 'express';
import path from 'path';
import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';

const app = express();
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes (static middleware'den ÖNCE tanımla)
app.get('/health', (req, res) => {
  res.status(200).json({ msg: 'Hello, World! Server is up and running.' });
});

app.get('/books', (req, res) => {
  res.status(200).json({ msg: 'List of books will be here.' });
});

// Production için static dosyalar ve SPA routing
if (ENV.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  
  // Static dosyalar
  app.use(express.static(frontendPath));

  // SPA için fallback - Express 5 syntax
  app.use((req, res, next) => {
    // Eğer dosya yoksa index.html'e yönlendir
    if (!req.path.includes('.')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    } else {
      next();
    }
  });
}

const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = ENV.PORT || 8080;
    
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`✅ Environment: ${ENV.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();