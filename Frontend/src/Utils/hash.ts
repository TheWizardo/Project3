import cryptoJS from 'crypto-js';

const salt = "YellowBrickRoad";

function sha256(plainText: string): string {
    return cryptoJS.HmacSHA256(plainText, salt).toString();
}

export default sha256;