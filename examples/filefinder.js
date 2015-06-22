var TreeHugger = require('..')
var Loader = require('../lib/filefinder');

Loader({
    parser: function(file){
        try {
            file = JSON.parse(file);
        } catch(e){
            throw new Error('Error parsing content', e);
        }
        return file;
    }
}).on('loaded', function(file){

    TreeHugger({namespace:'NODE'})
    .write(file)
    .on('write', function(ENV){
        console.log(JSON.stringify(ENV, null, 4));
    });

}).find('secrets.json', __dirname);

