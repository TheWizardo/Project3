import express from 'express';
import catchAll from './3-middleware/catch-all';
import routeNotFound from './3-middleware/route-not-found';
import authController from './6-controllers/auth-controller';
import vacationsController from './6-controllers/vacations-controller';
import imagesController from './6-controllers/images-controller';
import destinationController from './6-controllers/destinations-controller';
import expressFileUpload from 'express-fileupload';
import expressRateLimit from 'express-rate-limit';
import cors from 'cors';
import logger from './3-middleware/logger-mw';
import config from './2-utils/config';
import sanitize from './3-middleware/sanitize';

const server = express();

server.use(cors());
server.use("/", expressRateLimit({windowMs: 500, max: 20, message: "Please try again later"}));

server.use(express.json());
server.use(sanitize);
server.use(expressFileUpload());
server.use(logger); ///////////////////////////////////////////////////////////////////////////////////////////////
server.use("/", authController);
server.use("/", imagesController);
server.use("/", vacationsController);
server.use("/", destinationController);
server.use("*", routeNotFound);
server.use(catchAll);

server.listen(config.port, () => console.log(`Listening on http://localhost:${config.port}`))