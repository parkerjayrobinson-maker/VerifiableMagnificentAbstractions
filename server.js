const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, 'Map', 'uploads_files_5432246_Fps+Map+1.glb'));
});

app.get('/soldier', (req, res) => {
  res.sendFile(path.join(__dirname, 'Soldier.fbx'));
});

app.get('/gun/ar1', (req, res) => {
  res.sendFile(path.join(__dirname, 'Fps guns', 'Assault Rifle (1)', 'AssaultRifle_01.obj'));
});
app.get('/gun/ar1.mtl', (req, res) => {
  res.sendFile(path.join(__dirname, 'Fps guns', 'Assault Rifle (1)', 'AssaultRifle_01.mtl'));
});

app.get('/gun/ar2', (req, res) => {
  res.sendFile(path.join(__dirname, 'Fps guns', 'AssaultRifle2_1.fbx'));
});

app.get('/gun/smg', (req, res) => {
  res.sendFile(path.join(__dirname, 'Fps guns', 'SubmachineGun_2.fbx'));
});

app.get('/gun/shotgun', (req, res) => {
  res.sendFile(path.join(__dirname, 'Fps guns', 'Shotgun_3.fbx'));
});

app.get('/gun/sniper', (req, res) => {
  res.sendFile(path.join(__dirname, 'Fps guns', 'SniperRifle_1.fbx'));
});

app.get('/gun/pistol', (req, res) => {
  res.sendFile(path.join(__dirname, 'Fps guns', 'Pistol', 'Pistol_02.obj'));
});
app.get('/gun/pistol.mtl', (req, res) => {
  res.sendFile(path.join(__dirname, 'Fps guns', 'Pistol', 'Pistol_02.mtl'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`FPS Game running at http://0.0.0.0:${PORT}`);
});
