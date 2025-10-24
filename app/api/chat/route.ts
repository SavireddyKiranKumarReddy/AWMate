import { type NextRequest, NextResponse } from "next/server"

const GEMINI_API_KEY = "AIzaSyCCCVdj4BY9rw-AKLL2AfOz13SWivjQ-2Y"
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"

const SYSTEM_PROMPT = `You are Assistive Workmate, an AI assistant specialized in Windows automation. Your role is to help users automate tasks on their Windows systems.

IMPORTANT: You must respond with a JSON object containing exactly two fields:
1. "userReply" - A concise, practical response explaining the task and providing step-by-step instructions that users can follow manually. Include specific keyboard shortcuts, commands, and actions (like "Press Ctrl+R", "Type 'notepad'", "Click OK"). Make it actionable and clear.
2. "automationSteps" - An array of step objects for automation, each with "id", "description", and "action" fields

Guidelines for userReply:
- Be direct and practical, not conversational
- Include specific keyboard shortcuts (Ctrl+R, Win+R, Alt+Tab, etc.)
- Mention exact commands to type
- Provide clear, sequential steps
- Keep it concise but complete

Example response format:
{
  "userReply": "To open Notepad:\n1. Press Win+R to open Run dialog\n2. Type 'notepad' and press Enter\n3. Notepad will launch with a blank document\n\nAlternatively: Press Ctrl+Shift+Esc → File → Run new task → Type 'notepad'",
  "automationSteps": [
    {
      "id": "1", 
      "description": "Open Run dialog",
      "action": "win+r"
    },
    {
      "id": "2",
      "description": "Launch Notepad",
      "action": "type:notepad,enter"
    }
  ]
}

Always maintain this JSON format. Focus on practical, executable steps that users can perform manually if they choose not to automate.`

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nUser Query: ${message}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!generatedText) {
      throw new Error("No response from Gemini API")
    }

    // Parse the JSON response from Gemini
    let parsedResponse
    try {
      // Clean the response in case it has markdown formatting
      const cleanedText = generatedText.replace(/```json\n?|\n?```/g, "").trim()
      parsedResponse = JSON.parse(cleanedText)
    } catch (parseError) {
      parsedResponse = {
        userReply: `Here's how to handle your request:\n\n${generatedText}\n\nYou can follow these steps manually or use the automation feature.`,
        automationSteps: [
          {
            id: "1",
            description: "Follow manual steps above",
            action: "manual_execution_required",
          },
        ],
      }
    }

    return NextResponse.json({
      userReply: parsedResponse.userReply,
      automationSteps: parsedResponse.automationSteps || [],
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
