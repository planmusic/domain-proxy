const fetch = require('node-fetch'); // Node 18 öncesi için gerekli

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Yalnızca POST istekleri destekleniyor.' });
  }

  const { domain } = req.body;
  if (!domain || !domain.includes('.')) {
    return res.status(400).json({ error: 'Lütfen geçerli bir domain gönderin. Örnek: example.com' });
  }

  try {
    const response = await fetch('https://api.name.com/v4/domains:checkAvailability', {
      method: 'POST',
      headers: {
        'Authorization': 'Token token=367bbe8320fc2dfbe8b641427c3dcfc0cf4a69dc',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ domainNames: [domain] })
    });

    const data = await response.json();

    console.log('API Response:', data); // Sunucu loguna bak

    if (!response.ok) {
      return res.status(response.status).json({ error: 'API hatası', details: data });
    }

    if (!data || !data.results || !Array.isArray(data.results)) {
      return res.status(500).json({ error: 'Beklenmeyen yanıt. API döndürülen veri eksik.', raw: data });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error('API çağrısı başarısız:', err);
    return res.status(500).json({ error: 'API çağrısı başarısız.', details: err.message });
  }
};
