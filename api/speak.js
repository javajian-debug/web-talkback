export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

    try {
        const { text } = req.body;
        const API_KEY = process.env.ELEVENLABS_API_KEY;
        const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; 

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
            method: 'POST',
            headers: {
                'xi-api-key': API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_multilingual_v2",
            }),
        });

        if (!response.ok) throw new Error('ElevenLabs request failed');

        const arrayBuffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(arrayBuffer));

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: 'Server Error' });
    }
}
