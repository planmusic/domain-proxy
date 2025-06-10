export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Preflight isteğine cevap ver
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Yalnızca POST istekleri destekleniyor.' });
  }

  const { domain } = req.body;

  if (!domain) {
    return res.status(400).json({ error: 'Lütfen domain gönderin.' });
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
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'API çağrısı başarısız.', details: err.message });
  }
}
