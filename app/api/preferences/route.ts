import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a preference
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, preferredModel, temperature, active, userId } = body;

    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      return new Response("User not found", { status: 404 });
    }

    const newPreference = await prisma.preferences.create({
      data: {
        title: title || "Default",
        preferredModel: preferredModel || "gpt-3.5-turbo",
        temperature: temperature !== undefined ? temperature : 0.7,
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
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      return new Response("An unknown error occurred", {
        status: 500
      });
    }
  }
}

//Find a single preference by ID
export async function GET(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    // Validate that the ID is provided and is a number
    if (id === undefined || typeof id !== 'number') {
      return new Response("Valid preference ID is required", { status: 400 });
    }

    const preference = await prisma.preferences.findUnique({
      where: {
        id: id
      }
    });

    if (!preference) {
      return new Response("Preference not found", { status: 404 });
    }

    return new Response(JSON.stringify(preference), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      return new Response("An unknown error occurred", {
        status: 500
      });
    }
  }
}
