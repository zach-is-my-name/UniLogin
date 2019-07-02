import {ensure} from '@universal-login/commons';
import UserWallet from '../../core/entities/UserWallet';
import WalletService from '../WalletService';

export class WalletFormatter {
  constructor(
    private walletService: WalletService
  ) {}

  getName(): string {
    ensure(!!this.walletService.userWallet, Error, 'UserWallet not found');
    ensure(this.walletService.state === 'Deployed', Error, 'UserWallet is not deployed yet');
    return (this.walletService.userWallet! as UserWallet).name;
  }

  getContractAddress(): string {
    ensure(!!this.walletService.userWallet, Error, 'UserWallet not found');
    return this.walletService.userWallet!.contractAddress;
  }
}

export default WalletFormatter;
