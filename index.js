require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;

// middlewares
app.use(express.json());

// rutas
const usuariosRouter = require('./src/routes/alumnos.route');

app.use('/usuarios', usuariosRouter);


app.listen(PORT, () => {
    console.log(`API escuchando en el puerto ${PORT}`);
});