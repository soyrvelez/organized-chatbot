import { kv } from '@vercel/kv'

export const runtime = 'edge'

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// GET route to fetch messages for a given chat ID and an optional role
export async function GET(req: Request) {
  const url = new URL(req.url);
  const chatId = url.searchParams.get("chatId");
  const role = url.searchParams.get("role");

  if (!chatId) {
    return new Response("Chat ID is required", { status: 400 });
  }

  try {
    const chatData = await kv.hgetall(`chat:${chatId}`);
    if (!chatData || Object.keys(chatData).length === 0) {
      return new Response("Chat not found", { status: 404 });
    }

    // Assuming chatData is already an object
    const chat: { messages: Message[] } = chatData as unknown as { messages: Message[] };
    const messages = chat.messages;

    // Apply role filter if provided
    const filteredMessages = role ? messages.filter(message => message.role === role) : messages;

    return new Response(JSON.stringify(filteredMessages), {
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
