---
description: >-
  Use trusted domains to simplify access management and control where embedded
  portals can be displayed.
icon: lock
---

# Trusted Domains

{% hint style="warning" %}
These settings is restricted to **Released administrators.**
{% endhint %}

## Internal email domains

Internal email domains simplify access management and for your organization’s portals in the Product Hub. Instead of manually adding company domains to each portal, Released administrators can define a global list of approved domains.&#x20;

{% hint style="info" %}
Internal email domains will get access to a portal when the internal domains option is enabled within the [portal access settings](../portals/access.md#internal).&#x20;
{% endhint %}

### Adding an internal email domain

{% stepper %}
{% step %}
Navigate to the global **Settings > Trusted domains** via the overview page or the workspace dropdown within a workspace.&#x20;
{% endstep %}

{% step %}
Click the **Add domain** button in the _internal email domains_ section
{% endstep %}

{% step %}
Add your internal email domains. For example: **example.com**
{% endstep %}
{% endstepper %}

## Trusted domains for embedded content

To protect your users, Verified User Tokens and manual sign‑in are only supported for embeds served from domains on your configured allowlist and only when the hosting page uses HTTPS. In other words, the embed’s origin must be explicitly permitted in your application’s domain settings, and the page that hosts the embed must be delivered securely (https://) with a valid TLS certificate.

### Adding a trusted domain

{% stepper %}
{% step %}
Navigate to the global **Settings > Trusted domains** via the overview page or the workspace dropdown within a workspace.&#x20;
{% endstep %}

{% step %}
Click the **Add domain** button in the _trusted domains for embedded content_ section
{% endstep %}

{% step %}
Add your trusted domains. For example: **example.com**
{% endstep %}
{% endstepper %}

{% hint style="info" %}
If you run into issues embedding your portal, see the [Embeds Troubleshooting Guide](../../resources/troubleshooting/embeds.md).
{% endhint %}
