---
description: Embed announcements into your app or site
---

# Widget Embed

<figure><img src="../../../.gitbook/assets/Widget - Header.png" alt=""><figcaption><p>Embed Widget Settings</p></figcaption></figure>

## Overview

The embed widget offers a seamless way to integrate release notes into your application or website. With a simple click on a trigger in form of a link or button, users can access a dialog box displaying the most recent announcements. Additionally, the trigger conveniently displays a badge indicating the presence of new announcements.

## Basics

### Demo

Experience a demo of the widget on [CodePen](https://codepen.io/released/pen/WNaaMNx).

### Configuration

The embed widget settings provide a number of options to customize the appearance of the widget.&#x20;

Via the right-hand sidebar settings, you are able to change the title and subtitle, color scheme and locale of the widget.&#x20;

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
* Click the **Widget** menu item in the Design section.
* Click the **Install** button at the bottom of the sidebar.&#x20;
* Follow the installation instruction in the slide out panel.&#x20;

## Advanced options

### Overwriting the UI settings

You can overwrite the configured styles and settings of the widget by adding custom properties to the embed code. This allows for customizing the styling when embedding the widget in different locations.&#x20;

{% hint style="warning" %}
When a setting is configured via the properties below, it can no longer be customized via the UI settings.&#x20;
{% endhint %}

The properties are specified as attributes within the `<released-widget>` custom HTML element.

### **Widget Properties**&#x20;

The following customisation options are available for the widget.&#x20;

<table data-header-hidden data-full-width="false"><thead><tr><th width="208">Property</th><th>Description</th></tr></thead><tbody><tr><td><code>channel-id</code></td><td>The ID of the release notes channel.</td></tr><tr><td><code>position</code></td><td>The position of the widget. Can be <code>top-left</code>, <code>top-right</code>, <code>bottom-right</code>, or <code>bottom-left</code>.</td></tr><tr><td><code>anchor</code></td><td><p>Can be <code>trigger</code> or <code>viewport</code>. Positions the popup relative to the trigger or the viewport. </p><details><summary>When using <code>trigger</code>, <code>position</code> translates to...</summary><ul><li><code>top-left</code> = <code>top-start</code> (popover opens above the trigger and the left of the popover is aligned to the left of the button)</li><li><code>top-right</code> = <code>top-end</code> (popover opens above the trigger and the right of the popover is aligned to the right of the button)</li><li><code>bottom-left</code> = <code>bottom-start</code> (popover opens below the trigger and the left of the popover is aligned to the left of the button)</li><li><code>bottom-right</code> = <code>bottom-end</code> (popover opens below the trigger and the right of the popover is aligned to the right of the button)</li><li><code>center</code> = <code>bottom</code> (popover opens below the trigger and the popover is centered  horizontally, relative to the trigger)</li></ul><p>You can find a demo and experiment with different options on <a href="https://codepen.io/released/pen/yLrBKJa">Codepen</a>. </p></details></td></tr><tr><td><code>trigger</code></td><td>A <code>string</code> specifying a <a href="https://www.w3schools.com/cssref/css_selectors.php">css selector</a> that determines which element on the page will open the dialog when clicked. For example <code>#changelog-button</code>. If not specified, a default trigger button will be rendered. </td></tr><tr><td><code>title</code></td><td>The title of the widget.</td></tr><tr><td><code>sub-title</code></td><td>The subtitle of the widget.</td></tr><tr><td><code>badge</code></td><td>Whether to display a badge with the unread count. Can be <code>true</code> or <code>false</code>.</td></tr><tr><td><code>color-scheme</code></td><td>The color scheme to use for the widget. Can be <code>system</code>, <code>dark</code>, or <code>light</code>. See <a data-mention href="../../../resources/how-tos/configuring-dark-mode.md">configuring-dark-mode.md</a> for more details.</td></tr><tr><td><code>color-primary</code></td><td>The primary UI color. Can be hex, hsl, rgb, or css color name.</td></tr><tr><td><code>color-secondary</code></td><td>The secondary UI color. Can be hex, hsl, rgb, or css color name.</td></tr><tr><td><code>attributes</code></td><td>Allows for passing <code>data-*</code> attributes to the host container for the widget. For more details see the <a href="widget.md#attributes">Attributes section</a> below. </td></tr><tr><td><code>z-index</code></td><td>The z-index to use for the widget.</td></tr></tbody></table>

### Data Attributes

Setting data attributes can be helpful to prevent unwanted interactions with 3rd party libraries. For example, to prevent scrolling issues when the [Lenis](https://lenis.studiofreight.com/) library is used, you can add the `data-lenis-prevent` attribute to the host container.&#x20;

**Example:**&#x20;

```html
<released-widget channel-id="CHANNEL_ID" data-lenis-prevent=""></released-widget>
```

### Default values

The following default values are applied in case a property is not explicitly defined.&#x20;

```html
<released-widget channel-id="CHANNEL_ID" 
  anchor="viewport"
  position="bottom-right"
  title="What's New"
  sub-title="The latest updates and improvements."
  trigger="#trigger"
  badge="true"
  color-scheme="system"
  color-primary="#7c3aed"
  color-secondary="#e879f9"
  z-index="10000"
></released-widget>
```

