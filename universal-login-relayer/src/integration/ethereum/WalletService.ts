import {EventEmitter} from 'fbemitter';
import {utils} from 'ethers';
import {ensure, RequiredBalanceChecker, computeCounterfactualAddress, DeployArgs, getInitializeSigner, DEPLOY_GAS_LIMIT, DeviceInfo} from '@universal-login/commons';
import {encodeInitializeWithENSData} from '@universal-login/contracts';
import ENSService from './ensService';
import {NotEnoughBalance, InvalidSignature, NotEnoughGas} from '../../core/utils/errors';
import {Config} from '../../config/relayer';
import {WalletDeployer} from './WalletDeployer';
import {DevicesService} from '../../core/services/DevicesService';

class WalletService {
  constructor(
    private config: Config,
    private ensService: ENSService,
    private hooks: EventEmitter,
    private walletDeployer: WalletDeployer,
    private requiredBalanceChecker: RequiredBalanceChecker,
    private devicesService: DevicesService) {
  }

  async deploy({publicKey, ensName, gasPrice, gasToken, signature}: DeployArgs, deviceInfo: DeviceInfo) {
    ensure(utils.bigNumberify(gasPrice).gt(0), NotEnoughGas);
    const ensArgs = await this.ensService.argsFor(ensName);
    const contractAddress = computeCounterfactualAddress(this.config.factoryAddress, publicKey, await this.walletDeployer.getInitCode());
    ensure(!!await this.requiredBalanceChecker.findTokenWithRequiredBalance(this.config.supportedTokens, contractAddress), NotEnoughBalance);
    const args = [publicKey, ...ensArgs as string[], gasPrice, gasToken];
    const initWithENS = encodeInitializeWithENSData(args);
    ensure(getInitializeSigner(initWithENS, signature) === publicKey, InvalidSignature);
    const transaction = await this.walletDeployer.deploy({publicKey, signature, intializeData: initWithENS}, {gasLimit: DEPLOY_GAS_LIMIT, gasPrice: utils.bigNumberify(gasPrice)});
    await this.devicesService.addOrUpdate(contractAddress, publicKey, deviceInfo);
    this.hooks.emit('created', {transaction, contractAddress});
    return transaction;
  }
}

export default WalletService;