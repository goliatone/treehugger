var E = require('..')
        .config({namespace:'NODE'})
        .write({user:'goliatone', passwoord:'secret'})
        .on('write', function(ENV){
            console.log(JSON.stringify(ENV, null, 4));
        });


