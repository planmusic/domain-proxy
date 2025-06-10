module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { domain } = req.body;
  if (!domain) return res.status(400).json({ error: 'Domain required' });

  // Validate domain format
  if (!/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(domain)) {
    return res.status(400).json({ error: 'Invalid domain format' });
  }

  const API_USERNAME = process.env.NAME_API_USERNAME;
  const API_TOKEN = process.env.NAME_API_TOKEN;
  
  if (!API_USERNAME || !API_TOKEN) {
    return res.status(500).json({ 
      error: 'Server misconfigured',
      details: 'API credentials missing' 
    });
  }

  try {
    // IMPORTANT: Use this exact auth format
    const auth = Buffer.from(`${API_USERNAME}:${API_TOKEN}`).toString('base64');
    
    const response = await fetch('https://api.name.com/v4/domains:checkAvailability', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,  // Note: Basic auth, not ApiToken
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        domainNames: [domain.toLowerCase()] // API is case-sensitive
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Name.com API Error:', { 
        status: response.status,
        error: data 
      });
      return res.status(400).json({ 
        error: 'Domain check failed',
        details: data.message || 'API error' 
      });
    }

    return res.status(200).json(data.results[0] || { available: false });

  } catch (err) {
    console.error('Server Error:', err);
    return res.status(500).json({ 
      error: 'Internal error',
      details: err.message 
    });
  }
};
