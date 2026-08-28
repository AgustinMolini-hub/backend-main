import winston from 'winston';
import 'winston-daily-rotate-file';

const {
    combine,
    timestamp,
    printf,
    colorize
} = winston.format;

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

winston.addColors(customLevels.colors);

const logFormat = printf(({ level, message, timestamp: time }) => {
    return `${time} [${level}] ${message}`;
});

const consoleFormat = combine(
    colorize(),
    timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    logFormat
);

const fileFormat = combine(
    timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    logFormat
);

const transports = [
    new winston.transports.Console({
        level: process.env.NODE_ENV === 'production'
            ? 'info'
            : 'debug',
        format: consoleFormat
    }),

    new winston.transports.DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxFiles: '14d',
        maxSize: '10m',
        format: fileFormat
    })
];

const logger = winston.createLogger({
    levels: customLevels.levels,
    level: process.env.NODE_ENV === 'production'
        ? 'info'
        : 'debug',
    format: fileFormat,
    transports,
    exitOnError: false
});

export default logger;
