#!/usr/bin/env node
'use strict';

/**
 * 🧪 Test: Lambda onClick Function Support
 * 
 * Tests:
 * 1. Button with lambda onClick={() => ...}
 * 2. Container with lambda onClick
 * 3. Multiple lambda functions on same screen
 */

const { createApp } = require('./src/index.js');

const app = createApp({
    name: 'LambdaOnClickTest',
    port: 7799,
    httpPort: 7798
});

// Initialize state
app.state('clickCount', 0);
app.state('lastClicked', 'None');
app.state('message', 'Click any button below');

// Define screen with lambda onClick handlers
app.screen('Home', () => {
    return (
        <screen className="flex-col items-center justify-center p-6 bg-slate-900">
            <text className="text-3xl font-bold text-white mb-4">
                Lambda onClick Test
            </text>
            
            <text className="text-xl text-blue-400 mb-2">
                Clicks: [stateKey:clickCount]
            </text>
            
            <text className="text-lg text-green-400 mb-6">
                Last: [stateKey:lastClicked]
            </text>
            
            <text className="text-md text-yellow-300 mb-8">
                [stateKey:message]
            </text>
            
            {/* Test 1: Button with simple lambda */}
            <button 
                onClick={() => {
                    const count = parseInt(app.getState('clickCount') || 0);
                    app.state('clickCount', count + 1);
                    app.state('lastClicked', 'Simple Lambda Button');
                    app.state('message', 'Simple lambda worked! ✅');
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg mb-4 w-80">
                Test 1: Simple Lambda
            </button>
            
            {/* Test 2: Button with complex lambda */}
            <button 
                onClick={() => {
                    const count = parseInt(app.getState('clickCount') || 0);
                    const newCount = count + 5;
                    app.state('clickCount', newCount);
                    app.state('lastClicked', 'Complex Lambda (+5)');
                    app.state('message', `Complex lambda: Added 5! Total: ${newCount} ✅`);
                }}
                className="bg-green-600 text-white px-6 py-3 rounded-lg mb-4 w-80">
                Test 2: Lambda +5
            </button>
            
            {/* Test 3: Container with lambda */}
            <div 
                onClick={() => {
                    app.state('lastClicked', 'Clickable Container');
                    app.state('message', 'Container onClick lambda works! ✅');
                }}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg mb-4 w-80 cursor-pointer text-center">
                Test 3: Container Lambda
            </div>
            
            {/* Test 4: Card with lambda */}
            <div 
                type="Card"
                onClick={() => {
                    const count = parseInt(app.getState('clickCount') || 0);
                    app.state('clickCount', count + 10);
                    app.state('lastClicked', 'Card Lambda (+10)');
                    app.state('message', 'Card lambda worked! Added 10! ✅');
                }}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg mb-4 w-80 text-center">
                Test 4: Card Lambda +10
            </div>
            
            {/* Test 5: Reset button with traditional action */}
            <button 
                action="reset"
                className="bg-red-600 text-white px-6 py-3 rounded-lg w-80">
                Reset (Traditional Action)
            </button>
        </screen>
    );
});

// Traditional action for comparison
app.action('reset', () => {
    app.state('clickCount', 0);
    app.state('lastClicked', 'Reset Button');
    app.state('message', 'Counter reset! Traditional action works ✅');
});

// Start app
app.start();

console.log('');
console.log('🧪 Lambda onClick Test App Started');
console.log('📱 Connect Android device to: localhost:7799');
console.log('🌐 Web Dashboard: http://localhost:7798');
console.log('');
console.log('✅ Testing:');
console.log('  1. Button with simple lambda');
console.log('  2. Button with complex lambda (+5)');
console.log('  3. Container/div with lambda');
console.log('  4. Card with lambda (+10)');
console.log('  5. Traditional action for comparison');
console.log('');
