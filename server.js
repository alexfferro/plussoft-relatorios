const express = require('express');
const path = require('path');
const cors = require('cors')
const reportsRoutes = require('./src/routes/report');

const app = express();
const port = 3333;
app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/pages/index.html'));
});
app.get('/create-report', (req, res) => {
  res.sendFile(path.join(__dirname, '/pages/createReport.html'));
});

app.get('/files/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'public/files', req.params.filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Erro ao enviar arquivo:', err);
      res.status(404).send('Arquivo não encontrado');
    }
  });
});

app.use('/api/reports', reportsRoutes);

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://192.168.5.23:${port}`);
});
