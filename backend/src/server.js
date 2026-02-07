import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';

const app = express();

// ES Module için __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug
console.log('🔍 NODE_ENV:', ENV.NODE_ENV);
console.log('🔍 __dirname:', __dirname);

// API Routes
app.get('/health', (req, res) => {
  res.status(200).json({ msg: 'Hello, World! Server is up and running.' });
});

app.get('/books', (req, res) => {
  res.status(200).json({ msg: 'List of books will be here.' });
});

// Production: Static files + SPA routing
if (ENV.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  
  console.log('📁 Frontend Path:', frontendPath);
  
  app.use(express.static(frontendPath));

  // Catch-all route (Express 4 ile çalışır)
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
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