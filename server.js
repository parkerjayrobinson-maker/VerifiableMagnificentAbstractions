const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' }, transports: ['websocket', 'polling'] });
const PORT = 5000;

// rooms: Map<code, Map<socketId, playerState>>
const rooms = new Map();

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

io.on('connection', socket => {
  let roomCode = null;

  socket.on('create-room', cb => {
    let code;
    do { code = generateCode(); } while (rooms.has(code));
    rooms.set(code, new Map([[socket.id, { id: socket.id, pos: {x:0,y:1.7,z:0}, rot: 0, health: 100 }]]));
    roomCode = code;
    socket.join(code);
    cb({ ok: true, code, id: socket.id });
  });

  socket.on('join-room', ({ code }, cb) => {
    const rc = code.toUpperCase().trim();
    const room = rooms.get(rc);
    if (!room) return cb({ ok: false, error: 'Room not found. Check the code.' });
    roomCode = rc;
    socket.join(rc);
    const spawn = { x: (Math.random()-0.5)*6, y: 1.7, z: (Math.random()-0.5)*6 };
    room.set(socket.id, { id: socket.id, pos: spawn, rot: 0, health: 100 });
    const others = [...room.values()].filter(p => p.id !== socket.id);
    cb({ ok: true, id: socket.id, players: others, spawn });
    socket.to(rc).emit('player-joined', { id: socket.id, pos: spawn, rot: 0, health: 100 });
  });

  socket.on('player-update', data => {
    if (!roomCode) return;
    const room = rooms.get(roomCode);
    if (!room) return;
    const p = room.get(socket.id);
    if (p) Object.assign(p, { pos: data.pos, rot: data.rot, health: data.health });
    socket.to(roomCode).emit('player-update', { id: socket.id, ...data });
  });

  socket.on('disconnect', () => {
    if (!roomCode) return;
    const room = rooms.get(roomCode);
    if (!room) return;
    room.delete(socket.id);
    io.to(roomCode).emit('player-left', { id: socket.id });
    if (room.size === 0) rooms.delete(roomCode);
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/map',            (_, res) => res.sendFile(path.join(__dirname, 'Map', 'uploads_files_5432246_Fps+Map+1.glb')));
app.get('/soldier',        (_, res) => res.sendFile(path.join(__dirname, 'Soldier.fbx')));
app.get('/gun/ar1',        (_, res) => res.sendFile(path.join(__dirname, 'Fps guns', 'Assault Rifle (1)', 'AssaultRifle_01.obj')));
app.get('/gun/ar1.mtl',    (_, res) => res.sendFile(path.join(__dirname, 'Fps guns', 'Assault Rifle (1)', 'AssaultRifle_01.mtl')));
app.get('/gun/ar2',        (_, res) => res.sendFile(path.join(__dirname, 'Fps guns', 'AssaultRifle2_1.fbx')));
app.get('/gun/smg',        (_, res) => res.sendFile(path.join(__dirname, 'Fps guns', 'SubmachineGun_2.fbx')));
app.get('/gun/shotgun',    (_, res) => res.sendFile(path.join(__dirname, 'Fps guns', 'Shotgun_3.fbx')));
app.get('/gun/sniper',     (_, res) => res.sendFile(path.join(__dirname, 'Fps guns', 'SniperRifle_1.fbx')));
app.get('/gun/pistol',     (_, res) => res.sendFile(path.join(__dirname, 'Fps guns', 'Pistol', 'Pistol_02.obj')));
app.get('/gun/pistol.mtl', (_, res) => res.sendFile(path.join(__dirname, 'Fps guns', 'Pistol', 'Pistol_02.mtl')));

server.listen(PORT, '0.0.0.0', () => console.log(`FPS Game running at http://0.0.0.0:${PORT}`));
