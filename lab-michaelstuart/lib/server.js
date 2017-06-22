'use strict';

const http = require('http');
const uuid = require('uuid');
const router = require('./router');
const User = require('./user');
const database = require('../model/database');
const headWrite = require('./head-write');

router.post('/api/user', (req, res) => {
  const { name, password, email } = req.body;
  if (!name || !password || ! email) return headWrite(res, 400);
  const user = new User(name, password, email, uuid.v1());
  database[user.id] = user;
  headWrite(res, 200, `user ${name} successfully added`);
});

router.get('/api/user', (req, res) => {
  const id = req.url.query.id;
  if (!id) {
    const userList = JSON.stringify((Object.keys(database) || []).map(v => v));
    return headWrite(res, 200, userList);
  }
  if (!database[id]) return headWrite(res, 404);
  headWrite(res, 200, JSON.stringify(database[id]));
});

router.put('/api/user', (req, res) => {
  const id = req.url.query.id || req.body.id;
  if (!database[id] || !id) return headWrite(res, 400);
  database[id] = Object.assign({}, database[id], req.body);
  headWrite(res, 200, `user ${name} successfully updated`);
});

router.delete('/api/user', (req, res) => {
  const id = req.url.query.id;
  if (!database[id]) return headWrite(res, 400);
  delete database[id];
  headWrite(res, 204);
});

module.exports = http.createServer(router.route);
