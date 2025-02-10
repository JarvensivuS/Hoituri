import express from 'express';

const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello from Seniliisaver backend!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});