export default () => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_DATABASE || 'postgres',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET || 'secret',
    jwtExpiresInt: parseInt(process.env.JWT_EXPIRES_IN) || 3600,
  },
  port: parseInt(process.env.PORT) || 3000,
  saltRounds: parseInt(process.env.SALT_ROUNDS),
});
