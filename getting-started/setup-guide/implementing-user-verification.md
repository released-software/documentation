---
hidden: true
---

# Implementing User Verification

## Overview

User verification allows you to securely identify users who access your Released portal, widgets, or private pages. By generating an encrypted authentication token on your server, you can ensure that only authorized users gain access.

User verification is a great way to control access while providing a seamless experience for your team and customers.

## Setting up user verification

### 1. Get your shared secret

Firstly, get your shared secret to securely encrypt the user data in the payload.

1. Access the global settings via the **Settings** button in the top right of the Released overview page.&#x20;
2. Go to the **User verification** section.&#x20;
3. Copy your **Shared Secret** – this will be used to generate authentication tokens.

{% hint style="warning" %}
**Keep your secret safe!** Never expose it in client-side code or public repositories.
{% endhint %}

### 2. Generate an authentication token on your server

Now you can generate an encrypted `AUTH_TOKEN` to securely identify the user.

Send a **POST** request to the Released token API with your `ACCOUNT_ID` and the `CURRENT_USER_EMAIL`. The API will respond with the `AUTH_TOKEN` for that user.

Include this token in every request to authenticate users accessing your Released portal.

**Example Request (Node.js)**

```javascript
const response = await fetch("https://accounts.releasedhub.com/auth/api/token", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer SHARED_SECRET" // Your shared secret
  },
  body: JSON.stringify({
    account_id: "ACCOUNT_ID", // Your Released Account ID 
    user_email: "CURRENT_USER_EMAIL" // Email of the current authenticated user 
  }),
});

const json = await response.json();
console.log(json);
```

You can find the `SHARED_SECRET` and `ACCOUNT_ID` values in the **User verification** settings in Released. The `CURRENT_USER_EMAIL` value should be filled in dynamically with the details of the authenticated user in your app or site.&#x20;

### 3. Pass the authentication token to released

Once you’ve generated the token, include it when embedding your portal:

```html
<released-page auth-token="AUTH_TOKEN"></released-page>
```

{% hint style="warning" %}
When a portal has restricted access, the `AUTH_TOKEN` must be included in the embed code for content to appear.&#x20;
{% endhint %}

## Rotating your shared secret

If you need to rotate your shared secret:

1. Generate a new secret from the **User verification** section.
2. Update your server to use the new secret when generating tokens.
3. Ensure all requests are updated with new tokens.

### Need Help? <a href="#need-help" id="need-help"></a>

If you run into issues, [contact us](https://released.so/support) and we’ll help you get started.
