---
description: Embed the widget in your website or app with a few lines of code.
icon: square-code
---

# Embedding the Widget

The embed widget offers a seamless way to integrate release notes into your application or website. With a simple click on a trigger in form of a link or button, users can access a dialog box displaying the most recent announcements. Additionally, the trigger conveniently displays a badge indicating the presence of new announcements.

{% hint style="warning" %}
To enable users to log in, you must add the domain's URL to the list of trusted domains. The URL must include the subdomain. For example `feedback.example.com`.
{% endhint %}

## Installation instructions

{% stepper %}
{% step %}
### Copy the channel ID

[Copy the channel ID](../../resources/how-tos/finding-the-channel-id.md) for the embed widget.
{% endstep %}

{% step %}
### **Select which modules to include**

Choose whether to embed the Changelog, the Roadmap, or both by selecting which modules to include in the embed.

<figure><img src="../../.gitbook/assets/Settings - Install instructions.png" alt=""><figcaption><p>Select which modules to include</p></figcaption></figure>
{% endstep %}

{% step %}
### **Add the embed script**

Add the following code snippet to the `<head>` section of your site.

```markup
<script src="https://embed.released.so/1/embed.js" defer></script>
```
{% endstep %}

{% step %}
### **Add the released-widget element to your page**

Add the following code snippet to the `<body>` section of your site. The widget will not be rendered inline, so it does not matter where in the body you position the element. Ensure you replace the `CHANNEL_ID` attribute.

```markup
<released-widget channel-id="CHANNEL_ID"></released-widget>
```

{% hint style="warning" %}
If your portal has restricted access, you’ll need to [implement user verification](implementing-user-verification.md) and pass the `auth-token="AUTH_TOKEN"` attribute to display content in your embed.
{% endhint %}
{% endstep %}
{% endstepper %}

## Optional step

{% stepper %}
{% step %}
### **Customize the widget (optional)**

Customize the widget to match your brand and app design using the widget properties. Adjust the title and description, or change the colors according to your preferences.

Please see the documentation for a full list of [configuration options](../../product/portals/portal/widget.md).
{% endstep %}
{% endstepper %}

## Example

View an example of how to embed the widget on [CodePen](https://codepen.io/released/pen/WNaaMNx).
