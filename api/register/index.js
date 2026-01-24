const crypto = require('crypto');
const { CosmosClient } = require("@azure/cosmos");

// Make crypto globally available
if (typeof global.crypto === 'undefined') {
  global.crypto = crypto;
}

module.exports = async function (context, req) {
  context.log("Function called");
  
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
    context.log("Request body:", JSON.stringify(req.body));
    
    // Basic validation
    if (!req.body || !req.body.email) {
      context.log("Validation failed - missing email");
      context.res = {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: { error: "Invalid request body - email required" }
      };
      return;
    }

    // Create Cosmos client
    const endpoint = process.env.COSMOS_ENDPOINT;
    const key = process.env.COSMOS_KEY;
    
    if (!endpoint || !key) {
      throw new Error("Cosmos DB credentials not configured");
    }

    context.log("Creating Cosmos client...");
    const client = new CosmosClient({ endpoint, key });

    context.log("Accessing database and container...");
    const database = client.database(process.env.COSMOS_DATABASE || "PTOEvents");
    const container = database.container(process.env.COSMOS_CONTAINER || "registrations");

    const item = {
      id: `registration-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };

    context.log("Creating item in Cosmos DB...");
    const result = await container.items.create(item);
    context.log("Item created successfully:", result.resource.id);

    context.res = {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: { success: true, id: result.resource.id }
    };

  } catch (error) {
    context.log.error("ERROR:", error.message);
    context.log.error("Error stack:", error.stack);

    context.res = {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: { 
        error: "Server error", 
        details: error.message,
        code: error.code
      }
    };
  }
};