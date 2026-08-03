/**
 * 🐬 Professional Dial Pad Component
 * iOS/Android style dialer with animations and haptics
 */

const { Column, Row, Button, Text, GridView } = require('dolphin-native');

const DialPadPro = () => {
    const keys = [
        { num: '1', letters: '', icon: null },
        { num: '2', letters: 'ABC', icon: null },
        { num: '3', letters: 'DEF', icon: null },
        { num: '4', letters: 'GHI', icon: null },
        { num: '5', letters: 'JKL', icon: null },
        { num: '6', letters: 'MNO', icon: null },
        { num: '7', letters: 'PQRS', icon: null },
        { num: '8', letters: 'TUV', icon: null },
        { num: '9', letters: 'WXYZ', icon: null },
        { num: '*', letters: '', icon: null },
        { num: '0', letters: '+', icon: null },
        { num: '#', letters: '', icon: null }
    ];

    return (
        <Column className="flex-1 bg-white">
            {/* Header */}
            <Row className="p-4 justify-between items-center">
                <Text className="text-xl text-bold">Keypad</Text>
                <Button action="nav:Contacts" className="p-2">
                    <Text className="text-blue-500">Contacts</Text>
                </Button>
            </Row>
            
            {/* Phone Number Display */}
            <Column className="p-6 items-center">
                <Text 
                    stateKey="phoneNumber" 
                    className="text-5xl text-center text-bold"
                    style={{ 
                        letterSpacing: 3,
                        minHeight: 60
                    }}>
                </Text>
                
                {/* Country/Carrier */}
                <Text className="text-sm text-gray-400 mt-2">
                    Mobile
                </Text>
            </Column>
            
            {/* Spacer */}
            <Column className="flex-1" />
            
            {/* Dial Pad */}
            <Column className="p-6">
                <GridView className="grid-cols-3 gap-6">
                    {keys.map((key, index) => (
                        <Button
                            key={index}
                            action={`dial:${key.num}`}
                            className="h-20 circle bg-gray-100"
                            animation="scale">
                            <Column className="items-center">
                                <Text className="text-4xl text-bold mb-1">
                                    {key.num}
                                </Text>
                                {key.letters && (
                                    <Text className="text-xs text-gray-500">
                                        {key.letters}
                                    </Text>
                                )}
                            </Column>
                        </Button>
                    ))}
                </GridView>
            </Column>
            
            {/* Bottom Actions */}
            <Row className="p-6 justify-center items-center gap-12">
                {/* Video Call */}
                <Button 
                    action="videoCall"
                    className="w-14 h-14 circle bg-gray-100 flex-center">
                    <Text className="text-2xl">📹</Text>
                </Button>
                
                {/* Call Button - Main Action */}
                <Button
                    action="makeCall"
                    className="w-20 h-20 circle bg-green-500 flex-center shadow-xl"
                    animation="pulse">
                    <Text className="text-4xl">📞</Text>
                </Button>
                
                {/* Backspace */}
                <Button
                    action="phoneNumber:backspace"
                    className="w-14 h-14 circle bg-gray-100 flex-center">
                    <Text className="text-2xl">⌫</Text>
                </Button>
            </Row>
        </Column>
    );
};

module.exports = { DialPadPro };

