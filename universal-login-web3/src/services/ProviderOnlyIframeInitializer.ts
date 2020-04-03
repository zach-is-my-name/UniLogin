import {ULWeb3Provider} from '../ULWeb3Provider';
import {Property} from 'reactive-properties';
import {IframeInitializerBase} from './IframeInitializerBase';
import {Provider} from 'web3/providers';
import {Network, ApplicationInfo} from '@unilogin/commons';
import {IframeBridgeEndpoint} from './IframeBridgeEndpoint';

export class ProviderOnlyIframeInitializer extends IframeInitializerBase {
  private readonly provider: ULWeb3Provider;

  constructor(endpoint: IframeBridgeEndpoint, network: Network, applicationInfo?: ApplicationInfo) {
    super(endpoint);
    this.provider = ULWeb3Provider.getDefaultProvider(network, applicationInfo);
    endpoint.setHandler(this.provider);
  }

  async start() {
    await super.start();
    await this.provider.init();
    super.ready();
  }

  protected getProvider(): Provider {
    return this.provider;
  }

  protected getIsUiVisible(): Property<boolean> {
    return this.provider.isUiVisible;
  }

  protected getHasNotifications(): Property<boolean> {
    return this.provider.hasNotifications;
  }
}
