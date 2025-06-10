module.exports = async function handler(req, res) {
  // ... same headers and method checks as above ...

  try {
    const response = await fetch(`https://jsonwhois.com/api/v1/whois?domain=${encodeURIComponent(domain)}`);
    const data = await response.json();
    
    return res.status(200).json({
      domain,
      available: data.registered === false,
      expires: data.expires_at,
      registrar: data.registrar
    });

  } catch (err) {
    // ... error handling ...
  }
};
