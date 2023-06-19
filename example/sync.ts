// WebSocket connection
if ("WebSocket" in window) {
    const protocol = window.location.protocol === "http:" ? "ws://" : "wss://";
    const address = protocol + window.location.host;

    const connectWebSocket = () => {
        const socket = new WebSocket(address);

        socket.addEventListener("message", message => { try {
            const content = JSON.parse(message.data) as { type: string; data: any };

            switch (content.type) {
                case 'reload': // Reload server
                    return window.location.reload();

                default: return;
            }
        } catch (error) { console.error(error); }});

        socket.addEventListener('close', () => {
            console.error(new Error("Error trying access : " + address));
            socket.close();

            interval = setInterval(connectWebSocket, 1e4);
        });

        socket.addEventListener('open', () => clearInterval(interval));
        socket.addEventListener('error', e => console.error("error", e));
    }

    let interval = setInterval(connectWebSocket);
} else alert("You should upgrade your browser.");
