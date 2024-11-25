import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';
import { Create2FactoryV2 } from '../dist/types/Create2FactoryV2';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { log, get } = hre.deployments;

  const deployerContractDeployment = await get('Create2FactoryV2');
  const create2Factory = await ethers.getContractAt('Create2FactoryV2', deployerContractDeployment.address) as Create2FactoryV2;


  // Get the TokenERC20 contract factory and bytecode
  const tokenFactory = await ethers.getContractFactory('TokenERC20');
  let bytecode = tokenFactory.bytecode;

  // Define the constructor argument: receiver address
  const receiverAddress = deployer; // Replace with the desired receiver address
  log(`Receiver address: ${receiverAddress}`);

  // Encode the constructor argument
  const encodedArgs = ethers.utils.defaultAbiCoder.encode(
    ['address'], // Constructor argument type
    [receiverAddress], // Constructor argument value
  );

  // Append the constructor arguments to the bytecode
  bytecode += encodedArgs.slice(2); // Remove '0x' from encoded args and append

  // Define a salt for deterministic deployment
  const salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('TokenERC20'));

  // Precompute the address
  const predictedAddress = await create2Factory.getAddress(bytecode, salt);
  log(`Predicted TokenERC20 address: ${predictedAddress}`);

  // Check if the contract is already deployed at the predicted address
  const codeAtAddress = await ethers.provider.getCode(predictedAddress);
  if (codeAtAddress !== '0x') {
    log(`TokenERC20 already deployed at: ${predictedAddress}`);
    return;
  }

  // Deploy the TokenERC20 contract using Create2Factory
  const deployTx = await create2Factory.deploy(bytecode, salt);
  const receipt = await deployTx.wait();

  const deployedAddress = receipt.events?.find(
    (event) => event.event === 'ContractDeployed',
  )?.args?.deployedAddress;

  if (deployedAddress !== predictedAddress) {
    throw new Error('Deployed address does not match predicted address!');
  }

  log(`TokenERC20 deployed at: ${deployedAddress}`);
};

export default func;

func.id = 'TokenERC20'; // Unique id for the deploy script
func.tags = ['hardhat', 'erc20v2'];
func.dependencies = ['Create2FactoryV2'];
