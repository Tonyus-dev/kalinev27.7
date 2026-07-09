const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

module.exports = function handleChama(req, res, dirs) {
  const { SNAPSHOTS_DIR, EVENTS_DIR } = dirs;

  if (req.url === '/api/presence/manifest') {
    res.writeHead(200);
    return res.end(JSON.stringify({ name: 'Héstia Station', version: '1.0.0', type: 'chama_local' }));
  }
  
  if (req.url === '/api/presence/summary') {
    res.writeHead(200);
    return res.end(JSON.stringify({ summary: 'Presence (Chama) pode consultar resumos locais da Héstia.' }));
  }

  if (req.url === '/api/presence/health') {
    res.writeHead(200);
    return res.end(JSON.stringify({ healthy: true, status: 'chama_active' }));
  }

  if (req.url === '/api/presence/snapshots/latest') {
    const snapFile = path.join(SNAPSHOTS_DIR, 'latest.json');
    if (fs.existsSync(snapFile)) {
      res.writeHead(200);
      return res.end(fs.readFileSync(snapFile, 'utf8'));
    }
    res.writeHead(404);
    return res.end(JSON.stringify({ error: 'Not found' }));
  }

  if (req.url === '/api/presence/backups') {
    res.writeHead(200);
    return res.end(JSON.stringify({ status: 'Backup real ainda não configurado.' }));
  }

  if (req.url === '/api/presence/capabilities') {
    res.writeHead(200);
    return res.end(JSON.stringify({
      read: true,
      write: false,
      upload: false,
      delete: false,
      shell: false,
      restart_services: false,
      manage_storage: false,
      chama_local: true
    }));
  }

  if (req.url === '/api/presence/storage') {
    try {
      const dfOut = execSync('df -kP').toString();
      const lines = dfOut.split('\n');
      let kaline = null;
      for (const line of lines) {
        if (line.includes('/KALINE')) {
          const parts = line.split(/\s+/);
          kaline = {
            size: Math.round(parseInt(parts[1]) / 1024) + 'MB',
            used: Math.round(parseInt(parts[2]) / 1024) + 'MB',
            free: Math.round(parseInt(parts[3]) / 1024) + 'MB',
            mount: parts[5]
          };
          break;
        }
      }
      res.writeHead(200);
      return res.end(JSON.stringify({ kaline }));
    } catch (e) {
      res.writeHead(500);
      return res.end(JSON.stringify({ error: 'Failed to read storage via Chama' }));
    }
  }

  if (req.url === '/api/presence/services') {
    res.writeHead(200);
    return res.end(JSON.stringify([
      { name: 'Tailscale', active: false },
      { name: 'Jellyfin', active: false },
      { name: 'Samba', active: false }
    ]));
  }

  if (req.url === '/api/presence/events/recent') {
    const dateStr = new Date().toISOString().split('T')[0];
    const logFile = path.join(EVENTS_DIR, `${dateStr}.jsonl`);
    if (fs.existsSync(logFile)) {
      const lines = fs.readFileSync(logFile, 'utf8').trim().split('\n');
      const logs = lines.map(l => JSON.parse(l)).reverse().slice(0, 50);
      res.writeHead(200);
      return res.end(JSON.stringify(logs));
    }
    res.writeHead(200);
    return res.end(JSON.stringify([]));
  }

  return false; // not handled by Chama
}
