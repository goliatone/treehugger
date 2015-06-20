var E = require('..')
        .config({namespace:'NVM'})
        .read({})
        .on('read', function(ENV){
            console.log(JSON.stringify(ENV, null, 4));
        });


