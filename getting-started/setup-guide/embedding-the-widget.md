---
description: Embed the widget in your website or app with a few lines of code.
---

# Embedding the Widget

## Overview

The embed widget offers a seamless way to integrate release notes into your application or website. With a simple click on a trigger in form of a link or button, users can access a dialog box displaying the most recent announcements. Additionally, the trigger conveniently displays a badge indicating the presence of new announcements.

## Installation instructions

### Prerequisite&#x20;

* [ ] [Copy the channel ID](../../how-tos/finding-the-channel-id.md) for the embed widget.

### **1. Select which modules to include**

Choose whether to embed the Changelog, the Roadmap, or both by selecting which modules to include in the embed.&#x20;

<figure><img src="../../.gitbook/assets/Settings - Install instructions.png" alt=""><figcaption><p>Select which modules to include</p></figcaption></figure>

### **2. Load the widget script**

Add the following code snippet to the `<head>` section of your site.

```markup
<script src="https://embed-staging.released.so/1/embed.js" defer></script>
```

### **3. Place the embed code in your page**

Add the following code snippet to the `<body>` section of your site. The widget will not be rendered inline, so it does not matter where in the body you position the element.&#x20;

{% hint style="warning" %}
Ensure you replace the `CHANNEL_ID` attribute.
{% endhint %}

```markup
<released-widget channel-id="CHANNEL_ID"></released-widget>
```

### **4. Customize the widget (optional)**

Customize the widget to match your brand and app design using the widget properties. Adjust the title and description, or change the colors according to your preferences.

Please see the documentation for a full list of [configuration options](../../product-tour/settings/widget.md).

\
