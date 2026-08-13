# 📘 The Complete Beginner's Guide: All 42 Dolphin Native Actions

Welcome! This is your ultimate dictionary for every single Action and State you can use in Dolphin Native. 

**Quick Rule:**
* Put `action="..."` inside `<button>` to trigger an event.
* Put `[stateKey:...]` inside any Text or `<span>` to show live data.

---

## 🌐 1. TCP & Titan Network (11 Actions)
Connect to servers, manage streams, and send custom data.

### 🛠️ Actions
* `hw:tcp:connect` - Connect to the TCP server (using `tcp_ip` and `tcp_port` states).
* `hw:tcp:disconnect` - Disconnect from the server.
* `hw:tcp:ping` - Send a ping to check server health.
* `hw:tcp:custom:101` - Send a custom JSON payload to extension 101.
* `hw:tcp:invite:101` - Call Extension 101 (Intercom).
* `hw:tcp:accept` - Answer an incoming call.
* `hw:tcp:hangup` - End or reject a call.
* `hw:tcp:chat:Hello!` - Send a chat message.
* `hw:tcp:iot:relay_toggle:1` - Toggles Relay #1 ON or OFF.
* `hw:tcp:iot:relay_on:1` - Turns Relay #1 ON.
* `hw:tcp:iot:relay_off:1` - Turns Relay #1 OFF.

**Example Code:**
```jsx
<button action="hw:tcp:connect">Connect to Server</button>
<button action="hw:tcp:iot:relay_toggle:1">💡 Toggle Light</button>
<button action="hw:tcp:invite:102">📞 Call Ext 102</button>
```

---

## 🎨 2. UI & Navigation (5 Actions)
Control what happens on the screen.

### 🛠️ Actions
* `nav:HomePage` - Jump to the "HomePage" screen.
* `app.navigate:HomePage` - Same as above, jumps to a screen.
* `anim:bounce` - Play a UI animation (e.g., `bounce`, `fade_in`).
* `alert:Hello World!` - Show a pop-up alert dialog on the screen.
* `state:counter` - Add +1 to a state variable (e.g., to make a click counter).

**Example Code:**
```jsx
<button action="nav:SettingsPage">⚙️ Go to Settings</button>
<button action="alert:Saved Successfully!">💾 Save</button>
```

---

## 🎛️ 3. Hardware Sensors & Basics (10 Actions)
Control the physical hardware of the phone.

### 🛠️ Actions
* `hw:flashlight:on` - Turn the camera flashlight ON.
* `hw:flashlight:off` - Turn the flashlight OFF.
* `hw:haptics:vibrate` - Make the phone vibrate gently.
* `hw:haptics:heavy` - Make the phone vibrate strongly.
* `hw:camera:capture` - Take a photo.
* `hw:camera:switch` - Switch between Front and Back camera.
* `hw:mic:start` - Start recording audio from the microphone.
* `hw:mic:stop` - Stop recording audio.
* `hw:sensor:accel` - Read the Accelerometer (movement) sensor data.
* `hw:battery` - Read the battery percentage and charging status.

**Example Code:**
```jsx
<button action="hw:flashlight:on">🔦 Torch ON</button>
<button action="hw:haptics:heavy">📳 Heavy Vibrate</button>
<button action="hw:battery">🔋 Check Battery</button>
<div>Battery is: [stateKey:battery_text]</div>
```

---

## 📱 4. Phone & Communications (8 Actions)
Interact with the phone's communication features.

### 🛠️ Actions
* `hw:phone:call:9800000000` - Open the dialer to call a real phone number.
* `hw:phone:carrier` - Get the mobile network name (e.g., Ncell, NTC).
* `hw:phone:simState` - Check if the SIM card is ready.
* `hw:phone:number` - Get the device's phone number.
* `hw:sms:send:9800000000:Hello` - Send an SMS message.
* `hw:contacts:get` - Fetch the phone's contact list.
* `hw:contacts:list` - Show the contact list.
* `hw:clipboard:copy:MyText` - Copy text to the phone's clipboard.

**Example Code:**
```jsx
<button action="hw:phone:call:9841234567">📱 Call Manager</button>
<button action="hw:clipboard:copy:Dolphin Is Awesome">📋 Copy Text</button>
```

---

## 🌍 5. GPS, Storage & Connectivity (8 Actions)
Access location, files, and other networks.

### 🛠️ Actions
* `hw:gps:get` - Fetch the current GPS location once.
* `hw:gps:watch` - Continuously track the live GPS location.
* `hw:gps:stop` - Stop tracking GPS.
* `hw:storage:save:myFile.txt` - Save data to a local file.
* `hw:network:status` - Check if connected to WiFi or Mobile Data.
* `hw:bluetooth:scan` - Scan for nearby Bluetooth devices.
* `hw:bluetooth:connect:MAC_ADDRESS` - Connect to a specific Bluetooth device.
* `hw:nfc:read` - Read data from an NFC tag.

**Example Code:**
```jsx
<button action="hw:gps:get">📍 Get My Location</button>
<div>Lat: [stateKey:gps_lat], Lng: [stateKey:gps_lng]</div>
```

---
*Total Actions: 42. Welcome to the power of Dolphin Native!*
