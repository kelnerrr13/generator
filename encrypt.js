function encrypt(text, key = "my-secret-key") {
    const textBytes = new TextEncoder().encode(text);
    const keyBytes  = new TextEncoder().encode(key);

    const encrypted = new Uint8Array(textBytes.length);
    for (let i = 0; i < textBytes.length; i++) {
        encrypted[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    let binary = '';
    encrypted.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary);
}

const url = "https://raw.githubusercontent.com/kelnerrr13/license/main/license.txt";