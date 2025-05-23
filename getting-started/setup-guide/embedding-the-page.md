---
description: Embed the page in your website or documentation with a few lines of code.
---

# Embedding the Page

The announcement page enables you to integrate release notes seamlessly into your website or documentation. You can maintain your existing website header and footer, ensuring a consistent user experience across your site.

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
### **Add the released-page element to your page**

Add the following code snippet to the `<body>` section of your site. Unlike the widget, the page content renders where you position the element. Ensure you replace the `CHANNEL_ID` attribute.

```markup
<released-page channel-id="CHANNEL_ID"></released-page>
```

{% hint style="warning" %}
If your portal has restricted access, you’ll need to [implement user verification](implementing-user-verification.md) and pass the `auth-token="AUTH_TOKEN"` attribute to display content in your embed.
{% endhint %}
{% endstep %}
{% endstepper %}

## Optional steps

{% stepper %}
{% step %}
### **Add a notification badge**

To notify users about the availability of a new post, you can enhance the user experience by incorporating a notification badge on the link or button leading to the embedded page. This badge functions similarly to the notification badge found in the widget.

Add the following code snippet to the `<body>` section of your site where you want the badge to render.

```markup
<released-badge channel-id="CHANNEL_ID"></released-badge>
```
{% endstep %}

{% step %}
### **Customize the page**&#x20;

Customize the page to match your brand and app design using the page properties. Adjust the title and description, or change the colors according to your preferences.

Please see the documentation for a full list of [configuration options](../../workspace/settings/portal/announcement-page.md).
{% endstep %}
{% endstepper %}

## Example

View an example of how to embed the page on [CodePen](https://codepen.io/released/pen/WNaaMNx).
