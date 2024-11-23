// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Create2Factory is AccessControl {
    // Define roles
    bytes32 public constant DEPLOYER_ROLE = keccak256("DEPLOYER_ROLE");

    // Events
    event ContractDeployed(address indexed deployedAddress, bytes32 salt);

    constructor() {
        // Grant DEPLOYER_ROLE to the contract deployer
        _setupRole(DEPLOYER_ROLE, msg.sender);

        // Grant DEFAULT_ADMIN_ROLE to the contract deployer
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Deploys a contract using CREATE2.
     * @param bytecode The creation code of the contract to deploy.
     * @param salt A salt to determine the contract address.
     * @return deployedAddress The address of the deployed contract.
     */
    function deploy(bytes memory bytecode, bytes32 salt) public onlyRole(DEPLOYER_ROLE) returns (address deployedAddress) {
        require(bytecode.length > 0, "Bytecode cannot be empty");

        // Compute the address where the contract will be deployed
        address predictedAddress = getAddress(bytecode, salt);
        require(predictedAddress.code.length == 0, "Contract already deployed");

        // Deploy the contract using CREATE2
        assembly {
            deployedAddress := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
            if iszero(deployedAddress) {
                revert(0, 0)
            }
        }

        emit ContractDeployed(deployedAddress, salt);
    }

    /**
     * @dev Computes the address of a contract deployed using CREATE2.
     * @param bytecode The creation code of the contract.
     * @param salt A salt to determine the contract address.
     * @return predictedAddress The predicted address of the contract.
     */
    function getAddress(bytes memory bytecode, bytes32 salt) public view returns (address predictedAddress) {
        bytes32 bytecodeHash = keccak256(bytecode);
        predictedAddress = address(
            uint160(
                uint256(
                    keccak256(
                        abi.encodePacked(
                            bytes1(0xff),
                            address(this),
                            salt,
                            bytecodeHash
                        )
                    )
                )
            )
        );
    }

    /**
     * @dev Allows the admin to grant the DEPLOYER_ROLE to another address.
     * @param account The address to grant the role.
     */
    function grantDeployerRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(DEPLOYER_ROLE, account);
    }
}
