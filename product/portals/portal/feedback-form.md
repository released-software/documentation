---
description: Embed a feedback form into your app or site
hidden: true
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

# Form Embed

The form embed offers a seamless way to integrate a feedback form into your application or website. Embed the form inline or as a dialog.

## Configuration

To customize the appearance of your embedded portal, go to **Workspace > Settings > Form**.

The form embed settings allow you to tailor the look and feel of the form to match your brand or audience. From the right-hand sidebar, you are able to change the title and subtitle, placeholder, color scheme, locale and more.

Alternatively you can use the [advanced options](feedback-form.md#advanced-options) below to specify the configuration via code.&#x20;

## Installation

To add the form embed to your website or app:

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
To enable users to log in, you must add the domain's URL to the list of [trusted domains](../../administration/trusted-domains.md). The URL must include the subdomain. For example `feedback.example.com`.
{% endhint %}

## Advanced options

### Overwriting the UI settings

You can overwrite the configured styles and settings of the form embed by adding custom properties to the embed code. This allows for customizing the styling when embedding the form in different locations.

{% hint style="warning" %}
When a setting is configured via the properties below, it can no longer be customized via the UI settings.&#x20;
{% endhint %}

The properties are specified as attributes within the `<released-form>` custom HTML element.

### **Form Properties**&#x20;

The following customization options are available for the form embed.

<table data-header-hidden data-full-width="false"><thead><tr><th width="208">Property</th><th>Description</th></tr></thead><tbody><tr><td><code>form-id</code></td><td>The ID of the feedback form to embed.</td></tr><tr><td><code>title</code></td><td>The title of the form.</td></tr><tr><td><code>sub-title</code></td><td>The subtitle of the form.</td></tr><tr><td><code>position</code></td><td>The position of the form if shown in a dialog. Can be <code>top-left</code>, <code>top-right</code>, <code>bottom-right</code>, or <code>bottom-left</code>.</td></tr><tr><td><code>dialog</code></td><td>Whether the form will be shown in a dialog <code>true</code> or inline <code>false</code>.</td></tr><tr><td><code>color-scheme</code></td><td>The color scheme to use for the widget. Can be <code>system</code>, <code>dark</code>, or <code>light</code>. See <a data-mention href="../../../resources/how-tos/configuring-dark-mode.md">configuring-dark-mode.md</a> for more details.</td></tr><tr><td><code>locale</code></td><td><p>The locale to use for the page. Can be:</p><p></p><ul><li><code>en</code> 🇺🇸 American English</li><li><code>de</code> 🇩🇪 German</li><li><code>fr</code> 🇫🇷 French</li><li><code>es</code> 🇪🇸 Spanish</li><li><code>pt</code> 🇵🇹 Portuguese</li><li><p><code>nl</code> 🇳🇱 Dutch</p><ul><li><code>zh</code>  🇨🇳 Chinese</li></ul></li></ul></td></tr></tbody></table>

### Data Attributes

Setting data attributes can be helpful to prevent unwanted interactions with 3rd party libraries. For example, to prevent scrolling issues when the [Lenis](https://lenis.studiofreight.com/) library is used, you can add the `data-lenis-prevent` attribute to the host container.&#x20;

**Example:**&#x20;

```html
<released-form form-id="FORM_ID" data-lenis-prevent=""></released-form>
```

### Default values

The following default values are applied in case a property is not explicitly defined.&#x20;

```html
<released-form form-id="FORM_ID" 
  title="What's New"
  sub-title="The latest updates and improvements."
  position="bottom-right"
  trigger="#trigger"
  color-scheme="system"
></released-widget>
```

