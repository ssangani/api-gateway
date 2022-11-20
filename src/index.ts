import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

app
  .use(helmet())
  .use(bodyParser.json())
  .use(cors())
  .use(morgan('combined'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3030, () => {
  console.log("Server started");
});
