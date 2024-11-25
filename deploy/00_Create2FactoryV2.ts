import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy('Create2FactoryV2', {
    from: deployer,
    args: [],
    log: true,
    skipIfAlreadyDeployed: true,
    contract: 'Create2FactoryV2',
  });
};

export default func;
func.id = 'Create2FactoryV2';
func.tags = ['hardhat', 'create2V2'];
func.dependencies = [];
