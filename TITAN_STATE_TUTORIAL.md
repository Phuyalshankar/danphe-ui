# 📘 Beginner's Guide: Titan States & Actions

Welcome! This is a simple, easy-to-understand guide for using Titan TCP states and actions in your Dolphin Native app. 

Think of **Actions** as buttons you can click, and **States** as text that updates automatically on your screen.

---

## ⚡ 1. Relay (IoT) Controls
Turn things ON or OFF (like lights, doors, or motors).

### 🛠️ Actions (What you can click)
* `hw:tcp:iot:relay_toggle:1` - Swaps Relay 1 (If it's ON, makes it OFF. If OFF, makes it ON).
* `hw:tcp:iot:relay_on:1` - Forces Relay 1 to turn ON.
* `hw:tcp:iot:relay_off:1` - Forces Relay 1 to turn OFF.

> [!TIP]
> Just change the `1` to `2`, `3`, or `4` to control different relays!

**Example Code:**
```jsx
{/* A button to Toggle Relay 1 */}
<button 
    action="hw:tcp:iot:relay_toggle:1" 
    className="bg-amber-500 text-black p-4 rounded-lg">
    💡 Toggle Light 1
</button>
```

### 👁️ States (What you can see)
* `[stateKey:sys_iot_1]` - Shows `1` if Relay 1 is ON, and `0` if it is OFF.
* `[stateKey:sys_iot_last]` - Shows the last thing that happened (e.g., `Relay 1: relay_on`).

**Example Code:**
```jsx
{/* Shows the current status of Relay 1 */}
<div>
    Status of Light 1 is: <span className="font-bold">[stateKey:sys_iot_1]</span>
</div>
```

---

## 🔌 2. Server Connection
Connect your app to the NVR Backend Server.

### 🛠️ Actions
* `hw:tcp:connect` - Connects to the server using the IP and Port you typed.
* `hw:tcp:disconnect` - Disconnects from the server.

**Example Code:**
```jsx
<button action="hw:tcp:connect" className="bg-green-500 p-2 rounded">
    ⚡ Connect Now
</button>

<button action="hw:tcp:disconnect" className="bg-red-500 p-2 rounded">
    🛑 Disconnect
</button>
```

### 👁️ States
* `[stateKey:sys_tcp_status]` - Shows if you are Connected or Disconnected.
* `[stateKey:tcp_ip]` - Shows the IP address you are connecting to.
* `[stateKey:tcp_port]` - Shows the Port you are connecting to.

**Example Code:**
```jsx
<div>
    Server Status: [stateKey:sys_tcp_status]
</div>
```

---

## 📞 3. Intercom & Calling
Make audio calls over your local network.

### 🛠️ Actions
* `hw:tcp:invite:102` - Call Extension 102.
* `hw:tcp:accept` - Answer an incoming call.
* `hw:tcp:hangup` - Cut or reject a call.

**Example Code:**
```jsx
{/* Call the Reception (Ext 101) */}
<button action="hw:tcp:invite:101" className="bg-blue-500 p-3 rounded">
    📞 Call Reception
</button>

{/* Hang up the phone */}
<button action="hw:tcp:hangup" className="bg-red-500 p-3 rounded">
    📵 Hang Up
</button>
```

### 👁️ States
* `[stateKey:sys_call_status]` - Shows if the phone is `RINGING`, `IN_CALL`, or `IDLE`.

**Example Code:**
```jsx
<div className="text-xl text-yellow-400">
    Phone Status: [stateKey:sys_call_status]
</div>
```

---

## 💬 4. Real-Time Chat
Send text messages instantly.

### 🛠️ Actions
* `hw:tcp:chat:Hello!` - Sends "Hello!" to the target extension.

### 👁️ States
* `[stateKey:sys_chat_msg]` - Shows the newest message you received.

**Example Code:**
```jsx
<div className="bg-slate-800 p-4 rounded-lg">
    📬 New Message: [stateKey:sys_chat_msg]
</div>
```

---

## 🧭 5. Screen Navigation
Move between different pages in your app.

### 🛠️ Actions
* `app.navigate:TcpCamera` - Jumps to the `TcpCamera` screen.
* `app.navigate:Home` - Goes back to the `Home` screen.

**Example Code:**
```jsx
<button action="app.navigate:TcpCamera" className="bg-purple-500 p-3 rounded text-white">
    ➡️ Go to Camera Page
</button>
```
