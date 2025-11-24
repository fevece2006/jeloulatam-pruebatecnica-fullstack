import 'dotenv/config';
import 'reflect-metadata';
import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api/docs`);
});