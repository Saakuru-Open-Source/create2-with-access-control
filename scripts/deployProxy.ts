import { ethers } from 'ethers';
import { networks } from '../helpers/networks';

const rpcUrl = networks[process.env.NETWORK || ''].url;
const provider = ethers.getDefaultProvider(rpcUrl);

async function deployProxy() {
  // The exact transaction data that needs to be sent
  const DEPLOYMENT_TX = '0xf8a58085174876e800830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf31ba02222222222222222222222222222222222222222222222222222222222222222a02222222222222222222222222222222222222222222222222222222222222222';

  try {
           
    // Method 2: Alternative using raw transaction
    const rawTx = await provider.sendTransaction(DEPLOYMENT_TX);
    console.log('Raw deployment transaction:', rawTx.hash);
    console.log('Raw deployment transaction:', await rawTx.wait(3000));

  } catch (error) {
    console.error('Deployment failed:', error);
  }
}

async function verifyProxy() {
  const EXPECTED_ADDRESS = '0x4e59b44847b379578588920ca78fbf26c0b4956c';
    
  const code = await provider.getCode(EXPECTED_ADDRESS);
  if (code !== '0x') {
    console.log('Proxy already deployed');
    return true;
  }
  return false;
}

async function main() {
  const isDeployed = await verifyProxy();
  if (!isDeployed) {
    await deployProxy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});