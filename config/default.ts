export default {
    port: 3000,
    dbUri: "postgres://seragurbuz@localhost:5432/lawyer_app",
    dbConfig: {
      host: 'localhost',
      port: 5432,
      user: 'seragurbuz',
      password: 'password',
      database: 'lawyer_app',
    },
    accessTokenTtl: "1h",
    refreshTokenTtl: "1y",
    accessTokenPrivateKey: ``,
    accessTokenPublicKey: ``,
    refreshTokenPrivateKey: ``,
    refreshTokenPublicKey: ``,
}