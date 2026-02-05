---
description: Authenticate users without requiring login
icon: lock
---

# User Verification

User verification allows you to securely identify users who access your private widgets or pages. By generating a signed authentication token on your server, you can ensure that only authorized users gain access and can leave feedback in your portals.&#x20;

User verification is a great way to control access while providing a seamless experience for your team and customers.

## Setup

Please refer to the [implementing-user-verification.md](../../getting-started/setup-guide/implementing-user-verification.md "mention") guide to set up user verification.&#x20;

## Rotating your shared secret

If you need to rotate your shared secret:

1. Generate a new secret in the **User verification** section.
2. Update your server to use the new secret when generating tokens.
3. Ensure all embeds and requests are updated to use tokens generated with the new secret.

## Need Help? <a href="#need-help" id="need-help"></a>

If you run into issues, [contact us](https://released.so/support) and we’ll help you get started.
