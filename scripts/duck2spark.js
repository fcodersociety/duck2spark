function duck2sparkConvert(inputCode) {
    const lines = inputCode.split('\n');
    let outputCode = `#include "DigiKeyboard.h"\n\n#define KEY_UP 0x52\n#define KEY_DOWN 0x51\n#define KEY_LEFT 0x50\n#define KEY_RIGHT 0x4F\n#define KEY_TAB 0x2B\n\nvoid setup() {\n    DigiKeyboard.sendKeyStroke(0);\n    DigiKeyboard.delay(500);\n}\n\nvoid loop() {\n`;

    const keyMappings = {
        "ENTER": "KEY_ENTER",
        "TAB": "KEY_TAB",
        "UP": "KEY_UP",
        "DOWN": "KEY_DOWN",
        "LEFT": "KEY_LEFT",
        "RIGHT": "KEY_RIGHT",
        "F1": "KEY_F1", "F2": "KEY_F2", "F3": "KEY_F3", "F4": "KEY_F4", "F5": "KEY_F5",
        "F6": "KEY_F6", "F7": "KEY_F7", "F8": "KEY_F8", "F9": "KEY_F9", "F10": "KEY_F10",
        "F11": "KEY_F11", "F12": "KEY_F12"
    };

    const mappings = {
        "DELAY": (arg) => isNaN(arg) ? "Invalid argument for DELAY" : `    DigiKeyboard.delay(${arg});`,
        "STRING": (arg) => arg ? `    DigiKeyboard.print("${arg.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"")}");` : "Invalid argument for STRING",
        "GUI": (arg) => arg ? `    DigiKeyboard.sendKeyStroke(KEY_${arg.toUpperCase()}, MOD_GUI_LEFT);` : "Invalid argument for GUI",
        "CTRL": (arg) => arg ? `    DigiKeyboard.sendKeyStroke(KEY_${arg.toUpperCase()}, MOD_CONTROL_LEFT);` : "Invalid argument for CTRL",
        "ALT": (arg) => arg ? `    DigiKeyboard.sendKeyStroke(KEY_${arg.toUpperCase()}, MOD_ALT_LEFT);` : "Invalid argument for ALT",
        "SHIFT": (arg) => arg ? `    DigiKeyboard.sendKeyStroke(KEY_${arg.toUpperCase()}, MOD_SHIFT_LEFT);` : "Invalid argument for SHIFT",
        "REM": (arg) => `    // ${arg}`
    };

    for (let line of lines) {
        const parts = line.trim().split(/ (.+)/);
        const command = parts[0];
        const arg = parts[1] || "";

        if (command in mappings) {
            let result = mappings[command](arg);
            if (typeof result === "string" && result.startsWith("Invalid")) {
                return { status: 1, message: `Error: ${result}` };
            }
            outputCode += result + "\n";
        } else if (command in keyMappings) {
            outputCode += `    DigiKeyboard.sendKeyStroke(${keyMappings[command]});\n`;
        } else if (command) {
            return { status: 1, message: `Error: Unknown command '${command}'` };
        }
    }

    outputCode += `    while(1);\n}`;
    return { status: 0, message: outputCode };
}