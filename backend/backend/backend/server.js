// server.js - minimal express bootstrap
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const devicesRoute = require('./src/routes/devices');
const updatesRoute = require('./src/routes/updates');
const keysRoute = require('./src/routes/keys');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/devices', devicesRoute);
app.use('/api/updates', updatesRoute);
app.use('/api/keys', keysRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`nmz update server listening on ${PORT}`));
