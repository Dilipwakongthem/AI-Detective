const localtunnel = require('localtunnel');
const fs = require('fs');

(async () => {
  const tunnel = await localtunnel({ port: 1234 });

  const message = `\n=================================\n🎮 GAME IS NOW PUBLICLY ACCESSIBLE!\n=================================\n\n🌐 Public URL: ${tunnel.url}\n\nThe game is running and accessible at the URL above!\nKeep this process running to maintain the tunnel.\n`;

  process.stdout.write(message);
  fs.writeFileSync('/home/user/Crime-Scene/tunnel-url.txt', tunnel.url);

  tunnel.on('close', () => {
    process.stdout.write('Tunnel closed\n');
  });
})();
