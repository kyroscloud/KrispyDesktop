const express = require('express');
const app = express();
const httpServer = require("http").createServer(app);
const databases = require('./databases');

const ObjectId = require('mongodb').ObjectId;
//const async = require('async');
//const config = require('./config');

const NodeRoutes = require('./nodeRoutes/nodeRoutes')
const WorkshopRoutes = require('./workshop/workshop')

databases().then(databases => {
    app.databases = databases
})

app.use('/api/nodeRoutes', NodeRoutes)
app.use('/api/workshops', WorkshopRoutes)

httpServer.listen(8080, () => console.log(`Thar be a server here, arrggg...`));