import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a preference
export async function POST(req: Request) {
  const body = await req.json();
  const { title, preferredModel, temperature, active, userId } = body;

  if (!userId) {
    return new Response("User ID is required", { status: 400 });
  }

  try {
    if (active) {
      // Set all existing preferences for the user to inactive
      await prisma.preferences.updateMany({
        where: {
          userId: userId,
          active: true
        },
        data: {
          active: false
        }
      });
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

// GET route to fetch all preferences by a user ID
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const userId = url.searchParams.get("userId");
  const model = url.searchParams.get("model");

  try {
    // Fetch a single preference by ID
    if (id) {
      const preferenceId = parseInt(id, 10);
      if (isNaN(preferenceId)) {
        return new Response("Invalid preference ID", { status: 400 });
      }

      const preference = await prisma.preferences.findUnique({
        where: { id: preferenceId }
      });

      if (!preference) {
        return new Response("Preference not found", { status: 404 });
      }

      return new Response(JSON.stringify(preference), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch all preferences for a given user ID
    else if (userId) {
      const preferences = await prisma.preferences.findMany({
        where: { userId: userId }
      });

      if (!preferences || preferences.length === 0) {
        return new Response("No preferences found for the given user", { status: 404 });
      }

      return new Response(JSON.stringify(preferences), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch all preferences for a given model
    else if (model) {
      const preferences = await prisma.preferences.findMany({
        where: { preferredModel: model }
      });

      if (!preferences || preferences.length === 0) {
        return new Response("No preferences found for the given model", { status: 404 });
      }

      return new Response(JSON.stringify(preferences), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    else {
      return new Response("Query parameter 'id' or 'userId' is required", { status: 400 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response("An unknown error occurred", { status: 500 });
    }
  }
}

// DELETE route to delete a preference by ID
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const idParam = url.searchParams.get("id");

  if (!idParam) {
    return new Response("Preference ID is required", { status: 400 });
  }

  const id = parseInt(idParam, 10);
  if (isNaN(id)) {
    return new Response("Invalid preference ID", { status: 400 });
  }

  try {
    const preference = await prisma.preferences.delete({
      where: {
        id: id
      }
    });

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

// PUT route to update a preference
export async function PUT(req: Request) {
  const body = await req.json();
  const { id, title, preferredModel, temperature, active } = body;

  if (!id) {
    return new Response("Preference ID is required", { status: 400 });
  }

  try {
    const existingPreference = await prisma.preferences.findUnique({ where: { id: id } });
    if (!existingPreference) {
      return new Response("Preference not found", { status: 404 });
    }

    if (active) {
      // Set all other preferences for the user to inactive
      await prisma.preferences.updateMany({
        where: {
          userId: existingPreference.userId,
          id: { not: id },
          active: true
        },
        data: {
          active: false
        }
      });
    }

    const updatedPreference = await prisma.preferences.update({
      where: { id: id },
      data: {
        title: title || existingPreference.title,
        preferredModel: preferredModel || existingPreference.preferredModel,
        temperature: temperature !== undefined ? temperature : existingPreference.temperature,
        active: active !== undefined ? active : existingPreference.active
      }
    });

    return new Response(JSON.stringify(updatedPreference), {
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
