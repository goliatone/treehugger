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
    defaultNamespace: 'NODE',
    loadedFlag: 'TREEHUGHER',
    getEnvironment: function(){
        return process.env;
    }
};

function TreeHugger(config){
    EventEmitter.call(this);
    config = extend({}, this.constructor.DEFAULTS, config);
    if(config.autoinitialize ) this.init(config);
}
_inherit(TreeHugger, EventEmitter);

TreeHugger.DEFAULTS = DEFAULTS;

TreeHugger.load = function(config){
    return new TreeHugger().load(config);
};

TreeHugger.save = function(config){
    return new TreeHugger().save(config);
};

TreeHugger.prototype.init = function(config){
    if(this.initialized) return;
    this.initialized = true;

    extend(this, this.constructor.DEFAULTS, config);

    this.ENV = this.getEnvironment();
};

TreeHugger.prototype.load = function(config){
    assert.isObject(config, 'You need to pass in an options object');
    assert.isObject(config.data, 'You need to pass in an object to be loaded');

    var env = this._loadedFlag(config.name);
    if(this.ENV[env]) return;

    this.ENV[env] = Date.now();

    var name, namespace = config.name || this.defaultNamespace;
    Object.keys(config.data).map(function(key){
        name = this._environmentKey(key, namespace);
        this.ENV[name] = config.data[key];
    }, this);

    /*
     * Let's make the process async, so we
     * can register listeners on constructor
     */
    process.nextTick(function(){
        this.emit('loaded', this.ENV);
    }.bind(this));

    return this;
};

TreeHugger.prototype.save = function(config){
    config = config || {name: this.defaultNamespace};

    var env = {}, name;
    var rx = new RegExp('^' + config.name + this.glue);
    Object.keys(this.ENV).map(function(key){
        if(!rx.test(key)) return;
        name = this._variableName(key, config.name);
        env[name] = this.ENV[key];
    }, this);

    //TODO: Should we enable filtering or post process?

    process.nextTick(function(){
        this.emit('saved', env);
    }.bind(this));

    return this;
};

TreeHugger.prototype._loadedFlag = function(appname){
    var namespace = this.defaultNamespace + this.glue + this.loadedFlag;
    return this._environmentKey(appname, namespace);
};

TreeHugger.prototype._environmentKey = function(str, namespace){
    str = str || '', namespace = namespace || this.defaultNamespace;
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
