import fs from 'fs'
import config from '../2-utils/config';

async function exists(filePath: string): Promise<boolean> {
    return new Promise((res, rej) => res(fs.existsSync(filePath)));
}

async function getFilePath(fullPath: string): Promise<string> {
    // checking if given image exists
    const exist = await exists(fullPath);
    if (!exist){
        // returning default image
        return `${config.imagesFolder}/imageNotFound.png`;
    };
    return fullPath;
}

export default { getFilePath };