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
    // Directly use the chat data as an object
    const chatData = await kv.hgetall(`chat:${chatId}`);
    if (!chatData || Object.keys(chatData).length === 0) {
      return new Response("Chat not found", { status: 404 });
    }

    // Extract messages directly from the chatData object
    const messages: Message[] = chatData.messages;

    // Filter messages by role if the role parameter is provided
    if (role && ['user', 'assistant'].includes(role)) {
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
