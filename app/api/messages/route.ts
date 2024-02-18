import { kv } from '@vercel/kv'

export const runtime = 'edge'

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const chatId = url.searchParams.get("chatId");
  const role = url.searchParams.get("role");

  if (!chatId) {
    return new Response("Chat ID is required", { status: 400 });
  }

  try {
    const chatDataString = await kv.hgetall(`chat:${chatId}`);
    if (!chatDataString || Object.keys(chatDataString).length === 0) {
      return new Response("Chat not found", { status: 404 });
    }

    console.log("Fetched chat data string:", chatDataString);

    let chatData: { messages: Message[] };
    try {
      chatData = JSON.parse(chatDataString as unknown as string);
    } catch (parseError) {
      console.error("Error parsing chat data:", parseError, "Data:", chatDataString);
      return new Response("Error parsing chat data", { status: 500 });
    }

    let messages = chatData.messages;

    if (role) {
      messages = messages.filter(message => message.role === role);
    }

    return new Response(JSON.stringify(messages), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response("An unknown error occurred", {
        status: 500
      });
    }
  }
}
