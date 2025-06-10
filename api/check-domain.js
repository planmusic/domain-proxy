// Free tier: 500 requests/month (no API key needed for testing)
module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { domain } = req.body;
  if (!domain) return res.status(400).json({ error: 'Domain required' });

  try {
    // Free API endpoint
    const response = await fetch(`https://api.whoapi.com/?domain=${encodeURIComponent(domain)}&r=whois&apikey=free`);

    const data = await response.json();
    
    // Standard WHOIS response parsing
    const isAvailable = data.status === 0; // 0 = available, 1 = taken
    
    return res.status(200).json({
      domain,
      available: isAvailable,
      whois: data
    });

  } catch (err) {
    console.error('WHOIS check error:', err);
    return res.status(500).json({ 
      error: 'Domain check failed',
      details: err.message 
    });
  }
};
