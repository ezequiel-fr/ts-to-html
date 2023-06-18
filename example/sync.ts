// WebSocket connection
if ("WebSocket" in window) {
    const protocol = window.location.protocol === "http:" ? "ws://" : "wss://";
    const address = protocol + window.location.host;

    function connectWebSocket() {
        const socket = new WebSocket(address);

        socket.addEventListener("message", message => { try {
            const content = JSON.parse(message.data) as { type: string; data: any };

            switch (content.type) {
                // Reload page when server restart
                case 'reload':
                    const update = sessionStorage.getItem('hot-update');
                    sessionStorage.setItem('hot-update', "0");
                    if (update !== "0") window.location.reload();
                    break;

                default: return;
            }
        } catch (error) { console.error(error); }});

        socket.addEventListener("error", e => console.error("error", e));
        socket.addEventListener('close', () => {
            sessionStorage.setItem('hot-update', "1");
            console.error(new Error("Error trying access : " + address));
            setTimeout(connectWebSocket, 2e3);
            setInterval(connectWebSocket, 10e3);
        });
    }

    connectWebSocket();
} else alert("You should upgrade your browser.");
