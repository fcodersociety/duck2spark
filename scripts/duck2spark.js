function duck2sparkConvert(inputCode) {
    const lines = inputCode.split('\n');
    let outputCode = `#include "DigiKeyboard.h"\n\nvoid setup() {\n    DigiKeyboard.sendKeyStroke(0);\n    DigiKeyboard.delay(500);\n}\n\nvoid loop() {\n`;

    const mappings = {
        "DELAY": (arg) => isNaN(arg) ? null : `    DigiKeyboard.delay(${arg});`,
        "STRING": (arg) => arg ? `    DigiKeyboard.print("${arg.replace(/"/g, '\\"')}");` : null,
        "ENTER": () => `    DigiKeyboard.sendKeyStroke(KEY_ENTER);`,
        "WINDOWS": () => `    DigiKeyboard.sendKeyStroke(KEY_R, MOD_GUI_LEFT);`,
        "CTRL": (arg) => arg ? `    DigiKeyboard.sendKeyStroke(${arg}, MOD_CONTROL_LEFT);` : null,
        "ALT": (arg) => arg ? `    DigiKeyboard.sendKeyStroke(${arg}, MOD_ALT_LEFT);` : null,
        "TAB": () => `    DigiKeyboard.sendKeyStroke(KEY_TAB);`,
        "REM": () => null // Ignore comment lines
    };

    for (let line of lines) {
        const parts = line.trim().split(/ (.+)/);
        const command = parts[0];
        const arg = parts[1] || "";

        if (command in mappings) {
            let result = mappings[command](arg);
            if (result === null && command !== "REM") {
                return { status: 1, message: `Invalid argument for command: ${command}` };
            }
            if (result) outputCode += result + "\n";
        } else if (command) {
            return { status: 1, message: `Unknown command: ${command}` };
        }
    }

    outputCode += `    return;\n}`;

    return { status: 0, message: outputCode };
}
