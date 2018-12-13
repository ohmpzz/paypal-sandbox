import app from './src/index.js';

const server = app;

const PORT = process.env.PORT || 3000;

server.listen(PORT, err => {
  if (err) throw err;
  console.log(`server running on port:: ${PORT}`);
});
