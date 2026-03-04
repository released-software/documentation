---
description: Embed a feedback form into your app or site
icon: square-code
---

# Form Embed

The form embed offers a seamless way to integrate a feedback form into your application or website. Embed the form inline or as a dialog.

<a href="../../../getting-started/setup-guide/embedding-the-feedback-form.md" class="button primary" data-icon="code">Installation instructions</a>

## Configuration

To customize the appearance of your embedded portal, go to **Workspace > Settings > Form**.

The form embed settings allow you to tailor the look and feel of the form to match your brand or audience. From the right-hand sidebar, you are able to change the title and subtitle, placeholder, color scheme, locale and more.

Alternatively you can use the form properties below to specify the configuration via code.&#x20;

### Overwriting the UI settings

You can overwrite the configured styles and settings of the form embed by adding custom properties to the embed code. This allows for customizing the styling when embedding the form in different locations.

{% hint style="info" %}
When a setting is configured via the properties below, it can no longer be customized via the UI settings.&#x20;
{% endhint %}

The properties are specified as attributes within the `<released-form>` custom HTML element.

### **Form Properties**&#x20;

The following customization options are available for the form embed.

<table data-header-hidden data-full-width="false"><thead><tr><th width="208">Property</th><th>Description</th></tr></thead><tbody><tr><td><code>form-id</code></td><td>The ID of the feedback form to embed.</td></tr><tr><td><code>title</code></td><td>The title of the form.</td></tr><tr><td><code>sub-title</code></td><td>The subtitle of the form.</td></tr><tr><td><code>placeholder</code></td><td>The placeholder text shown in the form.</td></tr><tr><td><code>position</code></td><td>The position of the form if shown in a dialog. Can be <code>top-left</code>, <code>top-right</code>, <code>bottom-right</code>, or <code>bottom-left</code>.</td></tr><tr><td><code>dialog</code></td><td>Whether the form will be shown in a dialog <code>true</code> or inline <code>false</code>.</td></tr><tr><td><code>color-scheme</code></td><td>The color scheme to use for the widget. Can be <code>system</code>, <code>dark</code>, or <code>light</code>. See <a data-mention href="../../../resources/how-tos/configuring-dark-mode.md">configuring-dark-mode.md</a> for more details.</td></tr><tr><td><code>locale</code></td><td><p>The locale to use for the page. Can be:</p><p></p><ul><li><code>en</code> 🇺🇸 American English</li><li><code>de</code> 🇩🇪 German</li><li><code>fr</code> 🇫🇷 French</li><li><code>es</code> 🇪🇸 Spanish</li><li><code>pt</code> 🇵🇹 Portuguese</li><li><code>nl</code> 🇳🇱 Dutch</li><li><code>zh</code>  🇨🇳 Chinese</li></ul></td></tr></tbody></table>

### Data Attributes

Setting data attributes can be helpful to prevent unwanted interactions with 3rd party libraries. For example, to prevent scrolling issues when the [Lenis](https://lenis.studiofreight.com/) library is used, you can add the `data-lenis-prevent` attribute to the host container.&#x20;

**Example:**&#x20;

```html
<released-form form-id="FORM_ID" data-lenis-prevent=""></released-form>
```

### Default values

The following default values are applied in case a property is not explicitly defined.&#x20;

<pre class="language-html"><code class="lang-html">&#x3C;released-form form-id="FORM_ID" 
  title="Give feedback"
  sub-title="Please tell us the story behind your idea or issue. Instead of “add a blue button”, tell us why you need it. What problem is it solving for you."
  placeholder="Describe your problem…"
  dialog="false"
<strong>  color-scheme="system"
</strong>>&#x3C;/released-widget>
</code></pre>

