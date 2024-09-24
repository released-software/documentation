---
description: Embed the page in your website or documentation with a few lines of code.
---

# Embedding the Page

## Overview

The announcement page enables you to integrate release notes seamlessly into your website or documentation. You can maintain your existing website header and footer, ensuring a consistent user experience across your site.

## Installation instructions

### Prerequisite&#x20;

* [ ] [Copy the channel ID](../../how-tos/finding-the-channel-id.md) for the embed widget.

### **1. Select which modules to include**

Choose whether to embed the Changelog, the Roadmap, or both by selecting which modules to include in the embed.&#x20;

<figure><img src="../../.gitbook/assets/Settings - Install instructions.png" alt=""><figcaption><p>Select which modules to embed. </p></figcaption></figure>

### **2. Load the widget script**

Add the following code snippet to the `<head>` section of your site.

```markup
<script src="https://embed.released.so/1/embed.js" defer></script>
```

### **3. Place the embed code in your page**

Add the following code snippet to the `<body>` section of your site. Unlike the widget, the page content renders where you position the element.

{% hint style="warning" %}
Ensure you replace the `CHANNEL_ID` attribute.
{% endhint %}

```markup
<released-page channel-id="CHANNEL_ID"></released-page>
```

### **4. Add a notification badge (optional)**

To notify users about the availability of a new post, you can enhance the user experience by incorporating a notification badge on the link or button leading to the embedded page. This badge functions similarly to the notification badge found in the widget.

Add the following code snippet to the `<body>` section of your site where you want the badges to render.

```markup
<released-badge channel-id="CHANNEL_ID"></released-badge>
```

### **5. Customize the page (optional)**

Customize the page to match your brand and app design using the page properties. Adjust the title and description, or change the colors according to your preferences.

Please see the documentation for a full list of [configuration options](../../product-tour/settings/announcement-page.md).

\
