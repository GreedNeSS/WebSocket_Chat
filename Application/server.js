'use strict';

const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const index = fs.readFileSync('./client/index.html', 'utf8');
const client = fs.readFileSync('./client/client.js', 'utf8');

const server = http.createServer((req, res) => {
	res.writeHead(200);
	console.log(req.url);
	if (req.url === '/') {
		res.end(index);
	}
	if (req.url === '/client.js') {
		res.end(client);
	}
});

server.listen(8000, () => {
	console.log('Listen port 8000');
});

const ws = new WebSocket.Server({ server });

ws.on('connection', (connection, req) => {
	const ip = req.socket.remoteAddress;
	console.log(`Connected ${ip}`);
	connection.on('message', message => {
		console.log('Received:', message);
		ws.clients.forEach(client => {
			if (client === connection) return;
			if (client.readyState === WebSocket.OPEN) {
				client.send(message, { binary: false });
			}
		});
	});
	connection.on('close', () => {
		console.log(`Disconnected ${ip}`);
	});
});
