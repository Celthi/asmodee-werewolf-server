
const net = require('../net');
const assert = require('assert');

const Role = require('../../game/Role');

module.exports = {
	name: 'Fetch roles',
	run: async function () {
		let roles = [];
		for (let i = 0; i < 10; i++) {
			let role = Role.enums[Math.floor(Math.random() * Role.enums.length)];
			roles.push(role.toNum());
		}

		let res = await net.POST('room', {roles});
		assert.strictEqual(res.status, 200);
		let room = res.data;

		res = await net.GET('roles', {id: room.id + 1});
		assert.strictEqual(res.status, 404);

		res = await net.GET('roles', {id: room.id});
		assert.strictEqual(res.status, 403);

		res = await net.GET('roles', {id: room.id, ownerKey: room.ownerKey});
		assert.strictEqual(res.status, 200);
		for (let {seat, card} of res.data) {
			assert(roles.indexOf(card.role) >= 0);
		}

		res = await net.DELETE('room', {id: room.id, ownerKey: room.ownerKey});
		assert.strictEqual(res.status, 200);
	},
};