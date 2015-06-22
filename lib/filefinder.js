var extend = require('gextend');
var VError = require('verror');
var _inherit = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

var DEFAULTS = {
    autoinitialize: true,
    maxRecursions: 50,
    parser: function(file){
        return file;
    }
};

function FileFinder(config){
    if(!(this instanceof FileFinder)) return new FileFinder(config);

    EventEmitter.call(this);
    config = extend({}, this.constructor.DEFAULTS, config);
    if(config.autoinitialize ) this.init(config);
};
_inherit(FileFinder, EventEmitter);

FileFinder.DEFAULTS = DEFAULTS;

FileFinder.prototype.init = function(config){
    if(this.initialized) return;
    this.initialized = true;

    extend(this, this.constructor.DEFAULTS, config);
};

FileFinder.prototype.find = function(filename, filepath){
    if(this.i) this.i++;
    else this.i = 0;

    if(this.i > this.maxRecursions) process.exit(0);

    console.log(filename, filepath);

    var join = require('path').join;
    var dirname = require('path').dirname;
    var basename = require('path').basename;
    var fs = require('fs');
    var self = this;

    function read(path){
        fs.readFile(path, 'utf-8', function(err, file){

            if(file){
                file = self.parser(file);
                return self.emit('loaded', file);
            }

            file = basename(path);
            var dir = dirname(path);
            dir = dirname(dir);
            console.log('read', dir, path)
            walk.call(self, file, dir);
        });
    }

    var name = basename(filename);

    if(name === filename){
        filepath = filepath || __dirname;
        filename = join(filepath, filename);
    }

    read(filename);

    return this;
};

FileFinder.prototype.write = function(filename, content){
    var saved = function(err){
        if(err) this.emit('error', new VError(err));
    }.bind(this);

    fs.writeFile(filename, content, saved);

    return this;
};

FileFinder.prototype.logger = console;

module.exports = FileFinder;
