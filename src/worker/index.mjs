export default {
  async fetch(request) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',   // allow all origins (or Pages URL)
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === 'POST') {
      let data;
      try {
        data = await request.json();
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { message } = data;

      const body = {
        model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
        messages: [
          { role: 'system', content: "You are Devil's Advocate. Always argue the opposite of the user's point. If there are no more logical arguments against the user, the user has won" },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 300
      };

      // Call the Workers AI endpoint
      const res = await fetch('https://api.cloudflare.com/client/v4/worker-ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const aiResponse = await res.json();

      return new Response(JSON.stringify(aiResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // GET fallback
    return new Response("Devil's Advocate Worker", { headers: corsHeaders });
  }
};
