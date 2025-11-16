export default {
async fetch(request) {
if (request.method === 'POST') {
const { message } = await request.json();
const body = {
model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
messages: [
{ role: 'system', content: "You are Devil's Advocate. Always argue the opposite of the user's point. If there are no more logical arguments against the user, the user has won" },
{ role: 'user', content: message }
],
temperature: 0.7,
max_tokens: 300
};


const res = await fetch('https://api.cloudflare.com/client/v4/worker-ai/generate', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(body)
});
const aiResponse = await res.json();
return new Response(JSON.stringify(aiResponse), { headers: { 'Content-Type': 'application/json' } });
}


return new Response('Devil\'s Advocate Worker');
}
};