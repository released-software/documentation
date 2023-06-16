---
description: Customise the widget to match your brand and style.
---

# Widget

## Configuration options

Customize your widget to match your brand and app design using the widget properties. Adjust the title, description, colors, positioning, and trigger settings according to your preferences.

The properties are expressed in JSON format and contained in a script tag with the `id="released-widget-props"`.&#x20;

```
<script type="application/json" id="released-widget-props">
```

## **Widget Properties**&#x20;

The following customisation options are available for the widget.&#x20;

<table data-full-width="false"><thead><tr><th width="170">Property</th><th width="588">Description</th></tr></thead><tbody><tr><td><code>id</code></td><td>The ID of the release notes project.</td></tr><tr><td><code>position</code></td><td>The position of the widget. Can be <code>top-left</code>, <code>top-right</code>, <code>bottom-right</code>, or <code>bottom-left</code>.</td></tr><tr><td><code>title</code></td><td>The title of the widget.</td></tr><tr><td><code>subTitle</code></td><td>The subtitle of the widget.</td></tr><tr><td><code>trigger</code></td><td>A <code>string</code> specifying a <a href="https://www.w3schools.com/cssref/css_selectors.php">css selector</a> that determines which element on the page will open the dialog when clicked. For example <code>#changelog-button</code>. If not specified, a default trigger button will be rendered. </td></tr><tr><td><code>badge</code></td><td>Whether to display a badge with the unread count. Can be <code>true</code> or <code>false</code>.</td></tr><tr><td><code>colorScheme</code></td><td>The color scheme to use for the widget. Can be <code>system</code>, <code>dark</code>, or <code>light</code>.</td></tr><tr><td><code>zIndex</code></td><td>The z-index to use for the widget.</td></tr><tr><td><code>theme</code></td><td>A custom theme to use for the widget. See below for theme properties.</td></tr><tr><td>attributes</td><td>Allows for passing <code>data-*</code> attributes to the host container for the widget. For more details see the <a href="widget.md#attributes">Attributes section</a> below. </td></tr></tbody></table>

### **Theme**&#x20;

<table><thead><tr><th width="171">Property</th><th>Description</th></tr></thead><tbody><tr><td><code>colors</code></td><td>An object that defines the primary and secondary colors for the widget.</td></tr><tr><td>      <code>primary</code></td><td>The primary UI color. Can be hex, hsl, rgb, or css color name.</td></tr><tr><td>      <code>secondary</code></td><td>The secondary UI color. Can be hex, hsl, rgb, or css color name.</td></tr></tbody></table>

### Attributes

Setting data attributes can be helpful to prevent unwanted interactions with 3rd party libraries. For example, to prevent scrolling issues when the [Lenis](https://lenis.studiofreight.com/) library is used, you can add the `data-lenis-prevent` attribute to the host container.&#x20;

**Example:**&#x20;

```json
{
  "id": "",
  "attributes": {
    "data-lenis-prevent": "",
  }
}
```

**Results in:**

```html
<div id="__released-widget-host" data-lenis-prevent="" ...></div>
```

### Default values

The following default values are applied in case a property is not explicitly defined.&#x20;

```json
{
  "id": "",
  "position": "bottom-right",
  "title": "What's New",
  "subTitle": "The latest updates and improvements.",
  "trigger": "#trigger",
  "badge": true,
  "colorScheme": "system",
  "theme": {
    "colors": {
      "primary": "#7c3aed",
      "secondary": "#e879f9"
    }
  },
  "zIndex": 10000
}
```

## Installation

To add the widget to your website or app, copy the following code snippet into the `<head>` element. Replace the `[PROJECT_ID]` placeholder with the ID found in your widget configuration.&#x20;

{% hint style="info" %}
You can find a complete version of the snippet in the app, with all details pre-filled.
{% endhint %}

```
<script type="application/json" id="released-widget-props">
  {
    "id": "[PROJECT_ID]",
    "title": "Changelog",
    "subTitle": "New updates and improvements.",
  }
</script>
<script src="https://embed.released.so/1/widget.js"></script>
```

The above code snippet contains two `script` tags. The first tag contains the configuration properties for the widget, and the second tag loads the widget.&#x20;

The available configuration options are described in the following section.
