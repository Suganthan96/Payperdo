/**
 * Converts Ethereum-style address (20 bytes) to Move/Aptos format (32 bytes)
 * @param ethAddress - Ethereum address like 0x98b38eD5aAbF219fd5a01e8F3eEB28248d2edF6e
 * @returns Move address like 0x00000000000000000000000098b38eD5aAbF219fd5a01e8F3eEB28248d2edF6e
 */
export const convertEthToMoveAddress = (ethAddress: string): string => {
  // Remove 0x prefix if present
  const cleanAddress = ethAddress.startsWith('0x') ? ethAddress.slice(2) : ethAddress;
  
  // Pad with leading zeros to make it 64 characters (32 bytes)
  const paddedAddress = cleanAddress.padStart(64, '0');
  
  // Add 0x prefix back
  return '0x' + paddedAddress;
};

/**
 * Test function to verify address conversion
 */
export const testAddressConversion = () => {
  const ethAddress = "0x98b38eD5aAbF219fd5a01e8F3eEB28248d2edF6e";
  const moveAddress = convertEthToMoveAddress(ethAddress);
  
  console.log('🔄 Address Conversion Test:');
  console.log('Original (Ethereum):', ethAddress);
  console.log('Converted (Move):', moveAddress);
  console.log('Length check:', moveAddress.length, 'should be 66');
  
  return {
    original: ethAddress,
    converted: moveAddress,
    valid: moveAddress.length === 66
  };
};