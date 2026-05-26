const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, 'Map', 'uploads_files_5432246_Fps+Map+1.glb'));
});

app.get('/weapons', (req, res) => {
  res.sendFile(path.join(__dirname, 'uploads_files_2553000_LOW_POLY_WEAPONS_PACK_COMPLETE.dae'));
});

app.get('/soldier', (req, res) => {
  res.sendFile(path.join(__dirname, 'Soldier.fbx'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`FPS Game running at http://0.0.0.0:${PORT} (port ${PORT})`);
});
