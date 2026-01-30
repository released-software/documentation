---
description: >-
  This guide demonstrates how to implement user verification end-to-end using a
  simply Node.js Express server.
---

# Implement User Verification

User verification ensures that only authorized users can access your private roadmaps or widgets. Because this process involves sensitive credentials (your Shared Secret), the authentication token must be generated on your server, never in the browser.

This guide provides a complete, minimal working example using Node.js. You can use this to understand the flow before integrating it into your main application.

### Prerequisites

Before running the example, ensure you have the following:

1. Node.js installed (v18 or newer recommended).
2. Your Released credentials (found in Settings → User Verification):
   * `ACCOUNT_ID`
   * `SHARED_SECRET`
3. The Channel ID for the portal you want to embed [finding-the-channel-id.md](finding-the-channel-id.md "mention")
   * `CHANNEL_ID`

***

### 1. Set up the project

Open your terminal and run the following commands to create a folder and install the necessary web server framework (`express`).

```bash
mkdir released-auth-demo
cd released-auth-demo
npm init -y
npm install express
```

### 2. Create the server file

Create a file named `server.js` and paste in the code below.

{% hint style="danger" %}
### Security Warning

This example includes your `SHARED_SECRET` for demonstration purposes. In a production environment, use Environment Variables (e.g., `.env` files) to keep secrets out of your source code.
{% endhint %}

```javascript
const express = require('express');
const app = express();
const port = 3000;

// --- CONFIGURATION ---
// TODO: Replace with your actual values from Released Settings
const CONFIG = {
  SHARED_SECRET: 'YOUR_SHARED_SECRET', 
  ACCOUNT_ID: 'YOUR_ACCOUNT_ID',
  CHANNEL_ID: 'YOUR_CHANNEL_ID'
};

// --- MOCK USER DATA ---
// In your real app, this comes from your database or session
const currentUser = {
  id: "user_12345", 
  email: "john.doe@example.com", 
  name: "John Doe",
  avatar: "https://ui-avatars.com/api/?name=John+Doe"
};

// --- THE ROUTE ---
app.get('/', async (req, res) => {
  try {
    // 1. Generate the Auth Token server-side
    // We send the current user's details to Released to get a temporary token
    const response = await fetch("https://accounts.releasedhub.com/auth/api/impersonation/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CONFIG.SHARED_SECRET}`
      },
      body: JSON.stringify({
        account_id: CONFIG.ACCOUNT_ID,
        user_id: currentUser.id,
        user_email: currentUser.email,
        profile: {
          name: currentUser.name,
          avatar_url: currentUser.avatar
        }
      }),
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

    const data = await response.json();
    const token = data; // The short-lived JWT

    // 2. Serve the HTML with the token injected
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Released Verification Example</title>
          <script type="module" src="https://embed.released.so/released-embed.js"></script>
        </head>
        <body style="font-family: sans-serif; padding: 40px;">
          <h1>Hello, ${currentUser.name}</h1>
          <p>This roadmap is authenticated specifically for you.</p>
          <hr />
          
          <released-page 
            channel-id="${CONFIG.CHANNEL_ID}" 
            auth-token="${token}">
          </released-page>
        </body>
      </html>
    `);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating token. Check server console.");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

### 3. Run the server

Start the application in your terminal:

Bash

```
node server.js
```

### 4. Tunneling (Required for HTTPS)

Most browsers restrict embedded widgets or cookies when running on `localhost`. To test this properly, you need a public `https` URL. We recommend using a tool like [ngrok](https://ngrok.com/).

1. Install ngrok (if you haven't already).
2.  Run the tunnel in a new terminal window:

    Bash

    ```
    ngrok http 3000
    ```
3. Copy the Forwarding URL provided by ngrok (e.g., `https://a1b2-c3d4.ngrok-free.dev`).
4. Important: Add this URL to your Allowed Domains in the Released dashboard if you have domain restrictions enabled.
5. Open the URL in your browser to see your authenticated roadmap.

### 5. Whitelist the ngrok domain

Add the ngrok domain to your list of [trusted domains for embedded content](../../product/administration/trusted-domains.md).&#x20;

## Troubleshooting

<details>

<summary>Widget not loading?</summary>

&#x20;Check your browser console. If you see CORS errors, ensure your ngrok URL is added to the "Allowed Domains" list in your Released settings.

</details>

<details>

<summary>Fetch is not defined?</summary>

&#x20;If you are on an older version of Node.js (< v18), upgrade Node or install `node-fetch`.

</details>

<details>

<summary>401 Unauthorized?</summary>

* Double-check that your SHARED\_SECRET was copied correctly and contains no extra spaces.
* Check the html source and ensure the token property in the embed html element was successfully populated.&#x20;

</details>
