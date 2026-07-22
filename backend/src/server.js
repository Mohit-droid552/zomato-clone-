import app from './app.js';
import { connectDB } from './config/db.js';
import { PORT } from './config/env.js';

// Connect to MongoDB Database
connectDB();

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
