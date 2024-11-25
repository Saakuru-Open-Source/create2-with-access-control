import { ethers } from 'hardhat';
import { Fixture } from 'ethereum-waffle';
import { Create2Factory, TokenERC20, Create2FactoryV2 } from '../../dist/types';

interface ContractFixture {
  erc20: TokenERC20;
  erc20V2: TokenERC20;
  create2: Create2Factory;
  create2V2: Create2FactoryV2;
}

const deployERC20 = async (create2: Create2Factory | Create2FactoryV2, bytecode: string, salt: string): Promise<TokenERC20> => {
  const users = await ethers.getSigners();
  // Deploy the TokenERC20 contract through Create2
  const tx = await create2.deploy(bytecode, salt);
  const receipt1 = await tx.wait();

  // Validate the deployed address
  const deployedAddress = receipt1.events?.find(
    (event) => event.event === 'ContractDeployed',
  )?.args?.deployedAddress;

  console.log('Deployed TokenERC20 address: ', deployedAddress);

  // Get the deployed TokenERC20 contract instance
  const erc20 = (await ethers.getContractAt(
    'TokenERC20',
    deployedAddress,
    users[0],
  )) as TokenERC20;

  console.log('TokenERC20 contract retrieved at address: ', erc20.address);

  return erc20;
};
export const integrationFixture: Fixture<ContractFixture> =
  async function (): Promise<ContractFixture> {
    const users = await ethers.getSigners();

    // Deploy the Create2Factory contract
    const create2 = await (
      await ethers.getContractFactory('Create2Factory')
    ).deploy() as Create2Factory;
    await create2.deployed();

    console.log('Create2Factory deployed at: ', create2.address);

    const create2V2 = await (
      await ethers.getContractFactory('Create2FactoryV2')
    ).deploy() as Create2FactoryV2;
    await create2V2.deployed();

    console.log('Create2FactoryV2 deployed at: ', create2V2.address);
  
    // Get TokenERC20 contract factory and bytecode
    const tokenFactory = await ethers.getContractFactory('TokenERC20');
    let bytecode = tokenFactory.bytecode;

    // Define the constructor argument: receiver address
    const receiverAddress = users[0].address; // Replace with the desired address
    console.log('Receiver address for TokenERC20: ', receiverAddress);

    // Encode the constructor arguments
    const encodedArgs = ethers.utils.defaultAbiCoder.encode(
      ['address'], // Constructor argument type
      [receiverAddress], // Constructor argument value
    );

    // Append the constructor arguments to the bytecode
    bytecode += encodedArgs.slice(2); // Remove '0x' and append to bytecode

    // Define a salt for deterministic deployment
    const salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('TokenERC20'));

    // Precompute the contract address
    const predictedAddress = await create2.getAddress(bytecode, salt);
    console.log('Predicted TokenERC20 address: ', predictedAddress);

    const predictedAddressV2 = await create2V2.getAddress(bytecode, salt);
    console.log('Predicted TokenERC20V2 address: ', predictedAddressV2);

    const erc20 = await deployERC20(create2, bytecode, salt);
    const erc20V2 = await deployERC20(create2V2, bytecode, salt);

    return {
      erc20,
      erc20V2,
      create2,
      create2V2,
    };
  };
