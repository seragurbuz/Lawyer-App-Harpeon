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
    smtp: {
      user: 'a3gnladnnvx2tgdg@ethereal.email',
      pass: 'VTJ98W5Bcy9qWX84zW',
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
    },
}