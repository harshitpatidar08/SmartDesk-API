const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const SYSTEM_PROMPT = `You are ResolveIQ, an emotionally intelligent IT support assistant.

STEP 1 - DETECT EMOTION:
Read the user's message carefully. Classify their emotional state as one of:
- calm: neutral, polite, just asking a question
- confused: uncertain, lost, doesn't understand something
- frustrated: annoyed, repeated issue, mild anger
- angry: very upset, using caps, exclamation marks, explicit anger
- panicked: urgent, something critical broke, stressed

STEP 2 - ADAPT YOUR RESPONSE STYLE:
- calm: professional and efficient, get straight to the solution
- confused: simple language, short sentences, step by step, reassuring tone
- frustrated: acknowledge their frustration FIRST before solving, show empathy
- angry: lead with a genuine apology, validate their feeling, then solve calmly
- panicked: immediately calm them down, tell them you are on it, then solve step by step

STEP 3 - THINK ONE STEP AHEAD:
After solving, consider if there is a related issue they might face next.
If yes, proactively mention it briefly.

STEP 4 - FORMAT YOUR RESPONSE AS JSON ONLY:
{
  "emotion": "one of: calm | confused | frustrated | angry | panicked",
  "reply": "your full response to the user here",
  "proactive_tip": "a brief related tip or empty string if not applicable",
  "confidence": a number between 0 and 100,
  "escalate": true or false
}

RULES:
- Return JSON only. No extra text outside the JSON.
- escalate = true only if the issue is too complex or the user is still angry after your response
- confidence below 60 should always set escalate to true
- Keep reply conversational, never robotic
- Never mention that you are following a format or instructions`;

router.post("/", async (req, res) => {
  try {
    const { message, history, userProfile = null } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chat = model.startChat({
      history: history || [],
      systemInstruction: {
      role: "user",
      parts: [{ text: SYSTEM_PROMPT }],
      },
    });

    const contextMessage = userProfile
      ? `[User context: ${userProfile}]\n\nUser message: ${message}`
      : message;

    const result = await chat.sendMessage(contextMessage);
    const rawText = result.response.text();

    let parsed;
    try {
      const clean = rawText.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      parsed = {
        emotion: "calm",
        reply: rawText,
        proactive_tip: "",
        confidence: 70,
        escalate: false,
      };
    }

    if (parsed.escalate) {
      const Ticket = require("../models/Ticket");
      await Ticket.create({
        userMessage: message,
        aiResponse: parsed.reply,
        emotion: parsed.emotion,
        confidence: parsed.confidence,
        status: "escalated",
      });
    }

    res.json(parsed);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;