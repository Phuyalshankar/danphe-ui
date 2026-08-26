/**
 * test.js
 * Unit test for Dynamic UI Copier Plugin
 */

const { DynamicUICopierPlugin, TitanBinaryEncoder } = require('./index');

console.log('🧪 Testing Dynamic UI Copier Plugin...');

try {
    const plugin = new DynamicUICopierPlugin();
    console.log('✅ Plugin initialized successfully.');

    const mockNodes = [
        {
            opcode: 0x11,
            typeName: 'Card',
            bounds: { x: 0, y: 0, width: 300, height: 200 },
            padding: { top: 16, right: 16, bottom: 16, left: 16 },
            styles: { backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1, fontSize: 14 },
            content: '',
            placeholder: ''
        },
        {
            opcode: 0x18,
            typeName: 'TextField',
            bounds: { x: 16, y: 16, width: 268, height: 48 },
            padding: { top: 8, right: 8, bottom: 8, left: 8 },
            styles: { backgroundColor: '#f9f9f9', borderRadius: 4, borderWidth: 1, fontSize: 14 },
            content: '',
            placeholder: 'Email Address',
            inputType: 'email'
        },
        {
            opcode: 0x10,
            typeName: 'Button',
            bounds: { x: 16, y: 80, width: 268, height: 44 },
            padding: { top: 12, right: 12, bottom: 12, left: 12 },
            styles: { backgroundColor: '#1976d2', borderRadius: 4, borderWidth: 0, fontSize: 14 },
            content: 'Submit Form',
            placeholder: ''
        }
    ];

    const encoder = new TitanBinaryEncoder();
    const result = encoder.encode(mockNodes);

    console.log(`✅ Encoded ${result.nodeCount} nodes into ${result.binaryBuffer.length} bytes of Titan Binary.`);
    console.log(`✅ String Pool generated (${result.stringPool.length} entries):`, result.stringPool);

    if (result.binaryBuffer.length === 48 && result.nodeCount === 3) {
        console.log('🎉 ALL PLUGIN TESTS PASSED CLEANLY!');
    } else {
        console.error('❌ Test failed: Buffer size or node count mismatch.');
    }
} catch (error) {
    console.error('❌ Plugin Test Error:', error);
}
