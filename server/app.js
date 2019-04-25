import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import router from './routes';
import errorHandler from './helpers/error';
import config from './utils/config';
import prod from './utils/prod';
import { dbTableSetup } from './db';

const swaggerDoc = YAML.load(path.join(process.cwd(), './server/docs/docs.yml'));

config();
dbTableSetup();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
prod(app);

app.get('/', (req, res) => res.status(200).json({
  status: res.statusCode,
  data: 'Welcome to the Very First Endpoint on Banka'
}));

app.use('/api/v1', router);
app.use(errorHandler);
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const port = process.env.PORT || 8000;
app.listen(port, console.log(`Server running on PORT ${port}`));

export default app;
