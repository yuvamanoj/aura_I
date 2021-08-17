var createError = require('http-errors');
var express = require('express');
var compression = require('compression');
var path = require('path');
var cookieParser = require('cookie-parser');
const promBundle = require("express-prom-bundle");
const metricsMiddleware = promBundle({ includeMethod: true });
// const swaggerUi = require('swagger-ui-express');
// const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs')

// We must implement our own secret file loading mechanism as 'dotenv' does not
// innately have this capability, nor are there convenient libraries out there.
if (process.env.NODEJS_SECRETS_DIR) {
    const dir = fs.opendirSync(process.env.NODEJS_SECRETS_DIR)
    let dirent
    while ((dirent = dir.readSync()) !== null) {
        if (!dirent.name.startsWith("..")) {
            process.env[dirent.name] = fs.readFileSync(path.join(process.env.NODEJS_SECRETS_DIR, dirent.name), { encoding: 'utf8', flag: 'r' })
        }
    }
    dir.closeSync()
}

require('dotenv-defaults').config({ path: process.env.NODEJS_CONFIG_PATH ? process.env.NODEJS_CONFIG_PATH : path.resolve(process.cwd(), '.env') });
const logger = require('./lib/logger');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();
// view engine setup
app.use(compression());
app.use(metricsMiddleware);

const NODE_ENV = process.env.NODE_ENV || "production";

const port = process.env.PORT || 3000;
// if (NODE_ENV !== "production") {
//     app.use((req, res, next) => {
//         //Enabling CORS
//         res.header("Access-Control-Allow-Origin", "*"); //"http://localhost:4200");
//         res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT");
//         res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Origin, Content-Type, Accept");
//         res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Orign, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

//         if (req.method == 'OPTIONS') {
//             res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT");
//             return res.status(200).json({});
//         }
//         next();
//     });
// }

app.set('port', process.env.PORT || 3001);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, process.env.APP_DIRECTORY || "")));

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.get('/liveness', (req, res) => {
    res.status(200).json({
        msg: 'Application is Live'
    });
});

app.get('/readiness', (req, res) => {
    res.status(200).json({
        msg: 'Application is Ready'
    });
});


app.get('/health', (req, res) => {
    res.status(200).json({
        msg: 'Application is Healthy'
    });
});


app.get('/info', (req, res) => {
    res.status(200).json({
        BUILD_INFO: process.env.BUILD_INFO ? process.env.BUILD_INFO : 'BUILD_INFO not available',
        NODE_ENV: process.env.NODE_ENV
    })
})

const client = require('prom-client');
const counter = new client.Counter({
    name: 'my_custom_metric',
    help: 'my_custom_metric_help_info',
});
counter.inc(10); // Increment by 10

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// app.use(function(req, res, next) {
//   // logger(req, res);
//   // next(createError(404));
// });

// error handler
// app.use(function(err, req, res) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

app.listen(port, () => {
    logger.info(`Express API server running against NODE_ENV: ${NODE_ENV} at localhost:${port}`)
});

module.exports = app;