import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY! });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const summary = searchParams.get("summary");

  if (!summary) {
    return NextResponse.json({ message: "No summary provided" }, { status: 400 });
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a official Notes maker of conversation between prime minister modi and use create flash cards" },
      {
          role: "user",
          content:`Create flashcards from this text: ${summary}`,
      },
  ],
  });

  const content = completion.choices[0].message.content || "";

  return NextResponse.json({ message: content });
}
