const net = require('net');

const targets = [
    { host: 'aws-1-eu-west-1.pooler.supabase.com', port: 5432 },
    { host: 'aws-1-eu-west-1.pooler.supabase.com', port: 6543 },
];

targets.forEach(target => {
    const socket = new net.Socket();
    socket.setTimeout(5000);

    socket.on('connect', () => {
        console.log(`Port ${target.port} on ${target.host} is OPEN`);
        socket.destroy();
    });

    socket.on('timeout', () => {
        console.log(`Port ${target.port} on ${target.host} TIMED OUT`);
        socket.destroy();
    });

    socket.on('error', (err) => {
        console.log(`Port ${target.port} on ${target.host} ERROR: ${err.message}`);
    });

    socket.connect(target.port, target.host);
});
