---
description: Embed the portal into your app or site
icon: square-code
layout:
  width: default
  title:
    visible: true
  description:
    visible: true
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
  metadata:
    visible: true
---

# Widget Embed

The embed widget offers a seamless way to integrate release notes into your application or website. With a simple click on a trigger in form of a link or button, users can access a dialog box displaying the most recent announcements. Additionally, the trigger conveniently displays a badge indicating the presence of new announcements.

## Demo

Experience a demo of the widget on [CodePen](https://codepen.io/released/pen/WNaaMNx).

## Configuration

To customize the appearance of your embedded portal, go to **Workspace > Settings > Widget**.

The widget embed settings allow you to tailor the look and feel of the widget to match your brand or audience. From the right-hand sidebar, you are able to change the title and subtitle, color scheme, locale and more. &#x20;

Alternatively you can use the [advanced options](widget.md#advanced-options) below to specify the configuration via code.&#x20;

## Installation

To add the widget to your website:

{% stepper %}
{% step %}
#### Click the install button

Click the Install button at the bottom of the configuration sidebar.&#x20;
{% endstep %}

{% step %}
#### Copy the install code

Follow the instructions in the install panel. Copy the relevant code snippets and paste them into your website or app.&#x20;
{% endstep %}
{% endstepper %}

{% hint style="warning" %}
To enable users to log in, you must add the domain's URL to the list of trusted domains. The URL must include the subdomain. For example `feedback.example.com`.
{% endhint %}

## Advanced options

### Overwriting the UI settings

You can overwrite the configured styles and settings of the widget by adding custom properties to the embed code. This allows for customizing the styling when embedding the widget in different locations.&#x20;

{% hint style="warning" %}
When a setting is configured via the properties below, it can no longer be customized via the UI settings.&#x20;
{% endhint %}

The properties are specified as attributes within the `<released-widget>` custom HTML element.

### **Widget Properties**&#x20;

The following customisation options are available for the widget.&#x20;

<table data-header-hidden data-full-width="false"><thead><tr><th width="208">Property</th><th>Description</th></tr></thead><tbody><tr><td><code>channel-id</code></td><td>The ID of the release notes channel.</td></tr><tr><td><code>title</code></td><td>The title of the widget.</td></tr><tr><td><code>sub-title</code></td><td>The subtitle of the widget.</td></tr><tr><td><code>position</code></td><td>The position of the widget. Can be <code>top-left</code>, <code>top-right</code>, <code>bottom-right</code>, or <code>bottom-left</code>.</td></tr><tr><td><code>anchor</code></td><td>Can be <code>trigger</code> or <code>viewport</code>. Positions the popup relative to the trigger or the viewport. </td></tr><tr><td><code>trigger</code></td><td>A <code>string</code> specifying a <a href="https://www.w3schools.com/cssref/css_selectors.php">css selector</a> that determines which element on the page will open the dialog when clicked. For example <code>#changelog-button</code>. If not specified, a default trigger button will be rendered. </td></tr><tr><td><code>boost</code></td><td>Whether boosting will auto-popup the widget or not. Can be <code>true</code> or <code>false</code>.</td></tr><tr><td><code>badge</code></td><td>Whether to display a badge with the unread count. Can be <code>true</code> or <code>false</code>.</td></tr><tr><td><code>changelog-category</code></td><td>Limits the embed to display a single category. Use the category slug as the value. For example: The slug for "New Features" would be <code>new-features</code> .</td></tr><tr><td><code>color-scheme</code></td><td>The color scheme to use for the widget. Can be <code>system</code>, <code>dark</code>, or <code>light</code>. See <a data-mention href="../../../resources/how-tos/configuring-dark-mode.md">configuring-dark-mode.md</a> for more details.</td></tr><tr><td><code>color-primary</code></td><td>The primary UI color. Can be hex, hsl, rgb, or css color name.</td></tr><tr><td><code>color-secondary</code></td><td>The secondary UI color. Can be hex, hsl, rgb, or css color name.</td></tr><tr><td><code>attributes</code></td><td>Allows for passing <code>data-*</code> attributes to the host container for the widget. For more details see the <a href="widget.md#attributes">Attributes section</a> below. </td></tr><tr><td><code>z-index</code></td><td>The z-index to use for the widget.</td></tr><tr><td><code>locale</code></td><td><p>The locale to use for the page. Can be:</p><p></p><ul><li><code>en</code> 🇺🇸 American English</li><li><code>de</code> 🇩🇪 German</li><li><code>fr</code> 🇫🇷 French</li><li><code>es</code> 🇪🇸 Spanish</li><li><code>pt</code> 🇵🇹 Portuguese</li><li><code>nl</code> 🇳🇱 Dutch</li><li><code>zh</code>  🇨🇳 Chinese</li></ul></td></tr></tbody></table>

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

