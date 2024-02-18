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

// GET route to fetch a single preference by ID
export async function getPreferenceById(req: Request) {
  const url = new URL(req.url);
  const idParam = url.searchParams.get("id");

  // Validate that the ID parameter is provided
  if (!idParam) {
    return new Response("Preference ID is required", { status: 400 });
  }

  // Parse the ID to an integer
  const id = parseInt(idParam, 10);
  if (isNaN(id)) {
    return new Response("Invalid preference ID", { status: 400 });
  }

  try {
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

// GET route to fetch all preferences by a user ID
export async function getPreferencesByUserId(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  // Validate that the user ID parameter is provided
  if (!userId) {
    return new Response("User ID is required", { status: 400 });
  }

  try {
    const preferences = await prisma.preferences.findMany({
      where: {
        userId: userId
      }
    });

    if (!preferences || preferences.length === 0) {
      return new Response("No preferences found for the given user", { status: 404 });
    }

    return new Response(JSON.stringify(preferences), {
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
