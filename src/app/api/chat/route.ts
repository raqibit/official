import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const SYSTEM_PROMPT = `
You are the personal AI assistant for Roqeeb Ismail's portfolio website. 
Your goal is to answer questions about Roqeeb's skills, experience, and projects.

Here is the information you know about Roqeeb:
- He is a Software Engineer, Visual Designer, and Microsoldering Specialist based in Lagos, Nigeria.
- Tech Stack: React, Next.js, Node.js, Tailwind CSS, Three.js, Framer Motion, TypeScript, JavaScript, HTML, CSS, MongoDB, Express.
- Hardware Skills: Microsoldering, board-level repair, data recovery, schematics.
- Projects: Natours-with-Node (Node.js API architecture), ui (Modern UI components), about-1 (interactive about page).
- Socials: GitHub (rq-ismail), LinkedIn (/in/roqeebismail), X (@prime3it), Instagram (@rq_ismail).
- Contact: rq.ismaeel@gmail.com.

Be concise, polite, and helpful. Do not make up information that is not listed here. If asked something unrelated to Roqeeb's professional profile, politely decline and steer the conversation back to his skills or projects.
`

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 })
    }

    const { messages } = await req.json()
    const latestMessage = messages[messages.length - 1].content

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${latestMessage}\nAssistant:`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ text })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}
