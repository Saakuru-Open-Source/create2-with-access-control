import * as ethers from 'ethers';
import * as dotenv  from 'dotenv';
import { networks } from '../../helpers/networks';
import { Create2Factory } from '../../dist/types';

dotenv.config();

console.log('Running... ', process.env.NETWORK);

const create2 = require(`../../deployments/${process.env.NETWORK}/Create2Factory.json`);
// const erc20 = require(`../../deployments/${process.env.NETWORK}/TokenERC20.json`);

export const deployments = {
  create2,
  // erc20,
};

const rpcUrl = networks[process.env.NETWORK || ''].url;
const provider = ethers.getDefaultProvider(rpcUrl);

export const wallet = new ethers.Wallet(networks[process.env.NETWORK || '0'].accounts[0], provider);

export const getContracts = () => {
  return {
    create2: new ethers.Contract(create2.address, create2.abi, wallet) as Create2Factory,
    // erc20: new ethers.Contract(erc20.address, erc20.abi, wallet) as TokenERC20,
  };
};

export const txConfig = {
  gasPrice: networks[process.env.NETWORK || ''].gasPrice !== undefined ? networks[process.env.NETWORK || ''].gasPrice : undefined,
};