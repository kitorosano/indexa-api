import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// Endpoint para verificar el estado del servidor
// Request: lo que envia el usuario
// Response: lo que responde el servidor, siempre tiene un codigo de estado, y puede tener un cuerpo
// Codigo de estado: 200 (Todo esta OK)
app.get('/health', function (request, response) {
  response.status(200).send('Server is healthy');
});

const users = [
  { id: 1, name: "User1", email: "uno@prueba.com", password: "111111"},
  { id: 2, name: "User2", email: "dos@prueba.com", password: "222222"}
] 

// Endpoints de Usuarios
app.post('/users', function (req, res) {
  // Validar datos de entrada
  if (
    req.body.name === '' ||
    req.body.email === '' ||
    req.body.password === ''
  ) {
    return res.status(400).json({
      message: 'Todos los campos son obligatorios',
    });
  }
  
  // Validar si existe usuario con email
  const foundUser = users.find(function (user) {
    return user.email === req.body.email
  })

  if (foundUser) {
    return res.status(409).json({
      message: "Ya existe un usuario con ese email"
    })
  }

  // Hashear la password

  // Crear nuevo usuario
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }

  // Insertar nuevo usuario en la tabla;
  users.push(newUser)

  // Devolver el nuevo usuario al cliente
  return res.status(201).json({
    message: "Usuario registrado correctamente",
    user: newUser
  })
});

app.listen(PORT, function () {
  console.log(`Server is running on http://localhost:${PORT}`);
});
