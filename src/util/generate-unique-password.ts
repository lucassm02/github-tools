import crypto from 'crypto';
import os from 'os';

export function generateUniquePassword() {
  const networkInterfaces = os.networkInterfaces();

  let macAddress = '';

  for (const iface of Object.values(networkInterfaces)) {
    if (!iface) continue;

    for (const detail of iface) {
      if (detail.mac && detail.mac !== '00:00:00:00:00:00') {
        macAddress = detail.mac;
        break;
      }
    }
    if (macAddress) break;
  }

  if (!macAddress) {
    throw new Error(`Unable to obtain the machine's MAC address`);
  }

  const uniqueData = `${macAddress.slice(0, -4)}#${os.platform()}#${os.hostname()}#${os.cpus().length}`;

  const hash = crypto.createHash('sha256').update(uniqueData).digest('hex');
  return hash;
}
