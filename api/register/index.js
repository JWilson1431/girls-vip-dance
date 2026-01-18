const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
  try {
    // Basic validation
    if (!req.body || !req.body.email) {
      context.res = {
        status: 400,
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
      body: { success: true }
    };

  } catch (error) {
    context.log.error("Register function error:", error);

    context.res = {
      status: 500,
      body: { error: "Server error" }
    };
  }
};
