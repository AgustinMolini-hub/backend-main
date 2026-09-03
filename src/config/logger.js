import winston from 'winston';
import 'winston-daily-rotate-file';

import config from './env.config.js';


const {
    combine,
    timestamp,
    printf,
    colorize
} = winston.format;


// ==========================
// Niveles personalizados ShipNow
// ==========================

const customLevels = {

    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },

    colors: {
        fatal: 'magenta',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'cyan',
        debug: 'blue'
    }

};


winston.addColors(
    customLevels.colors
);


// ==========================
// Formato general
// ==========================

const logFormat = printf(
    ({
        level,
        message,
        timestamp
    }) => {

        return `${timestamp} [${level}] ${message}`;

    }
);


// ==========================
// Formato consola
// ==========================

const consoleFormat = combine(

    colorize(),

    timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),

    logFormat

);


// ==========================
// Formato archivos
// ==========================

const fileFormat = combine(

    timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),

    logFormat

);


// ==========================
// Transportes
// ==========================

const transports = [

    new winston.transports.Console({

        level:
            config.logLevel,

        format:
            consoleFormat

    }),

    new winston.transports.DailyRotateFile({

        filename:
            'logs/error-%DATE%.log',

        datePattern:
            'YYYY-MM-DD',

        level:
            'error',

        maxFiles:
            '14d',

        maxSize:
            '10m',

        format:
            fileFormat

    })

];


// ==========================
// Logger principal
// ==========================

const logger = winston.createLogger({

    levels:
        customLevels.levels,

    level:
        config.logLevel,

    format:
        fileFormat,

    transports,

    exitOnError:
        false

});


export default logger;