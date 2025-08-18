const express = require('express');
const app = express();

// Allow PORT to be injected by the platform (Render/Railway/Heroku/etc.)
const PORT = process.env.PORT || 9001;
const HOST = '0.0.0.0';

app.get('/', (req, res) => {
  res.send('Servidor Express com Node.js!');
});

app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});