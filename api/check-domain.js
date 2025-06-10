export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Sadece POST isteği destekleniyor.' });

  const { domain } = req.body;
  if (!domain) return res.status(400).json({ error: 'Lütfen bir domain belirtin.' });

  try {
    const authString = Buffer.from('planmusic:367bbe8320fc2dfbe8b641427c3dcfc0cf4a69dc').toString('base64');

    const response = await fetch('https://api.name.com/v4/domains:checkAvailability', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domainNames: [domain] }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Hatası:', data);
      return res.status(response.status).json({ error: 'Name.com API hatası', details: data });
    }

    const result = data.results?.[0];

    if (!result) {
      return res.status(500).json({ error: 'API döndürülen veri eksik.' });
    }

    return res.status(200).json({
      domain: result.domainName,
      available: result.available,
    });

  } catch (error) {
    console.error('İç hata:', error);
    return res.status(500).json({ error: 'Sunucu hatası', details: error.message });
  }
}
