import { kv } from '@vercel/kv'

export const runtime = 'edge'

// Define a type for your messages
interface Message {
  content: string;
  role: 'user' | 'system';
}

// Define a type for your chat data
interface ChatData {
  messages: Message[];
}

// GET route to fetch messages for a given chat ID and optional role
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

    // Parse the chat data string into an object
    const chatData: ChatData = JSON.parse(chatDataString as unknown as string);
    let messages = chatData.messages;

    // Filter messages by role if role parameter is provided
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
