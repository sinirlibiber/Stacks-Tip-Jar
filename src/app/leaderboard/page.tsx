'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, Gift, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { TipJarUser } from '@/lib/stacks-config';

export default function LeaderboardPage() {
  const [users, setUsers] = useState<TipJarUser[]>([]);

  useEffect(() => {
    // LocalStorage'dan tüm kullanıcıları topla
    const allUsers: TipJarUser[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('tipjar_tips_')) {
        const username = key.replace('tipjar_tips_', '');
        const tipsData = localStorage.getItem(key);
        
        if (tipsData) {
          const tips = JSON.parse(tipsData);
          const totalReceived = tips.reduce((sum: number, tip: any) => sum + tip.amount, 0);
          
          const userDataKey = `tipjar_user_${username}`;
          const userData = localStorage.getItem(userDataKey);
          
          if (userData) {
            const user = JSON.parse(userData);
            allUsers.push({
              address: user.address,
              username: username,
              totalReceived: totalReceived,
              totalTips: tips.length,
            });
          }
        }
      }
    }

    // En çok bahşiş alana göre sırala
    allUsers.sort((a: TipJarUser, b: TipJarUser) => b.totalReceived - a.totalReceived);
    setUsers(allUsers);
  }, []);

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 p-4 pt-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Liderlik Tablosu</h1>
            <p className="text-muted-foreground">
              En çok bahşiş alan kullanıcılar
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Toplam Kullanıcı</CardDescription>
              <CardTitle className="text-3xl">{users.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-4 w-4" />
                Aktif bahşiş sayfaları
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Toplam Bahşiş</CardDescription>
              <CardTitle className="text-3xl">
                {users.reduce((sum: number, u: TipJarUser) => sum + u.totalTips, 0)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                <Gift className="mr-1 h-4 w-4" />
                Gönderilen işlem sayısı
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Toplam Hacim</CardDescription>
              <CardTitle className="text-3xl">
                {users.reduce((sum: number, u: TipJarUser) => sum + u.totalReceived, 0).toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-4 w-4" />
                STX transfer edildi
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              En Çok Bahşiş Alanlar
            </CardTitle>
            <CardDescription>
              Haftalık liderler (demo veriler)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Trophy className="mx-auto mb-4 h-12 w-12 opacity-20" />
                <p>Henüz bahşiş alınmadı</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user: TipJarUser, index: number) => (
                  <Link 
                    key={user.username} 
                    href={`/tip/${user.username}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center text-2xl">
                          {getRankIcon(index)}
                        </div>
                        <div>
                          <div className="font-semibold">@{user.username}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.totalTips} bahşiş aldı
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        {user.totalReceived.toFixed(2)} STX
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
