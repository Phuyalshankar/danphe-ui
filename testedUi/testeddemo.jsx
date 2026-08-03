'use strict';

const { DolphinFramework } = require('../src/framework/DolphinFramework');

const app = DolphinFramework.createApp({
    name: 'Dolphin Form Lab',
    platform: 'HTML',
    debug: true,
});

// स्क्रिनहरू यहाँ इम्पोर्ट (Import) गर्नुहोस्
const { HomeScreen } = require('./pages');

// स्क्रिन रजिस्टर गर्नुहोस्
app.screen('Home', HomeScreen());
app.entry('Home');

module.exports = app;
