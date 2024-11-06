// pages/index.tsx
import { useEffect, useState } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk';

interface InitData {
  message: string;
  authDate: string;
}

export default function HomePage() {
  const [initData, setInitData] = useState<InitData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const { initDataRaw } = retrieveLaunchParams();
        console.log('initDataRaw:', initDataRaw); // Log data yang diambil
  
        // Kirim permintaan POST ke API dengan header Authorization
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            Authorization: `tma ${initDataRaw}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Unauthorized');
        }
  
        const data = await response.json();
        setInitData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      }
    };
  
    fetchInitData();
  }, []);
  

  if (error) return <p>Error: {error}</p>;
  if (!initData) return <p>Loading...</p>;

  return (
    <div>
      <h1>{initData.message}</h1>
      <p>Authorization Date: {initData.authDate}</p>
    </div>
  );
}
