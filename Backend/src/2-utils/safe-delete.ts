import fsPromises from 'fs/promises';
import fs from 'fs';

async function safeDelete(filename: string): Promise<void> {
    try {
        if (!filename) return;
        // check if file exists
        if (fs.existsSync(filename)) {
            // waits for the file not to be used by other programs
            await fsPromises.unlink(filename);
        }
    }
    catch (err: any) {
        console.error(err);
    }
}

export default safeDelete;