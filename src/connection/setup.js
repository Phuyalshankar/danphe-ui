// setup.js मा compileNativeComponents() function को सुधारिएको संस्करण
function compileNativeComponents() {
    const platform = os.platform();
    console.log(`\n🔧 Detected platform: ${platform}`);
    
    // एन्ड्रोइडलाई अलग चिन्ने विधि
    const isAndroid = () => {
        // विधि १: process.env बाट
        if (process.platform === 'android') return true;
        
        // विधि २: Termux environment check
        if (process.env.TERMUX_VERSION) return true;
        
        // विधि ३: Android-specific files check
        try {
            const fs = require('fs');
            if (fs.existsSync('/system/build.prop')) return true;
            if (fs.existsSync('/android')) return true;
        } catch (e) {}
        
        return false;
    };
    
    // Native compilation commands
    const compileCommands = {
        'linux': 'g++ -std=c++11 -o hardware_bridge hardware_bridge.cpp -lpthread -O2',
        'android': 'echo "Android detected: native compilation via NDK required"',
        'win32': 'cl /EHsc hardware_bridge.cpp'
    };
    
    // Actual platform निर्धारण
    let actualPlatform = platform;
    if (platform === 'linux' && isAndroid()) {
        actualPlatform = 'android';
        console.log('📱 Android environment detected (Termux/Android)');
    }
    
    if (compileCommands[actualPlatform]) {
        console.log(`⚙️  Compiling for ${actualPlatform}...`);
        
        // Android को लागि विशेष निर्देशन
        if (actualPlatform === 'android') {
            console.log('\n📋 Android NDK Setup Required:');
            console.log('1. Install NDK in Termux:');
            console.log('   pkg install clang cmake make');
            console.log('2. Compile manually:');
            console.log('   clang++ -std=c++11 -llog -landroid -o hardware_bridge hardware_bridge.cpp');
            console.log('3. OR use precompiled binary from releases');
            
            // एन्ड्रोइडको लागि छोटो C++ test compile
            try {
                const testCode = '#include <iostream>\nint main() { std::cout << "Android_OK"; return 0; }';
                require('fs').writeFileSync('test_android.cpp', testCode);
                execSync('clang++ test_android.cpp -o test_android 2>/dev/null', { stdio: 'pipe' });
                console.log('✅ Android compiler is working');
                require('fs').unlinkSync('test_android.cpp');
            } catch (e) {
                console.log('⚠️  Android compiler may not be available');
            }
            return;
        }
        
        // Linux/Windows को लागि regular compilation
        try {
            execSync(compileCommands[actualPlatform], { stdio: 'inherit' });
            console.log('✅ Native bridge compiled successfully');
        } catch (error) {
            console.warn('⚠️  Native compilation failed. Some hardware features may be limited.');
            console.log('   Error details:', error.message);
        }
    } else {
        console.log(`ℹ️  Platform ${actualPlatform} not configured for native compilation`);
    }
}