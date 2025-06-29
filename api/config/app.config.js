const appConfig = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/cooking-certification',
  bcryptRounds: 12,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  rateLimitWindow: 6000, // 15 minutes
  rateLimitMax: 100 // requests per window
};

module.exports = appConfig; 