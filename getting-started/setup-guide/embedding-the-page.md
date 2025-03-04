---
description: Embed the page in your website or documentation with a few lines of code.
---

# Embedding the Page

## Overview

The announcement page enables you to integrate release notes seamlessly into your website or documentation. You can maintain your existing website header and footer, ensuring a consistent user experience across your site.

### Demo

Experience a demo of the page embed on [CodePen](https://codepen.io/released/pen/WNaaMNx).

## Installation instructions

### Prerequisite

* [ ] [Copy the channel ID](../../resources/how-tos/finding-the-channel-id.md) for the embed widget.

### **1. Select which modules to include**

Choose whether to embed the Changelog, the Roadmap, or both by selecting which modules to include in the embed.

<figure><img src="../../.gitbook/assets/Settings - Install instructions.png" alt=""><figcaption><p>Select which modules to embed.</p></figcaption></figure>

### **2. Load the widget script**

Add the following code snippet to the `<head>` section of your site.

```markup
<script src="https://embed.released.so/1/embed.js" defer></script>
```

### **3. Place the embed code in your page**

Add the following code snippet to the `<body>` section of your site. Unlike the widget, the page content renders where you position the element. Ensure you replace the `CHANNEL_ID` attribute.

```markup
<released-page channel-id="CHANNEL_ID"></released-page>
```

{% hint style="warning" %}
If your portal has restricted access, you’ll need to [implement user verification](implementing-user-verification.md) and pass the `auth-token="AUTH_TOKEN"` attribute to display content in your embed.
{% endhint %}

### **4. Add a notification badge (optional)**

To notify users about the availability of a new post, you can enhance the user experience by incorporating a notification badge on the link or button leading to the embedded page. This badge functions similarly to the notification badge found in the widget.

Add the following code snippet to the `<body>` section of your site where you want the badge to render.

```markup
<released-badge channel-id="CHANNEL_ID"></released-badge>
```

### **5. Customize the page (optional)**

Customize the page to match your brand and app design using the page properties. Adjust the title and description, or change the colors according to your preferences.

Please see the documentation for a full list of [configuration options](../../workspace/portal/announcement-page.md).
