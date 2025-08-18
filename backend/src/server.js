const express = require('express');
const app = express();
const port = 9001;

app.get('/', (req, res) => {
  res.send('Servidor Express com Node.js!');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});