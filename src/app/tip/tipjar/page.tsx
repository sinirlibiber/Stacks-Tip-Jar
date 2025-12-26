'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import QRCode from 'react-qr-code';
import { Gift, Share2, DollarSign, MessageSquare, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { userSession } from '@/components/wallet-connect';
import { shortenAddress } from '@/lib/stacks-utils';
import type { Tip } from '@/lib/stacks-config';

export default function TipPage() {
  const params = useParams();
  const username = params.username as string;
  const [amount, setAmount] = useState('1');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState<Tip[]>([]);
  const [recipientAddress, setRecipientAddress] = useState<string | null>(null);

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    // LocalStorage'dan kullanıcı adresini bul
    const storedData = localStorage.getItem(`tipjar_user_${username}`);
    if (storedData) {
      const data = JSON.parse(storedData);
      setRecipientAddress(data.address);
    }

    // Geçmiş bahşişleri yükle
    const storedTips = localStorage.getItem(`tipjar_tips_${username}`);
    if (storedTips) {
      setTips(JSON.parse(storedTips));
    }
  }, [username]);

  const handleSendTip = async () => {
    if (!userSession.isUserSignedIn()) {
      toast.error('Lütfen önce cüzdanınızı bağlayın');
      return;
    }

    if (!recipientAddress) {
      toast.error('Alıcı adresi bulunamadı');
      return;
    }

    const tipAmount = parseFloat(amount);
    if (isNaN(tipAmount) || tipAmount <= 0) {
      toast.error('Geçerli bir miktar girin');
      return;
    }

    setLoading(true);
    try {
      const userData = userSession.loadUserData();
      const senderAddress = userData.profile.stxAddress.mainnet;

      // Demo için - gerçek Stacks transaction'ı
      // const txId = await sendTip(senderAddress, recipientAddress, tipAmount, message);

      // Demo transaction ID
      const txId = `0x${Math.random().toString(16).substr(2, 64)}`;

      const newTip: Tip = {
        sender: senderAddress,
        recipient: recipientAddress,
        amount: tipAmount,
        message: message,
        timestamp: Date.now(),
        txId: txId,
      };

      const updatedTips = [newTip, ...tips];
      setTips(updatedTips);
      localStorage.setItem(`tipjar_tips_${username}`, JSON.stringify(updatedTips));

      toast.success(`${tipAmount} STX bahşiş gönderildi! 🎉`);
      setAmount('1');
      setMessage('');
    } catch (error) {
      console.error('Error sending tip:', error);
      toast.error('Bahşiş gönderilemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const tweetText = `Bana Stacks blockchain'de bahşiş at! 💰\n\n${pageUrl}\n\n#Stacks #Bitcoin #L2`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank');
  };

  const totalReceived = tips.reduce((sum: number, tip: Tip) => sum + tip.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 p-4 pt-16">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <Card className="border-2 border-orange-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-purple-500">
              <Gift className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl">@{username}</CardTitle>
            <CardDescription className="text-lg">
              Stacks'te bahşiş gönderin
            </CardDescription>
            <div className="mt-4 flex items-center justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <DollarSign className="mr-1 h-4 w-4" />
                {totalReceived.toFixed(2)} STX alındı
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <MessageSquare className="mr-1 h-4 w-4" />
                {tips.length} bahşiş
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Bahşiş Gönder */}
          <Card>
            <CardHeader>
              <CardTitle>Bahşiş Gönder</CardTitle>
              <CardDescription>STX ile destek olun</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Miktar (STX)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                  placeholder="1.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mesaj (İsteğe Bağlı)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                  placeholder="Teşekkürler! 🙏"
                  maxLength={280}
                />
                <p className="text-xs text-muted-foreground">
                  {message.length}/280 karakter
                </p>
              </div>
              <Button 
                onClick={handleSendTip} 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? 'Gönderiliyor...' : `${amount || '0'} STX Gönder`}
              </Button>
            </CardContent>
          </Card>

          {/* QR Kod & Paylaş */}
          <Card>
            <CardHeader>
              <CardTitle>Paylaş</CardTitle>
              <CardDescription>QR kod veya sosyal medya</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center rounded-lg bg-white p-4">
                <QRCode value={pageUrl} size={200} />
              </div>
              <Button 
                onClick={handleShare} 
                className="w-full" 
                variant="outline"
                size="lg"
              >
                <Share2 className="mr-2 h-5 w-5" />
                X'te Paylaş
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Geçmiş Bahşişler */}
        <Card>
          <CardHeader>
            <CardTitle>Son Bahşişler</CardTitle>
            <CardDescription>
              {tips.length > 0 ? 'Gelen destekler' : 'Henüz bahşiş alınmadı'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tips.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Gift className="mx-auto mb-4 h-12 w-12 opacity-20" />
                <p>İlk bahşişi bekliyor...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tips.slice(0, 10).map((tip: Tip, index: number) => (
                  <div key={tip.txId}>
                    {index > 0 && <Separator />}
                    <div className="flex items-start justify-between py-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {shortenAddress(tip.sender)}
                          </span>
                          <Badge variant="secondary">
                            {tip.amount.toFixed(2)} STX
                          </Badge>
                        </div>
                        {tip.message && (
                          <p className="text-sm text-muted-foreground">
                            "{tip.message}"
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(tip.timestamp).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`https://explorer.hiro.so/txid/${tip.txId}?chain=mainnet`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
