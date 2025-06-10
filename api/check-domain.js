module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST gerekli.' });

  const { domain } = req.body;
  if (!domain) return res.status(400).json({ error: 'Domain gerekli.' });

  try {
    const apiKey = '<YOUR_WHOISXML_API_KEY>';
    const resp = await fetch(`https://domain-availability.whoisxmlapi.com/api/v1?apiKey=${apiKey}&domainName=${domain}`);
    const data = await resp.json();

    if (!resp.ok) {
      console.error('API Hatası:', data);
      return res.status(resp.status).json({ error: 'API hatası', details: data });
    }

    // WhoisXML'in JSON formatına göre domain durumu
    const available = data?.DomainInfo?.domainAvailability === 'AVAILABLE';

    return res.status(200).json({ domain, available });

  } catch (err) {
    console.error('Sunucu hatası:', err);
    return res.status(500).json({ error: 'Sunucu hatası', details: err.message });
  }
};
