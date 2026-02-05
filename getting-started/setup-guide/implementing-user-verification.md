---
icon: lock
---

# Implementing User Verification

User verification allows you to securely identify users who access your private widgets or pages. By generating a signed authentication token on your server, you can ensure that only authorized users gain access and can leave feedback in your portals.&#x20;

User verification is a great way to control access while providing a seamless experience for your team and customers.

## Authentication flow

```mermaid
sequenceDiagram
    participant User
    participant App Server
    participant Released API
    participant Released Portal
    User ->> App Server: Accesses the Released portal
    App Server ->> Released API: Requests auth token (ACCOUNT_ID, USER_EMAIL)
    Released API -->> App Server: Returns AUTH_TOKEN
    App Server -->> User: Embeds portal with AUTH_TOKEN
    User ->> Released Portal: Accesses portal with AUTH_TOKEN
    Released Portal ->> Released API: Verifies AUTH_TOKEN
    Released API -->> Released Portal: Authentication success/failure
    Released Portal -->> User: Grants or denies access
```

## Setting up user verification

{% stepper %}
{% step %}
#### Get your shared secret

First, retrieve your shared secret, which is used to securely sign the user data in the payload.

1. Open the global settings by clicking **Settings** in the top-right corner of the Released overview page.
2. Go to the **User verification** section.
3. Copy your **Shared Secret** – you will use this to generate authentication tokens.

{% hint style="warning" %}
**Keep your secret safe!** Never expose it in client-side code or public repositories.
{% endhint %}
{% endstep %}

{% step %}
#### Generate an authentication token on your server

Next, generate an encrypted `AUTH_TOKEN` on your server to securely identify the user.

Send a **POST** request to the Released token API with your `ACCOUNT_ID` and the `CURRENT_USER_EMAIL`. The API responds with an `AUTH_TOKEN` for that user.

Include this token whenever you embed or load your Released portal. Tokens are valid for seven days; after that, you must generate a new token.

The `CURRENT_USER_ID` will be used to identify the user in Released. Make sure that this is a unique identifier for each user in your system. User profiles in Released will use this identifier to match users.

**Profile information**

You can provide optional profile information in the request body to customize the user profile in Released.

```
{
  "account_id": "ACCOUNT_ID",
  "user_id": "CURRENT_USER_ID",
  "user_email": "CURRENT_USER_EMAIL",
  "profile": {
    "name": "The display name",
    "avatar_url": "https://example.com/avatar.png"
  }
}
```

**Request body requirements**

* `user_id` must be unique for each user in your system. The ID cannot be empty but cannot exceed 255 characters. It must match the following regular expression: `^[a-zA-Z0-9:_-]{1,255}$`.
* `user_email` must be the email address of the user.
* (optional) `profile.name` must be a string with a maximum length of 200 characters if the field is provided.
* (optional) `profile.avatar_url` must be a valid URL if the field is provided.

\
**Example request (Node.js)**

```javascript
const response = await fetch("https://accounts.releasedhub.com/auth/api/impersonation/token", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer SHARED_SECRET" // Your shared secret
  },
  body: JSON.stringify({
    account_id: "ACCOUNT_ID", // Your Released Account ID 
    user_id: "CURRENT_USER_ID", // ID of the current authenticated user
    user_email: "CURRENT_USER_EMAIL" // Email of the current authenticated user 
    profile: {
      name: "The display name", // The display name of the user
      avatar_url: "https://example.com/avatar.png" // The avatar URL of a user profile picture
    }
  }),
});

const json = await response.json();
console.log(json);
```

You can find the `SHARED_SECRET` and `ACCOUNT_ID` values in the **User verification** settings in Released. The `CURRENT_USER_EMAIL` value should be filled in dynamically using the details of the authenticated user in your app or site.
{% endstep %}

{% step %}
#### Pass the authentication token with the embed tag

Once you’ve generated the token, include it when embedding your portal. It’s valid for 2 minutes and is exchanged for a 7‑day session.&#x20;

```html
<released-page auth-token="AUTH_TOKEN"></released-page>
```
{% endstep %}
{% endstepper %}

## Rotating your shared secret

If you need to rotate your shared secret:

1. Generate a new secret in the **User verification** section.
2. Update your server to use the new secret when generating tokens.
3. Ensure all embeds and requests are updated to use tokens generated with the new secret.

## Demo

Use [this demo](../../resources/how-tos/implement-user-verification.md) to learn how to implement user verification through a simple example written in Node.js with an Express server.

## Need help?

If you run into issues, [contact us](https://released.so/support) and we’ll help you get started.
