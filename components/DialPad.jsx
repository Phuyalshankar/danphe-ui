/**
 * 🐬 World-Class Telephone Dial Keypad Component
 * Professional dialer with animations, haptics, and call functionality
 */

const DialPad = ({ stateKey = 'phoneNumber', onCall, showDelete = true }) => {
    // Keypad layout with sub-letters
    const keys = [
        { num: '1', letters: '' },
        { num: '2', letters: 'ABC' },
        { num: '3', letters: 'DEF' },
        { num: '4', letters: 'GHI' },
        { num: '5', letters: 'JKL' },
        { num: '6', letters: 'MNO' },
        { num: '7', letters: 'PQRS' },
        { num: '8', letters: 'TUV' },
        { num: '9', letters: 'WXYZ' },
        { num: '*', letters: '' },
        { num: '0', letters: '+' },
        { num: '#', letters: '' }
    ];

    return (
        <Column className="flex-1 p-4">
            {/* Display Area */}
            <Column className="flex-1 flex-center mb-6">
                {/* Phone Number Display */}
                <TextField
                    type="tel"
                    stateKey={stateKey}
                    variant="standard"
                    className="text-4xl text-center text-bold w-full"
                    placeholder="Enter number"
                />
                
                {/* Carrier Info */}
                <Text className="text-sm text-gray-400 mt-2">
                    Mobile • Dolphin Telecom
                </Text>
            </Column>
            
            {/* Dial Pad Grid - 3 columns */}
            <GridView className="grid-cols-3 gap-4 mb-6" columns={3}>
                {keys.map((key, index) => (
                    <Button
                        key={index}
                        action={`${stateKey}:append:${key.num}`}
                        className="w-full h-18 circle bg-gray-50"
                        animation="scale">
                        <Column className="flex-center">
                            <Text className="text-3xl text-bold">
                                {key.num}
                            </Text>
                            {key.letters && (
                                <Text className="text-xs text-gray-500 mt-1">
                                    {key.letters}
                                </Text>
                            )}
                        </Column>
                    </Button>
                ))}
            </GridView>
            
            {/* Action Buttons */}
            <Row className="justify-between items-center px-4">
                {/* Backspace */}
                {showDelete && (
                    <Button
                        action={`${stateKey}:backspace`}
                        className="w-14 h-14 circle bg-gray-100">
                        <Text className="text-xl">⌫</Text>
                    </Button>
                )}
                
                {!showDelete && <Container className="w-14" />}
                
                {/* Call Button */}
                <Button
                    action={onCall || 'makeCall'}
                    className="w-16 h-16 circle bg-green-500 shadow-lg"
                    animation="scale">
                    <Text className="text-3xl">📞</Text>
                </Button>
                
                {/* Add Contact */}
                <Button
                    action="addContact"
                    className="w-14 h-14 circle bg-gray-100">
                    <Text className="text-xl">👤</Text>
                </Button>
            </Row>
        </Column>
    );
};

module.exports = { DialPad };
