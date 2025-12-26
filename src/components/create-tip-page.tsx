'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift } from 'lucide-react';
import { toast } from 'sonner';
import { userSession } from './wallet-connect';

export function CreateTipPage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    if (!userSession.isUserSignedIn()) {
      toast.error('Lütfen önce cüzdanınızı bağlayın');
      return;
    }

    if (!username.trim()) {
      toast.error('Lütfen bir kullanıcı adı girin');
      return;
    }

    // Kullanıcı adı validasyonu
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username)) {
      toast.error('Kullanıcı adı 3-20 karakter olmalı (harf, rakam, - ve _ kullanabilirsiniz)');
      return;
    }

    setLoading(true);
    try {
      // LocalStorage'a kullanıcı adını kaydet
      const userData = userSession.loadUserData();
      const address = userData.profile.stxAddress.mainnet;
      localStorage.setItem(`tipjar_username_${address}`, username);
      
      toast.success('Bahşiş sayfanız oluşturuldu!');
      router.push(`/tip/${username}`);
    } catch (error) {
      console.error('Error creating tip page:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-6 w-6" />
          Bahşiş Sayfanızı Oluşturun
        </CardTitle>
        <CardDescription>
          Size özel bir bahşiş linki oluşturun ve X'te paylaşın
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Kullanıcı Adı</Label>
          <Input
            id="username"
            placeholder="kullaniciadi"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value.toLowerCase())}
            maxLength={20}
          />
          <p className="text-xs text-muted-foreground">
            Linkiniz: /tip/{username || 'kullaniciadi'}
          </p>
        </div>
        <Button 
          onClick={handleCreate} 
          className="w-full" 
          size="lg"
          disabled={loading}
        >
          {loading ? 'Oluşturuluyor...' : 'Bahşiş Sayfamı Oluştur'}
        </Button>
      </CardContent>
    </Card>
  );
}
