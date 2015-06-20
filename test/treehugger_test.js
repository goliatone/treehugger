'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var path = require('path');
var fixture = path.resolve.bind(path, __dirname, 'fixtures');

var Env = require('..');

sinon.assert.expose(assert, { prefix: "" });

describe('TreeHugger', function(){

    describe('constructor', function(){
        it('should provide a DEFAULTS object', function(){
            assert.isObject(Env.DEFAULTS);
        });

        it('should provide a "load" method', function(){
            assert.isFunction(Env.load);
        });

        it('should provide a "save" method', function(){
            assert.isFunction(Env.save);
        });
    });

    describe('load', function(){
        it('should load ENV', function(done){
            var expected = {
                NODE_USERNAME: 'goliatone',
                NODE_PASSWORD: 'secret'
            };

            var ENV = {};

            var data = {
                username: 'goliatone',
                password: 'secret'
            };

            var e = new Env({
                getEnvironment: function(){
                    return ENV;
                }
            });

            e.load({data: data});

            e.on('loaded', function(env){
                assert.equal(env.NODE_USERNAME, expected.NODE_USERNAME);
                assert.equal(env.NODE_PASSWORD, expected.NODE_PASSWORD);
                done();
            });
        });
    });


    describe('save', function(){
        it('should save ENV', function(done){
            var expected = {
                username: 'goliatone',
                password: 'secret'
            };

            var ENV = {
                NODE_USERNAME: 'goliatone',
                NODE_PASSWORD: 'secret'
            };

            var data = {
                username: 'goliatone',
                password: 'secret'
            };

            var e = new Env({
                getEnvironment: function(){
                    return ENV;
                }
            });

            e.save();

            e.on('saved', function(env){
                assert.equal(env.username, expected.username);
                assert.equal(env.password, expected.password);
                done();
            });
        });
    });

});