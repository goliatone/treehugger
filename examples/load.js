var E = require('..').config({namespace:'NVM'}).read({}).on('write', function(ENV){
    console.log(JSON.stringify(ENV, null, 4));
}).on('read', function(ENV){
    console.log(JSON.stringify(ENV, null, 4));
});


