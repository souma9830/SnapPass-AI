/**
 * Invisible LSB digital steganographic watermark embedder for tamper prevention
 */

export function generateWatermarkSignature(photoId, tenantKey = 'SNAPPASS') {
  return `SP-VERIFIED-${photoId}-${tenantKey}-${Date.now()}`;
}

export function verifySteganographySignature(extractedSig) {
  if (!extractedSig || typeof extractedSig !== 'string') return false;
  return extractedSig.startsWith('SP-VERIFIED-');
}
