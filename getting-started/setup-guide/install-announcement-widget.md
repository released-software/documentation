---
description: >-
  The widget can be installed in just a few minutes with a few simple lines of
  code.
---

# Install Announcement Widget

<figure><img src="../../.gitbook/assets/Widget Header.png" alt=""><figcaption><p>Announcement Widget</p></figcaption></figure>

## Installation

To add the widget to your website or app, copy the following code snippet into the `<head>` element. Replace the `[PROJECT_ID]` placeholder with the ID found in your widget configuration. You can also find a complete version of this snippet in the widget configuration app, with all details pre-filled.

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

The above code snippet contains two `script` tags. The first tag configures the widget, and the second tag loads the widget's code.&#x20;

The available configuration options are described in the following section.

## Configuration options

The properties to configure the widget options are expressed in JSON format and contained in a script tag with the `id="released-widget-props"`.&#x20;

```
<script type="application/json" id="released-widget-props">
```

### **Widget Properties**&#x20;

The following customisation options are available for the widget.&#x20;

| Property      | Description                                                                                                                                                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`          | The ID of the release notes project.                                                                                                                                                                                                                                    |
| `position`    | The position of the widget. Can be `top-left`, `top-right`, `bottom-right`, or `bottom-left`.                                                                                                                                                                           |
| `title`       | The title of the widget.                                                                                                                                                                                                                                                |
| `subTitle`    | The subtitle of the widget.                                                                                                                                                                                                                                             |
| `trigger`     | A `string` specifying a [css selector](https://www.w3schools.com/cssref/css\_selectors.php) that determines which element on the page will open the dialog when clicked. For example `#changelog-button`. If not specified, a default trigger button will be rendered.  |
| `badge`       | Whether to display a badge with the unread count. Can be `true` or `false`.                                                                                                                                                                                             |
| `colorScheme` | The color scheme to use for the widget. Can be `system`, `dark`, or `light`.                                                                                                                                                                                            |
| `zIndex`      | The z-index to use for the widget.                                                                                                                                                                                                                                      |
| `theme`       | A custom theme to use for the widget. See below for theme properties.                                                                                                                                                                                                   |

**Theme**&#x20;

| Property        | Description                                                             |
| --------------- | ----------------------------------------------------------------------- |
| `colors`        | An object that defines the primary and secondary colors for the widget. |
|     `primary`   | The primary UI color. Can be hex, hsl, rgb, or css color name.          |
|     `secondary` | The secondary UI color. Can be hex, hsl, rgb, or css color name.        |

### Default values

The following default values are applied in case a property is not explicitly defined.&#x20;

```
{
  "id": "",
  "position": "bottom-right",
  "title": "What's New",
  "subTitle": "The latest updates and improvements.",
  "trigger": true,
  "badge": true,
  "colorScheme": "system",
  "theme": {
    "colors": {
      "primary": "#7c3aed",
      "secondary": "#e879f9"
    },
  },
  "zIndex": 10000
}
```

## Demo

Experience a demo of the widget on [CodePen](https://codepen.io/Jens-Schumacher/pen/WNaaMNx).
