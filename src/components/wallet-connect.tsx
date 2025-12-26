'use client';

import { useEffect, useState } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { shortenAddress } from '@/lib/stacks-utils';
import { Wallet, LogOut, ExternalLink, Chrome } from 'lucide-react';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const STACKS_WALLETS = [
  {
    name: 'Leather Wallet',
    description: 'Bitcoin & Stacks cüzdanı',
    url: 'https://leather.io/install-extension',
    icon: '🟤'
  },
  {
    name: 'Xverse Wallet',
    description: 'Bitcoin, Ordinals & Stacks',
    url: 'https://www.xverse.app/download',
    icon: '🟣'
  },
  {
    name: 'Hiro Wallet',
    description: 'Stacks Web Wallet',
    url: 'https://wallet.hiro.so/',
    icon: '🔵'
  }
];

export function WalletConnect() {
  const [userData, setUserData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  const connectWallet = () => {
    try {
      showConnect({
        appDetails: {
          name: 'Stacks Tip Jar',
          icon: window.location.origin + '/favicon.ico',
        },
        redirectTo: '/',
        onFinish: () => {
          setUserData(userSession.loadUserData());
          window.location.reload();
        },
        onCancel: () => {
          console.log('Wallet connection cancelled');
        },
        userSession,
      });
    } catch (error) {
      console.error('Wallet connection error:', error);
      setShowWalletModal(true);
    }
  };

  const disconnectWallet = () => {
    userSession.signUserOut();
    setUserData(null);
    window.location.reload();
  };

  if (!mounted) {
    return (
      <Button variant="outline" disabled>
        <Wallet className="mr-2 h-4 w-4" />
        Bağlan
      </Button>
    );
  }

  if (userData) {
    const address = userData.profile.stxAddress.mainnet;
    return (
      <Card className="flex items-center gap-2 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-mono">{shortenAddress(address)}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={disconnectWallet}
          className="ml-2"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </Card>
    );
  }

  return (
    <>
      <Button onClick={connectWallet} size="lg" className="bg-gradient-to-r from-orange-500 to-purple-600">
        <Wallet className="mr-2 h-5 w-5" />
        Cüzdanı Bağla
      </Button>

      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Chrome className="h-5 w-5" />
              Stacks Cüzdanı Gerekli
            </DialogTitle>
            <DialogDescription>
              Devam etmek için bir Stacks cüzdanı yüklemeniz gerekiyor. Aşağıdaki seçeneklerden birini seçin:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            {STACKS_WALLETS.map((wallet) => (
              <a
                key={wallet.name}
                href={wallet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{wallet.icon}</span>
                  <div>
                    <p className="font-medium">{wallet.name}</p>
                    <p className="text-sm text-muted-foreground">{wallet.description}</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            💡 <strong>İpucu:</strong> Cüzdanı yükledikten sonra bu sayfayı yenileyin ve tekrar "Cüzdanı Bağla" butonuna tıklayın.
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { userSession };
