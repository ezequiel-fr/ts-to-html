import colors from 'colors';

function startServer() {
    console.log(colors.reset("Hello World!"));

    // const serverProcess = spawn('node', ["server.js"], {
    //     stdio: 'pipe',
    //     shell: true,
    // });

    // serverProcess.stderr.pipe(process.stderr);
    // serverProcess.stdin.pipe(process.stdin);
    // serverProcess.stdout.pipe(process.stdout);

    // serverProcess.on('close', code => code !== null && process.exit(code));
}

startServer();
