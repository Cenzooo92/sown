export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { journalText } = req.body

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are a warm, insightful journaling coach. Analyse these journal entries and return exactly 4 insights as a JSON array. Each insight must have: tag (2-3 word label), title (short, specific, personal), text (2 sentences max, warm and encouraging tone). Return only valid JSON, no markdown, no backticks.

Journal entries:
${journalText}

Return format:
[{"tag":"Pattern spotted","title":"...","text":"..."},...]`
        }]
      })
    })

    const raw = await response.json()

    if (!response.ok) {
      return res.status(500).json({ error: JSON.stringify(raw) })
    }

    if (!raw.content || !raw.content[0]) {
      return res.status(500).json({ error: 'No content returned: ' + JSON.stringify(raw) })
    }

    const text = raw.content[0].text
    const parsed = JSON.parse(text)
    res.status(200).json(parsed)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}