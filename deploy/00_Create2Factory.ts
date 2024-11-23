import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy('Create2Factory', {
    from: deployer,
    args: [],
    log: true,
    skipIfAlreadyDeployed: true,
    contract: 'Create2Factory',
  });
};

export default func;
func.id = 'Create2Factory';
func.tags = ['hardhat', 'create2'];
func.dependencies = [];
