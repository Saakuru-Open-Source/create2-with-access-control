import * as dotenv  from 'dotenv';
import { getContracts, txConfig } from './utils/setup';
import {  ethers } from 'ethers';

dotenv.config();

console.log('Running... ', process.env.NETWORK);

const main = async () => {

  const contracts = getContracts();

  const DEPLOYER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('DEPLOYER_ROLE'));
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
