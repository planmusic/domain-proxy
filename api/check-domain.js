module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { domain } = req.body;
  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  // Domain format validation
  const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domain)) {
    return res.status(400).json({ error: 'Invalid domain format. Example: example.com' });
  }

  const API_USERNAME = process.env.NAME_API_USERNAME;
  const API_TOKEN = process.env.NAME_API_TOKEN;
  
  if (!API_USERNAME || !API_TOKEN) {
    console.error('API credentials not configured');
    return res.status(500).json({ 
      error: 'Server configuration error',
      details: 'Domain check service is currently unavailable'
    });
  }

  try {
    const response = await fetch('https://api.name.com/v4/domains:checkAvailability', {
      method: 'POST',
      headers: {
        'Authorization': `ApiToken ${API_USERNAME}:${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        domainNames: [domain]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error:', data);
      return res.status(response.status).json({ 
        error: 'Domain check failed',
        details: data.message || 'Unknown error'
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error('Domain check error:', err);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: err.message 
    });
  }
};
