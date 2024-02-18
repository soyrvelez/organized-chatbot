import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET route for various user queries
export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("id");
  const filter = url.searchParams.get("filter");

  try {
    // Fetch a single user by ID
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { preferences: true }
      });

      if (!user) {
        return new Response("User not found", { status: 404 });
      }

      return new Response(JSON.stringify(user), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch all users or apply specific filters
    let users;
    if (filter === "singlePreference") {
      users = await prisma.user.findMany({
        where: { preferences: { some: {} } },
        include: { preferences: true }
      });
    } else if (filter === "multiplePreferences") {
      users = await prisma.user.findMany({
        where: { preferences: { some: {} } },
        include: { preferences: true }
      });

      users = users.filter(user => user.preferences.length > 1);
    } else {
      users = await prisma.user.findMany({
        include: { preferences: true }
      });
    }

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
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

// POST route to create a user
export async function POST(req: Request) {
  const body = await req.json();
  const { id, createdAt, updatedAt } = body;

  if (!id) {
    return new Response("User ID is required", { status: 400 });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        id: id,
        createdAt: createdAt || new Date(),
        updatedAt: updatedAt || new Date()
      }
    });

    return new Response(JSON.stringify(newUser), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
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

// PUT route to update a user


// DELETE route to delete a user
