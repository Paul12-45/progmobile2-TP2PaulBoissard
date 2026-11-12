// Important : Cet import doit être le TOUT PREMIER.
// Il charge dotenv.config() avant que les autres modules (comme app.ts, routes, et auth.ts)
// ne soient importés, assurant que les variables d'environnement sont chargées au bon moment.
import './database/bd.ts';
import * as http from 'http';
import app from './app.ts';


const normalizePort = (val: string): number | string | boolean => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = (error: NodeJS.ErrnoException): void => {
    console.log(error);
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);
