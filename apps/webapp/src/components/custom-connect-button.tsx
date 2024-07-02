import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@rearden/ui/components/ui/button';

export const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div>
            {(() => {
              if (chain?.unsupported) {
                return (
                  <Button onClick={openChainModal} variant='secondary' className='px-10'>
                    Wrong network
                  </Button>
                );
              }

              if (connected) {
                return (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Button onClick={openChainModal} variant='secondary' className='px-10'>
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </Button>

                    <Button onClick={openAccountModal} variant='secondary' className='px-10'>
                      {account.displayName}
                    </Button>
                  </div>
                );
              }

              return (
                <Button onClick={openConnectModal} className='w-[141px]'>
                  Connect Wallet
                </Button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
