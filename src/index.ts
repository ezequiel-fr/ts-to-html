import { spawn } from 'child_process';

function startServer() {
    const serverProcess = spawn('node', ["server.js"], {
        stdio: 'pipe',
        shell: true,
    });

    serverProcess.stderr.pipe(process.stderr);
    serverProcess.stdin.pipe(process.stdin);
    serverProcess.stdout.pipe(process.stdout);

    serverProcess.on('close', code => code !== null && process.exit(code));
}

startServer();
