// pages/api/auth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { validate, parse } from '@telegram-apps/init-data-node';

// Ganti dengan token bot Telegram yang valid
const TOKEN = '8194480289:AAHz4CF88j7LCmX0WYEoSB2sYrgizoGLizc';

type InitDataParsed = {
  user_id: string;
  auth_date: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
  };
};

function validateAndParseInitData(authData: string): InitDataParsed | null {
  try {
    // Validasi data yang diterima
    validate(authData, TOKEN, { expiresIn: 3600 });

    // Parsing data yang valid
    return parse(authData) as unknown as InitDataParsed;
  } catch (error) {
    console.error('Error validating and parsing init data:', error);
    return null;
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization || '';
  console.log('Authorization Header:', authHeader); // Debugging

  const [authType, authData = ''] = authHeader.split(' ');

  if (authType === 'tma') {
    console.log('Auth Data:', authData); // Debugging

    const initData = validateAndParseInitData(authData);

    if (initData) {
      console.log('Parsed Init Data:', initData); // Debugging

      // Validasi auth_date
      const formattedDate = new Date(initData.auth_date * 1000); // Ubah ke milidetik
      if (isNaN(formattedDate.getTime())) {
        console.log('Invalid Date');
        return res.status(400).json({ error: 'Invalid auth_date' });
      }

      const formattedDateString = formattedDate.toLocaleString();

      // Mengirimkan respons dengan data pengguna dan tanggal
      return res.status(200).json({
        message: `Welcome, User ID: ${initData.user.id}`,
        authDate: formattedDateString, // Tanggal yang sudah diformat
      });
    } else {
      return res.status(401).json({ error: 'Unauthorized - Invalid init data' });
    }
  }

  res.status(401).json({ error: 'Unauthorized - Invalid authorization type' });
}
