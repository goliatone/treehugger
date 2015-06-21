/*
 * treehugger
 * https://github.com/goliatone/treehugger
 *
 * Copyright (c) 2015 goliatone
 * Licensed under the MIT license.
 */

var extend = require('gextend');
var _inherit = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var assert = require('assert-is');

var DEFAULTS = {
    autoinitialize: true,
    glue: '_',
    markAsLoaded: true,
    deleteAfterLoad: false,
    namespace: 'NODE',
    loadedFlag: 'TREEHUGHER',
    getEnvironment: function(){
        return process.env;
    }
};

function TreeHugger(config){

    if(!(this instanceof TreeHugger)){
        return new TreeHugger(config);
    }

    EventEmitter.call(this);
    config = extend({}, this.constructor.DEFAULTS, config);
    if(config.autoinitialize ) this.init(config);
}
_inherit(TreeHugger, EventEmitter);

TreeHugger.DEFAULTS = DEFAULTS;

TreeHugger.config = function(options){
    TreeHugger.options = options;
    return TreeHugger;
};

TreeHugger.write = function(data){
    var options = extend({}, TreeHugger.options);
    TreeHugger.options = {};
    return new TreeHugger(options).write(data);
};

TreeHugger.read = function(data){
    var options = extend({}, TreeHugger.options);
    TreeHugger.options = {};
    return new TreeHugger(options).read(data);
};

TreeHugger.prototype.init = function(config){
    if(this.initialized) return;
    this.initialized = true;

    extend(this, this.constructor.DEFAULTS, config);

    this.ENV = this.getEnvironment();
};

TreeHugger.prototype.write = function(data){
    assert.isObject(data, 'You need to pass in a data object');

    var env = this._loadedFlag(this.namespace);
    if(this.ENV[env]) return this.emitNext('write', this.ENV);

    this.ENV[env] = Date.now();

    var name, namespace = this.namespace;
    Object.keys(data).map(function(key){
        name = this._environmentKey(key, namespace);
        this.ENV[name] = data[key];
    }, this);

    /*
     * Let's make the process async, so we
     * can register listeners on constructor
     */
    this.emitNext('write', this.ENV);

    return this;
};

TreeHugger.prototype.read = function(output){
    output = output || {};

    var env = {}, name;
    var rx = new RegExp('^' + this.namespace + this.glue);
    Object.keys(this.ENV).map(function(key){
        if(!rx.test(key)) return;
        name = this._variableName(key, this.namespace);
        output[name] = this.ENV[key];
    }, this);

    //TODO: Should we enable filtering or post process?

    return this.emitNext('read', output);
};

TreeHugger.prototype.emitNext = function(type, payload){
    process.nextTick(function(){
        this.emit(type, payload);
    }.bind(this));

    return this;
};

TreeHugger.prototype._loadedFlag = function(appname){
    var namespace = this.namespace + this.glue + this.loadedFlag;
    return this._environmentKey(appname, namespace);
};

TreeHugger.prototype._environmentKey = function(str, namespace){
    str = str || '', namespace = namespace || this.namespace;
    str = namespace + this.glue + str;
    str = str.replace(/\W+/g, this.glue)
             .replace(/([a-z\d])([A-Z])/g, '$1' + this.glue + '$2');
    str = str.toUpperCase();
    return str;
};

TreeHugger.prototype._variableName = function(str, namespace){

    function _capitalize(s){
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    }

    function _downcase(s){
        return s.charAt(0).toLowerCase() + s.slice(1);
    }

    str = str.replace(new RegExp('^' + namespace + this.glue), '');
    return _downcase(str.split(this.glue).reduce(function(out, key){
        return out + _capitalize(key);
    }, ''));
};


TreeHugger.prototype.logger = console;

module.exports = TreeHugger;
