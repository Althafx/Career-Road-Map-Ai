const fs = require('fs');
try {
    const content = fs.readFileSync('test_output.txt', 'utf8'); // or 'ucs2' if powershell
    console.log(content);
} catch (e) {
    // try reading as ucs2 (utf16le)
    const content = fs.readFileSync('test_output.txt', 'ucs2');
    console.log(content);
}
