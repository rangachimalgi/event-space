import https from 'https';

function pingServer() {
  https.get('https://event-space.onrender.com', (res) => {
    console.log('Server pinged with response status code:', res.statusCode);
  }).on('error', (e) => {
    console.error('Error pinging server:', e.message);
  });
}

setInterval(pingServer, 900000);
