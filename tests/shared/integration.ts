import { ethers } from 'hardhat';
import { Fixture } from 'ethereum-waffle';
import { Create2Factory, TokenERC20 } from '../../dist/types';

interface ContractFixture {
  erc20: TokenERC20;
  create2: Create2Factory;
}

export const integrationFixture: Fixture<ContractFixture> =
  async function (): Promise<ContractFixture> {
    const users = await ethers.getSigners();

    // Deploy the Create2Factory contract
    const create2 = await (
      await ethers.getContractFactory('Create2Factory')
    ).deploy() as Create2Factory;
    await create2.deployed();

    console.log('Create2Factory deployed at: ', create2.address);

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

    // Check if the contract is already deployed
    const codeAtAddress = await ethers.provider.getCode(predictedAddress);
    if (codeAtAddress !== '0x') {
      console.log('TokenERC20 already deployed at: ', predictedAddress);
      const erc20 = (await ethers.getContractAt(
        'TokenERC20',
        predictedAddress,
        users[0],
      )) as TokenERC20;
      return { erc20, create2 };
    }

    // Deploy the TokenERC20 contract through Create2
    const tx = await create2.deploy(bytecode, salt);
    const receipt = await tx.wait();

    // Validate the deployed address
    const deployedAddress = receipt.events?.find(
      (event) => event.event === 'ContractDeployed',
    )?.args?.deployedAddress;

    if (!deployedAddress || deployedAddress !== predictedAddress) {
      throw new Error('Deployed address does not match predicted address!');
    }

    console.log('Deployed TokenERC20 address: ', deployedAddress);

    // Get the deployed TokenERC20 contract instance
    const erc20 = (await ethers.getContractAt(
      'TokenERC20',
      deployedAddress,
      users[0],
    )) as TokenERC20;

    console.log('TokenERC20 contract retrieved at address: ', erc20.address);

    return {
      erc20,
      create2,
    };
  };
