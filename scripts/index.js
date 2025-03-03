// index.js - Optimized Main JS for index file.

const inputField = document.getElementById("input-code");
const outputField = document.getElementById("output-code");
const terminalOutput = document.getElementById("terminal-container");
const downloadBtn = document.getElementById("download-btn");

// Logs messages to the terminal
function logToTerminal(message, isError = false) {
    const messageElement = document.createElement("p");
    messageElement.classList.add(isError ? "terminal-error" : "terminal-stdout");
    messageElement.innerHTML = `<span class="terminal-prompt">Duck2Spark:~$</span> ${message}`;
    terminalOutput.appendChild(messageElement);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Clears input field
function clearInput() {
    inputField.value = "";
    inputField.placeholder = "Paste your Ducky script here...";
    logToTerminal("Input cleared");
}

// Clears session, disables download button
function clearOutput() {
    inputField.value = outputField.value = "";
    inputField.placeholder = "Paste your Ducky script here...";
    terminalOutput.innerHTML = "";
    downloadBtn.setAttribute("disabled", "true");
    logToTerminal("Session cleared");
}

// Pastes clipboard content into input field
async function pasteInput() {
    try {
        inputField.value = await navigator.clipboard.readText();
        logToTerminal("Pasted content from clipboard");
    } catch {
        logToTerminal("Error: Failed to read clipboard", true);
    }
}

// Copies output to clipboard with UI feedback
function copyOutput() {
    navigator.clipboard.writeText(outputField.value).then(() => {
        const copyBtn = document.getElementById("copy-output");
        copyBtn.innerHTML = "✔";
        logToTerminal("Output copied to clipboard");
        setTimeout(() => copyBtn.innerHTML = "🗒", 500);
    }).catch(() => logToTerminal("Error: Failed to copy output", true));
}

// Converts input Ducky Script to DigiSpark code
function convertCode() {
    const inputCode = inputField.value.trim();
    if (!inputCode) return logToTerminal("Input is empty", true);

    const result = duck2sparkConvert(inputCode);
    outputField.value = result.status === 0 ? result.message : "";
    downloadBtn.toggleAttribute("disabled", result.status !== 0);
    logToTerminal(result.status === 0 ? "Conversion successful" : result.message, result.status !== 0);
}

// Downloads the converted code
function downloadCode() {
    if (downloadBtn.hasAttribute("disabled")) return logToTerminal("Error: No valid output to download", true);
    const blob = new Blob([outputField.value], { type: "text/plain" });
    const a = Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(blob), download: "SparkCode.ino"
    });
    document.body.appendChild(a).click();
    document.body.removeChild(a);
    logToTerminal("File downloaded as SparkCode.ino");
}

// Input field behavior
inputField.addEventListener("focus", () => inputField.removeAttribute("placeholder"));
inputField.addEventListener("blur", () => !inputField.value.trim() && inputField.setAttribute("placeholder", "Paste your Ducky script here..."));
inputField.addEventListener("keydown", e => e.ctrlKey && e.key === "Enter" && (e.preventDefault(), convertCode()));

// Output field behavior
outputField.addEventListener("keydown", e => e.ctrlKey && e.key === "Enter" && (e.preventDefault(), downloadCode()));

// Event Listeners
document.getElementById("clear-input").addEventListener("click", clearInput);
document.getElementById("clear-output").addEventListener("click", clearOutput);
document.getElementById("past-input").addEventListener("click", pasteInput);
document.getElementById("copy-output").addEventListener("click", copyOutput);
document.getElementById("convert-btn").addEventListener("click", convertCode);
document.getElementById("download-btn").addEventListener("click", downloadCode);