import { BigNumber, Wallet } from 'ethers';
import { waffle } from 'hardhat';
import { TokenERC20 } from '../dist/types';
import { integrationFixture } from './shared/integration';

const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('ERC20', function () {
  let users: Wallet[];
  let erc20: TokenERC20;
  let loadFixture: ReturnType<typeof waffle.createFixtureLoader>;
  
  before('create fixture loader', async () => {
    users = await (ethers as any).getSigners();
    loadFixture = waffle.createFixtureLoader(users);
  });
  
  beforeEach('deploy fixture', async () => {
    ({ erc20 } = await loadFixture(integrationFixture));
  });

  it('Should return corrfect balance after transfer', async function () {
    expect(await erc20.balanceOf(users[0].address)).to.equal(BigNumber.from(10).pow(18).mul(1000000));
  });

});