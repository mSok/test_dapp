// dev-server.js
const express = require('express');
const app = express();
// Import routes
var api = require('./_routes');   // <-- or whatever you do to include your API endpoints and middleware
app.set('port', 9000);
app.use('/api', api);
app.listen(app.get('port'), function() {
    console.log('Node App Started');
});