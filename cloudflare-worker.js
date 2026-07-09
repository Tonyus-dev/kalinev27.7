export default {
  async fetch(request, env, ctx) {
    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    
    try {
      if (url.pathname === "/chat" && request.method === "POST") {
        return await handleChat(request, env, corsHeaders);
      } else if (url.pathname === "/coder" && request.method === "POST") {
        return await handleCoder(request, env, corsHeaders);
      } else if (url.pathname === "/tts" && request.method === "POST") {
        return await handleTTS(request, env, corsHeaders);
      } else if (url.pathname === "/stt" && request.method === "POST") {
        return await handleSTT(request, env, corsHeaders);
      }
      
      return new Response("Not found", { status: 404, headers: corsHeaders });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }
  }
};

async function handleChat(request, env, corsHeaders) {
  const body = await request.json();
  const messages = body.messages || [];
  const files = body.files || [];
  
  // Bloquear txt e md para evitar prompt insertion
  for (const file of files) {
    if (file.mimeType.includes('text/plain') || file.mimeType.includes('markdown') || file.name?.endsWith('.txt') || file.name?.endsWith('.md')) {
      return new Response(JSON.stringify({ error: "Arquivos .txt e .md bloqueados por segurança." }), { status: 403, headers: corsHeaders });
    }
  }

  // Gemini 2.5 Flash
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;
  
  // Prepare payload based on Google Gen AI structure
  const response = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: messages
    })
  });
  
  const data = await response.json();
  return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

async function handleCoder(request, env, corsHeaders) {
  const body = await request.json();
  const messages = body.messages || [];

  // Gemini 2.5 Pro
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${env.GEMINI_API_KEY}`;
  
  const response = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: messages
    })
  });
  
  const data = await response.json();
  return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

async function handleTTS(request, env, corsHeaders) {
  const body = await request.json();
  const text = body.text;
  
  // Usar API de TTS (Flash 3.1 TTS ou genérica configurada no worker)
  // Como exemplo, caso seja uma chamada para a API Google Cloud TTS
  const ttsUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${env.GOOGLE_TTS_API_KEY || env.GEMINI_API_KEY}`;
  
  const response = await fetch(ttsUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text: text },
      voice: { languageCode: "pt-BR", name: "pt-BR-Neural2-A" },
      audioConfig: { audioEncoding: "MP3" }
    })
  });
  
  const data = await response.json();
  return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

async function handleSTT(request, env, corsHeaders) {
  const body = await request.json();
  // OpenRouter para STT/Transcrição (exemplo usando whisper via openrouter se disponível, ou proxy openrouter)
  const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";
  
  const response = await fetch(openRouterUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/whisper-1", // Ou o modelo de STT configurado no OpenRouter
      messages: body.messages
    })
  });
  
  const data = await response.json();
  return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
