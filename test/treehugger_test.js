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

        it('should provide a "write" method', function(){
            assert.isFunction(Env.write);
        });

        it('should provide a "read" method', function(){
            assert.isFunction(Env.read);
        });
    });

    describe('write', function(){
        it('should write ENV using NODE default namespace', function(done){
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

            e.write(data);

            e.on('write', function(env){
                assert.equal(env.NODE_USERNAME, expected.NODE_USERNAME);
                assert.equal(env.NODE_PASSWORD, expected.NODE_PASSWORD);
                done();
            });
        });

        it.only('should provide a top level "write" that handles multiple args', function(){
            var expected = function(){ return {}};
            var e = Env.config({
                getEnvironment: expected
            }).write({});

            assert.equal(e.getEnvironment, expected);
        });

        it('should provide a top level "write"', function(done){
            var expected = {
                NODE_USERNAME: 'goliatone',
                NODE_PASSWORD: 'secret'
            };

            var ENV = {};

            var data = {
                username: 'goliatone',
                password: 'secret'
            };

            Env.config({
                getEnvironment: function(){
                    return ENV;
                }
            }).write(data).on('write', function(env){
                assert.equal(env.NODE_USERNAME, expected.NODE_USERNAME);
                assert.equal(env.NODE_PASSWORD, expected.NODE_PASSWORD);
                done();
            });
        });
    });


    describe('read', function(){
        it('should read ENV', function(done){
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

            e.read();

            e.on('read', function(env){
                assert.equal(env.username, expected.username);
                assert.equal(env.password, expected.password);
                done();
            });
        });
    });

});