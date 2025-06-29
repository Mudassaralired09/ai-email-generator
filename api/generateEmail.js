export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST requests allowed" });

  const { prompt, tone = "professional" } = req.body;

  console.log("➡ Prompt Received:", prompt);
  console.log("➡ Tone Received:", tone);
  console.log("➡ Using API Key:", process.env.COHERE_API_KEY ? "YES" : "NO");

  try {
    const response = await fetch("https://api.cohere.ai/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command",
        prompt: `${tone === "friendly" ? "Hi! " : "Hello, "}${prompt}`,
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log("➡ Response from Cohere:", data);

    res.status(200).json(data);
  } catch (err) {
    console.error("➡ Cohere Error:", err);
    res.status(500).json({ error: "Cohere API call failed", details: err.message });
  }
}
