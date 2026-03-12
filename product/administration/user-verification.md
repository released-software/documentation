---
description: Authenticate users without requiring login
icon: lock
---

# User Verification

User verification allows you to securely identify users who access your private widgets or pages. By generating a signed authentication token on your server, you can ensure that only authorized users gain access and can leave feedback in your portals.&#x20;

User verification is a great way to control access while providing a seamless experience for your team and customers.

## Setup

Please refer to the [implementing-user-verification.md](../../getting-started/setup-guide/implementing-user-verification.md "mention") guide to set up user verification.&#x20;

## Credentials

To implement user verification, you'll require an Account ID as well as a Shared Secret. To access your account credentials, navigate to global **Settings** **> User verification** in Released.

### **Account ID**

The account ID uniquely identifies your release account.&#x20;

### Shared Secret

Your authentication secret key.

{% hint style="warning" %}
**Keep your secret safe!** Never expose it in client-side code or public repositories.
{% endhint %}

#### Rotating your shared secret

If you accidentally leaked your secret, or need to change it for any other reason, you can easily create a new one.

1. Generate a new secret in the global **Settings** > **User verification** section.
2. Update your server to use the new secret when generating tokens.
3. Ensure all embeds and requests are updated to use tokens generated with the new secret.

## Need Help? <a href="#need-help" id="need-help"></a>

If you run into issues, [contact us](https://released.so/support) and we’ll help you get started.
