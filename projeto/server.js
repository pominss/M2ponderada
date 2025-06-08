// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const index = require('./routes/index');
const userRoutes = require('./routes/userRoutes');
const frontRoutes = require('./routes/frontRoutes');
const path = require('path');

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configure EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Usando as rotas definidas
app.use('/api', userRoutes);
app.use('/api', index);
app.use('/', frontRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});