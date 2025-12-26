'use client'
import { useEffect, useState } from 'react';
import { WalletConnect, userSession } from '@/components/wallet-connect';
import { CreateTipPage } from '@/components/create-tip-page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Trophy, Share2, Zap, ArrowRight, Bitcoin } from 'lucide-react';
import Link from 'next/link';
import { sdk } from "@farcaster/miniapp-sdk";
import { useAddMiniApp } from "@/hooks/useAddMiniApp";
import { useQuickAuth } from "@/hooks/useQuickAuth";
import { useIsInFarcaster } from "@/hooks/useIsInFarcaster";

export default function HomePage() {
    const { addMiniApp } = useAddMiniApp();
    const isInFarcaster = useIsInFarcaster()
    useQuickAuth(isInFarcaster)
    useEffect(() => {
      const tryAddMiniApp = async () => {
        try {
          await addMiniApp()
        } catch (error) {
          console.error('Failed to add mini app:', error)
        }

      }

    

      tryAddMiniApp()
    }, [addMiniApp])
    useEffect(() => {
      const initializeFarcaster = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100))
          
          if (document.readyState !== 'complete') {
            await new Promise<void>(resolve => {
              if (document.readyState === 'complete') {
                resolve()
              } else {
                window.addEventListener('load', () => resolve(), { once: true })
              }

            })
          }

    

          await sdk.actions.ready()
          console.log('Farcaster SDK initialized successfully - app fully loaded')
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error)
          
          setTimeout(async () => {
            try {
              await sdk.actions.ready()
              console.log('Farcaster SDK initialized on retry')
            } catch (retryError) {
              console.error('Farcaster SDK retry failed:', retryError)
            }

          }, 1000)
        }

      }

    

      initializeFarcaster()
    }, [])
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setIsConnected(userSession.isUserSignedIn());
    
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const address = userData.profile.stxAddress.mainnet;
      const storedUsername = localStorage.getItem(`tipjar_username_${address}`);
      setUsername(storedUsername);

      // Kullanıcı verilerini sakla
      if (storedUsername) {
        localStorage.setItem(
          `tipjar_user_${storedUsername}`,
          JSON.stringify({ address })
        );
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-purple-500">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Stacks Tip Jar</h1>
              <p className="text-xs text-muted-foreground">Bitcoin L2 Bahşiş Platformu</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/leaderboard">
              <Button variant="ghost" size="sm">
                <Trophy className="mr-2 h-4 w-4" />
                Liderler
              </Button>
            </Link>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="mb-8">
          <div className="mb-4 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-purple-500">
              <Bitcoin className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="mb-4 text-5xl font-bold">
            Bitcoin L2'de
            <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              {' '}Bahşiş Gönder
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Stacks blockchain'de kripto bahşiş gönder ve al. Ko-fi gibi, ama tamamen Bitcoin L2 üzerinde. 🚀
          </p>
        </div>

        {!isConnected ? (
          <div className="flex justify-center">
            <WalletConnect />
          </div>
        ) : username ? (
          <div className="flex flex-col items-center gap-4">
            <Card className="w-full max-w-md border-2 border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="mb-4 text-center">
                  <p className="text-sm text-muted-foreground">Bahşiş sayfanız hazır!</p>
                  <p className="text-lg font-bold">@{username}</p>
                </div>
                <Link href={`/tip/${username}`}>
                  <Button className="w-full" size="lg">
                    Bahşiş Sayfama Git
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex justify-center">
            <CreateTipPage />
          </div>
        )}
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Zap className="mb-2 h-10 w-10 text-orange-500" />
              <CardTitle>Hızlı & Güvenli</CardTitle>
              <CardDescription>
                Stacks Mainnet ile güvenli Bitcoin L2 işlemleri. Sosyal giriş ile kolay başlangıç.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Share2 className="mb-2 h-10 w-10 text-purple-500" />
              <CardTitle>Viral Paylaşım</CardTitle>
              <CardDescription>
                Özel linkinizi X'te paylaşın. QR kod ile kolay bahşiş alın. Topluluk desteği kazanın.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Trophy className="mb-2 h-10 w-10 text-yellow-500" />
              <CardTitle>Liderlik Tablosu</CardTitle>
              <CardDescription>
                En çok bahşiş alan kullanıcıları görün. Toplulukta öne çıkın ve tanının.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-muted-foreground">
          <p>
            🏗️ Stacks Builder Challenge Hafta 3 için geliştirildi
          </p>
          <p className="mt-2">
            Bitcoin L2 (Stacks Mainnet) üzerinde çalışır • Açık kaynak
          </p>
        </div>
      </footer>
    </div>
  );
}
