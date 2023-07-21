---
description: Add Release Notes to your Scroll Viewport help centre.
---

# Scroll Viewport

## Integrating Released with Scroll Viewport

Released now integrates with Scroll Viewport through their [custom JavaScript inject ](https://help.k15t.com/scroll-viewport/inject-custom-javascript)functionality. Setting up this integration is a breeze and requires just a few simple steps, taking less than 5 minutes to complete.

### 1. Create a placeholder page in Confluence&#x20;

* Create a page where you want the release notes to appear in your Viewport documentation.&#x20;
* Give the page your preferred name, e.g. "Release Notes".&#x20;
* Leave the page empty and save.&#x20;

### 2. Note down the page ID

* Note down the **page ID** from the URL

<figure><img src="../.gitbook/assets/Confluence PageID.png" alt=""><figcaption><p>Note down the Confluence page ID from the URL</p></figcaption></figure>

### 3. Note down the channel ID for the announcement page&#x20;

Navigate to the Released settings in your Jira project and locate the channel ID in the embed code of the [announcement-page.md](../product-tour/settings/announcement-page.md "mention") settings.&#x20;

* Note down the **channel ID** from the embed code.

<figure><img src="../.gitbook/assets/Page Channel ID.png" alt=""><figcaption><p>Note down the channel ID highlighted in the embed code</p></figcaption></figure>

### 4. Add the custom JavaScript snippet to your Viewport theme&#x20;

In your Viewport theme settings, [inject the following JavaScript](https://help.k15t.com/scroll-viewport/inject-custom-javascript).&#x20;

{% hint style="warning" %}
Ensure you replace the **Page\_ID** and **CHANNEL\_ID** placeholders with the IDs noted in the previous steps.&#x20;
{% endhint %}

```javascript
if (vp.source.confluencePageId === "PAGE_ID") {
  vp.loadScript('https://embed.released.so/1/embed.js').then(() => {
    document.getElementById("content").innerHTML = '<released-page channel-id="CHANNEL_ID" color-scheme="light"></released-page>'
  });
}
```

To customize the look and feel of your release page, you can add additional parameters to the `<release-page>` tag in the above snippet. For more details see the [announcement-page.md](../product-tour/settings/announcement-page.md "mention") documentation.&#x20;

Lastly, save the changes to your theme. \


### Congratulations, you're done 🎉

New posts published with Released will now automatically appear in your Viewport help centre.&#x20;
