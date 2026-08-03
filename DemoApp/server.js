'use strict';
const fs = require('fs');
const path = require('path');

// Simulated Dolphin Realtime Core (inspired by dolphin-server-modules)
const Realtime = {
    broadcast: (dolphin, topic, payload) => {
        dolphin.broadcastAction('REALTIME_MSG', { topic, payload, ts: Date.now() });
    }
};

module.exports = (dolphin) => {
    dolphin.on('deviceAction', async ({ id, action, value }) => {
        console.log(`  💬 Chat Action: [${id}] ${action}`);

        if (action === 'chat:send') {
            const msgText = value;
            console.log(`  📩 New Message from ${id}: ${msgText}`);

            // Simulate server-side processing and broadcasting
            // In a real app with dolphin-server-modules, we would use RealtimeCore.publish()
            
            setTimeout(() => {
                const botResponses = [
                    "हजुर, मैले बुझें। 🐬",
                    "Dolphin Native एकदमै छिटो छ, हैन त? 🚀",
                    "तपाइँको सन्देश 'Realtime Core' मार्फत आयो।",
                    "के म तपाइँलाई अरु केहि मद्दत गर्न सक्छु?",
                    "WhatsApp जस्तै अनुभव भइरहेको छ? 😊"
                ];
                const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
                
                dolphin.sendAction(id, 'CHAT_RECEIVE', {
                    sender: 'Dolphin AI',
                    text: randomResponse,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isMe: false
                });
            }, 800);
        }

        if (action === 'FETCH_PRODUCTS') {
            // ... (existing FETCH_PRODUCTS logic)
            const res = await fetch('https://fakestoreapi.com/products?limit=5');
            const products = await res.json();
            const dataPath = path.join(__dirname, 'data.json');
            fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
        }
    });
};
