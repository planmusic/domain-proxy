module.exports = async function handler(req, res) {
  // ... same headers and method checks ...

  try {
    const response = await fetch(`https://domainr.p.rapidapi.com/v2/status?domain=${domain}`, {
      headers: {
        'X-RapidAPI-Key': 'your-free-key', // Get from rapidapi.com
        'X-RapidAPI-Host': 'domainr.p.rapidapi.com'
      }
    });
    
    const data = await response.json();
    const status = data.status[0]?.status || 'inactive';
    
    return res.status(200).json({
      domain,
      available: status.includes('inactive'),
      status
    });

  } catch (err) {
    // ... error handling ...
  }
};
