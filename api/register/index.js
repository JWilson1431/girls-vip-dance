const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    context.res = {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    };
    return;
  }

  try {
    // Basic validation
    if (!req.body || !req.body.email) {
      context.res = {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: { error: "Invalid request body" }
      };
      return;
    }

    // Create Cosmos client using environment variables
    const client = new CosmosClient({
      endpoint: process.env.COSMOS_ENDPOINT,
      key: process.env.COSMOS_KEY
    });

    const container = client
      .database(process.env.COSMOS_DATABASE)
      .container(process.env.COSMOS_CONTAINER);

    const item = {
      id: `registration-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };

    await container.items.create(item);

    context.res = {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: { success: true }
    };

  } catch (error) {
    context.log.error("Register function error:", error);

    context.res = {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: { error: "Server error", details: error.message }
    };
  }
};