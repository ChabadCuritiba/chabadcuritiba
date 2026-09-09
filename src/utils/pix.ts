/**
 * Official Central Bank of Brazil (BACEN) PIX EMV Payload Generator
 * Complies with EMVCo & BACEN BR Code specifications including strict CRC16-CCITT.
 */

function formatTLV(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

/**
 * Calculates CRC16-CCITT (polynomial 0x1021, init 0xFFFF) required by Bacen PIX specification
 */
function calculateCRC16(str: string): string {
  let crc = 0xFFFF;
  const polynomial = 0x1021;

  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    crc ^= (charCode << 8);

    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }

  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Cleans string of special characters/accents for EMV compliance
 */
function cleanString(str: string, maxLength: number): string {
  const normalized = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-zA-Z0-9 ]/g, '')   // remove non-alphanumeric
    .trim();
  return normalized.substring(0, maxLength).toUpperCase();
}

export interface PixOptions {
  pixKey: string;
  merchantName?: string;
  merchantCity?: string;
  amount?: number;
  txId?: string;
  description?: string;
}

export function generatePixPayload({
  pixKey = 'kitov@chabadcuritiba.com',
  merchantName = 'BEIT CHABAD CURITIBA',
  merchantCity = 'CURITIBA',
  amount,
  txId = '***',
  description = 'CHABAD'
}: PixOptions): string {
  // 00 - Payload Format Indicator (Fixed '01')
  const tag00 = formatTLV('00', '01');

  // 26 - Merchant Account Information (PIX)
  const gui = formatTLV('00', 'br.gov.bcb.pix');
  const key = formatTLV('01', pixKey.trim());
  const desc = description ? formatTLV('02', cleanString(description, 20)) : '';
  const tag26 = formatTLV('26', `${gui}${key}${desc}`);

  // 52 - Merchant Category Code ('0000' or generic)
  const tag52 = formatTLV('52', '0000');

  // 53 - Transaction Currency ('986' for BRL)
  const tag53 = formatTLV('53', '986');

  // 54 - Transaction Amount (optional or formatted to 2 decimals)
  let tag54 = '';
  if (amount && amount > 0) {
    tag54 = formatTLV('54', amount.toFixed(2));
  }

  // 58 - Country Code ('BR')
  const tag58 = formatTLV('58', 'BR');

  // 59 - Merchant Name (Max 25 chars)
  const tag59 = formatTLV('59', cleanString(merchantName, 25));

  // 60 - Merchant City (Max 15 chars)
  const tag60 = formatTLV('60', cleanString(merchantCity, 15));

  // 62 - Additional Data Field Template (TxID)
  const tagTxId = formatTLV('05', cleanString(txId, 25) || '***');
  const tag62 = formatTLV('62', tagTxId);

  // Combine payload before CRC
  const rawPayload = `${tag00}${tag26}${tag52}${tag53}${tag54}${tag58}${tag59}${tag60}${tag62}6304`;

  // Calculate CRC16 checksum
  const crc = calculateCRC16(rawPayload);

  return `${rawPayload}${crc}`;
}
