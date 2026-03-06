export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: { message: 'GEMINI_API_KEY not set. Go to Vercel → Settings → Environment Variables and add it.' }
    });
  }

  try {
    const { messages, system } = req.body;

    // Convert Anthropic-style messages → Gemini format
    const geminiContents = [];

    for (const msg of messages) {
      const role = msg.role === 'assistant' ? 'model' : 'user';
      const parts = [];

      const blocks = Array.isArray(msg.content)
        ? msg.content
        : [{ type: 'text', text: msg.content }];

      for (const block of blocks) {
        if (block.type === 'text') {
          parts.push({ text: block.text });
        } else if (block.type === 'image') {
          parts.push({
            inlineData: {
              mimeType: block.source.media_type,
              data: block.source.data,
            }
          });
        } else if (block.type === 'document') {
          parts.push({
            inlineData: {
              mimeType: 'application/pdf',
              data: block.source.data,
            }
          });
        }
      }

      if (parts.length > 0) {
        geminiContents.push({ role, parts });
      }
    }

    // Prepend system prompt as opening exchange
    if (system) {
      geminiContents.unshift(
        { role: 'user', parts: [{ text: `System: ${system}` }] },
        { role: 'model', parts: [{ text: 'Understood.' }] }
      );
    }

    const model = 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: geminiContents,
        generationConfig: { maxOutputTokens: 4096, temperature: 0.7 }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: { message: data?.error?.message || `Gemini API error ${response.status}` }
      });
    }

    // Convert Gemini response → Anthropic-style so frontend works unchanged
    const text = data?.candidates?.[0]?.content?.parts
      ?.filter(p => p.text)?.map(p => p.text)?.join('') || 'No response generated.';

    return res.status(200).json({
      content: [{ type: 'text', text }],
      model,
      role: 'assistant',
      stop_reason: 'end_turn',
    });

  } catch (err) {
    return res.status(500).json({ error: { message: err.message || 'Proxy error' } });
  }
}
