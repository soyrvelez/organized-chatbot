import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();


export const runtime = 'edge'

// View A Preference
// View all preferences associated with users
// View all preferences by model
// Create a preference
export async function POST(req: Request) {
  const body = await req.json();
  const { title, preferredModel, temperature, active, userId } = body;

  if (!userId) {
    return new Response("User ID is required", { status: 400 });
  }

  try {
    let newPreference = await prisma.preferences.create({
      data: {
        title: title || "Default",
        preferredModel: preferredModel || "gpt-3.5-turbo",
        temperature: temperature || 0.7,
        active: active !== undefined ? active : true,
        userId: userId
      }
    });

    return new Response(JSON.stringify(newPreference), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Update preference
// Update preference
