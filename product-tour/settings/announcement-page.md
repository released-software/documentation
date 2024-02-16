---
description: Embed announcements into your website or documentation
---

# Announcement Page

<figure><img src="../../.gitbook/assets/Announcement Page - Header.png" alt=""><figcaption><p>Embed Page Settings</p></figcaption></figure>

## Overview

The announcement page enables you to integrate release notes seamlessly into your website or documentation. You can maintain your existing website header and footer, ensuring a consistent user experience across your site.&#x20;

## Basics

### Demo

Experience a demo of the widget on [CodePen](https://codepen.io/released/pen/WNaaMNx).

### Configuration

The announcement page settings provide a number of options to customize the appearance of the page.&#x20;

Via the right-hand sidebar settings, you are able to change the title and subtitle, color scheme and locale of the page.&#x20;

#### Supported locales

🇺🇸 American English \
🇩🇪 German\
🇫🇷 French \
🇪🇸 Spanish\
🇵🇹 Portuguese \
🇳🇱 Dutch

### Installation

To add the announcement page to your website, simply follow the installation instructions in the app.&#x20;

* Navigate to the Released **Settings** in your Jira project
* Click the **Announcement Page** menu item.&#x20;
* Click the **Install** button at the bottom of the sidebar.&#x20;
* Follow the installation instruction in the slide out panel.

## Advanced options

### Overwriting the UI settings

You can overwrite the configured styles and settings of the page by adding custom properties to the embed code. This allows for customizing the styling when embedding the page in different locations.&#x20;

{% hint style="warning" %}
When a setting is configured via the properties below, it can no longer be customized via the UI settings.&#x20;
{% endhint %}

The properties are specified as attributes within the `<released-page>` custom HTML element.

### Page properties

<table data-full-width="false"><thead><tr><th width="204">Property</th><th width="588">Description</th></tr></thead><tbody><tr><td><code>channel-id</code></td><td>The ID of the release notes channel.</td></tr><tr><td><code>header</code></td><td>Can be "true" or "false". If false, the header with the title and description is hidden. This options allows you use an existing header or create a completely custom header. </td></tr><tr><td><code>cover-images</code></td><td>Can be "true" or "false". Default is "true" and the cover image will be shown. </td></tr><tr><td><code>title</code></td><td>The title of the widget.</td></tr><tr><td><code>sub-title</code></td><td>The subtitle of the widget.</td></tr><tr><td><code>color-scheme</code></td><td>The color scheme to use for the widget. Can be <code>system</code>, <code>dark</code>, or <code>light</code>.</td></tr><tr><td><code>color-primary</code></td><td>The primary UI color. Can be hex, hsl, rgb, or css color name.</td></tr><tr><td><code>top-offset</code></td><td>Expects a number (eg. <code>100</code>) or <code>false</code> as values. <br>A value of <code>100</code> will create an offset of 100 pixels from the top for sticky titles. A value of <code>false</code> will disable sticky titles.</td></tr></tbody></table>

### Notification badge

To notify users about the availability of a new post, you can enhance the user experience by incorporating a notification badge on the link or button leading to the announcement page. This badge functions similarly to the notification badge found in the widget.

<figure><img src="../../.gitbook/assets/Badge.png" alt="" width="375"><figcaption><p>The notification badge let's users know when a new update is available. </p></figcaption></figure>



#### Installing the badge

Follow the **Installation instructions** and copy the code for the badge.&#x20;

It's best to place the `<release-badge>` element inside the `<a>` tag when adding the badge to a link.&#x20;

```html
<a href="/changelog" class="nav-link">What's New? <released-badge channel-id="CHANNEL_ID"></released-badge></a>
```

#### Adjusting the position of the badge

You can adjust the position of the badge by styling it with CSS. We recommend two options:&#x20;

* Use the margin property to adjust the position
* Use the transform property to adjust the position&#x20;

```html
<style>
released-badge {
  margin-top: -8px;
  margin-right: -8px; // example with margins
  transform: translate(50%, -50%); // example of transform
}
</style>
```

{% hint style="info" %}
Experiment with badge positioning on [CodePen](https://codepen.io/released/pen/abQRYgG).
{% endhint %}
