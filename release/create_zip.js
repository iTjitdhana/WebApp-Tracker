const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

function createZip() {
    const sourceDir = 'esp-tracker-release';
    const zipFilename = 'esp-tracker-web-v2.2.zip';
    
    // ลบไฟล์ ZIP เดิมถ้ามี
    if (fs.existsSync(zipFilename)) {
        fs.unlinkSync(zipFilename);
    }
    
    const output = fs.createWriteStream(zipFilename);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', () => {
        console.log(`ZIP file created: ${zipFilename}`);
        console.log(`Size: ${archive.pointer()} bytes`);
    });
    
    archive.on('error', (err) => {
        throw err;
    });
    
    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
}

createZip(); 