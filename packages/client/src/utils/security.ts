/**
 * Encode Base64
 * 
 * @param {string} client_id
 * @param {string} client_secret
 */
export const encodeBasicAuthenticationHeader = (client_id: string, client_secret: string) => {
    return Buffer.from(`${client_id}:${client_secret}`).toString('base64');
};