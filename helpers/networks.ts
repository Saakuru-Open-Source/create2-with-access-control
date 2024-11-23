import * as dotenv from 'dotenv';

// @ts-ignore
dotenv.config();

const privateKey = process.env.PRIVATE_KEY || '';

export const networks = {
  saakuruTestnet:{
    url: 'https://rpc-testnet.saakuru.network',
    chainId: 247253,
    accounts: [`0x${privateKey}`],
    live: true,
    saveDeployments: true,
    gasPrice: 0,
  },

  saakuruMainnet:{
    url: 'https://rpc.saakuru.network',
    accounts: [`0x${privateKey}`],
    chainId: 7225878,
    live: true,
    saveDeployments: true,
    gasPrice: 0,
  },
};