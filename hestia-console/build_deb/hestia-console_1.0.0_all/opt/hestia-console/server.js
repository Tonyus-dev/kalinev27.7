const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process'); // used only for df

const HOST = '127.0.0.1';
const PORT = 4517;

const DATA_DIR = path.join(os.homedir(), '.local/share/hestia-console');
const EVENTS_DIR = path.join(DATA_DIR, 'events');
const SNAPSHOTS_DIR = path.join(DATA_DIR, 'snapshots');
const CONFIG_DIR = path.join(os.homedir(), '.config/hestia-console');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// Ensure directories exist
[EVENTS_DIR, SNAPSHOTS_DIR, CONFIG_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper to log events
function logEvent(level, message) {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const event = { timestamp: now.toISOString(), level, message };
  const logFile = path.join(EVENTS_DIR, `${dateStr}.jsonl`);
  fs.appendFileSync(logFile, JSON.stringify(event) + '\n');
}

// Generate latest.json snapshot periodically
setInterval(() => {
  const snapshot = {
    timestamp: new Date().toISOString(),
    status: 'active'
  };
  fs.writeFileSync(path.join(SNAPSHOTS_DIR, 'latest.json'), JSON.stringify(snapshot, null, 2));
}, 60000);

// Initial event
logEvent('INFO', 'Héstia Station started');

const server = http.createServer((req, res) => {
  // Security: only allow 127.0.0.1 and localhost
  const host = req.headers.host || '';
  if (!host.startsWith('127.0.0.1') && !host.startsWith('localhost')) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  // Basic CORS headers for local UI
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Only GET allowed
  if (req.method !== 'GET') {
    res.writeHead(405);
    return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }

  try {
    if (req.url === '/api/health') {
      res.writeHead(200);
      return res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    }

    if (req.url === '/api/server/status') {
      const status = {
        os: `${os.type()} ${os.release()}`,
        uptime: os.uptime(),
        memory: `${Math.round(os.freemem() / 1024 / 1024)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB`,
        cpuLoad: os.loadavg()[0].toFixed(2)
      };
      res.writeHead(200);
      return res.end(JSON.stringify(status));
    }

    if (req.url === '/api/storage/status' || req.url === '/api/storage/discover' || req.url === '/api/presence/storage') {
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
        return res.end(JSON.stringify({ error: 'Failed to read storage' }));
      }
    }

    if (req.url === '/api/services/status' || req.url === '/api/presence/services') {
      // Mock services for MVP since we don't execute raw system commands from client
      res.writeHead(200);
      return res.end(JSON.stringify([
        { name: 'Tailscale', active: false },
        { name: 'Jellyfin', active: false },
        { name: 'Samba', active: false }
      ]));
    }

    if (req.url === '/api/logs' || req.url === '/api/presence/events/recent') {
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

    if (req.url === '/api/config') {
      res.writeHead(200);
      return res.end(JSON.stringify({ configured: fs.existsSync(CONFIG_FILE) }));
    }

    // Presence specific
    if (req.url === '/api/presence/manifest') {
      res.writeHead(200);
      return res.end(JSON.stringify({ name: 'Héstia Station', version: '1.0.0' }));
    }
    
    if (req.url === '/api/presence/summary') {
      res.writeHead(200);
      return res.end(JSON.stringify({ summary: 'Presence pode consultar resumos locais.' }));
    }

    if (req.url === '/api/presence/health') {
      res.writeHead(200);
      return res.end(JSON.stringify({ healthy: true }));
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

    if (req.url === '/api/presence/capabilities' || req.url === '/api/capabilities') {
      res.writeHead(200);
      return res.end(JSON.stringify({
        read: true,
        write: false,
        upload: false,
        delete: false,
        shell: false,
        restart_services: false,
        manage_storage: false
      }));
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  } catch (err) {
    // No stack traces to UI
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Héstia Station running at http://${HOST}:${PORT}`);
});
