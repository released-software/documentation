---
description: Embed announcements into your website or documentation
---

# Announcement Page

The announcement page enables you to integrate release notes seamlessly into your website or documentation. You can maintain your existing website header and footer, ensuring a consistent user experience across your site.&#x20;

## Demo

Experience a demo of the widget on [CodePen](https://codepen.io/released/pen/WNaaMNx).

## Installation

To add the announcement page to your website, copy the following code snippet into the `<head>` element. This script needs to be present on the page where you want to display the announcement page.&#x20;

```html
<script src="https://embed.released.so/1/embed.js"></script>
```

Next, add the `released-page` custom element to the `<body>` of the page. Unlike the widget, the announcement page content renders where you position the element.&#x20;

```html
<released-page channel-id="CHANNEL_ID"></released-page>
```

Ensure you replace "CHANNEL\_ID" with the id of your release notes channel.&#x20;

{% hint style="info" %}
You can locate a version of the code snippet in the **Announcement page** section of the **Settings**, where the CHANNEL\_ID_\_ID_ field is already populated for your convenience.
{% endhint %}

## Configuration options

Customize your announcement page to align with your brand design by leveraging the `<released-page>` properties. Tailor the header and color settings to match your website and create a seamless integration with your brands visual identity.

The properties are specified as attributes within the `<released-page>` custom HTML element.

### Page properties

<table data-full-width="false"><thead><tr><th width="204">Property</th><th width="588">Description</th></tr></thead><tbody><tr><td><code>channel-id</code></td><td>The ID of the release notes channel.</td></tr><tr><td><code>header</code></td><td>Can be "true" or "false". If false, the header with the title and description is hidden. This options allows you use an existing header or create a completely custom header. </td></tr><tr><td><code>title</code></td><td>The title of the widget.</td></tr><tr><td><code>sub-title</code></td><td>The subtitle of the widget.</td></tr><tr><td><code>color-scheme</code></td><td>The color scheme to use for the widget. Can be <code>system</code>, <code>dark</code>, or <code>light</code>.</td></tr><tr><td><code>color-primary</code></td><td>The primary UI color. Can be hex, hsl, rgb, or css color name.</td></tr><tr><td><code>top-offset</code></td><td>Expects a number (eg. <code>100</code>) or <code>false</code> as values. <br>A value of <code>100</code> will create an offset of 100 pixels from the top for sticky titles. A value of <code>false</code> will disable sticky titles.</td></tr></tbody></table>

