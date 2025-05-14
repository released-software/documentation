---
description: Add Release Notes to your Scroll Viewport help centre.
---

# Scroll Viewport for Confluence

[Scroll Viewport](https://marketplace.atlassian.com/apps/1211636/scroll-viewport-for-confluence?tab=overview\&hosting=cloud) is an Atlassian marketplace app by K15t that allows you to transform your documentation in Confluence into a public or restricted online help center for your users.&#x20;

Released now integrates with Scroll Viewport through their [custom JavaScript inject ](https://help.k15t.com/scroll-viewport/inject-custom-javascript)feature. Setting up this integration is a breeze and requires just a few simple steps, taking less than 5 minutes to complete.

## Installation&#x20;

{% stepper %}
{% step %}
#### Get the Released Channel ID

[Find the channel ID](../../resources/how-tos/finding-the-channel-id.md) for the announcement page and note it down.&#x20;
{% endstep %}

{% step %}
#### Create a placeholder page in Confluence&#x20;

* Create a page where you want the release notes to appear in your Viewport documentation.&#x20;
* Give the page your preferred name, e.g. "Release Notes".&#x20;
* Leave the page empty and save.&#x20;
{% endstep %}

{% step %}
#### Get the Confluence Page ID

Note down the Confluence **Page ID** from the URL (see screenshot below).

<figure><img src="../../.gitbook/assets/Confluence PageID.png" alt=""><figcaption><p>Note down the Confluence page ID from the URL</p></figcaption></figure>
{% endstep %}

{% step %}
#### Add the custom JavaScript snippet to your Viewport theme

1. Navigate to your Viewport theme settings.
2. [Inject the following JavaScript](https://help.k15t.com/scroll-viewport/inject-custom-javascript).&#x20;

```javascript
if (vp.source.confluencePageId === "PAGE_ID") {
  vp.loadScript('https://embed.released.so/1/embed.js').then(() => {
    document.getElementById("article-content").innerHTML = '<released-page channel-id="CHANNEL_ID" color-scheme="light" color-scheme="light" top-offset="80px" color-primary="#FFF"></released-page>'
  });
}
```

{% hint style="info" %}
Ensure you replace the **Page\_ID** and **CHANNEL\_ID** placeholders with the IDs noted in the previous steps.&#x20;
{% endhint %}
{% endstep %}

{% step %}
#### Save changes

Click save, and you're done! :tada:
{% endstep %}
{% endstepper %}

## Optional style fine-tuning&#x20;

By default, Scroll Viewport adds a 10cm padding at the top of the page. To remove the padding on your release page, you can inject the following CSS in the theme settings:

{% hint style="warning" %}
The below code most be added into the **Custom CSS** section. **Not** in the Custom JavaScript section where we added the above code.&#x20;
{% endhint %}

```css
#article-content:has(> released-page)
{
    padding-top:0px;
    grid-template-columns:1fr;
}
```



**Congratulations, you're done 🎉**

New posts published with Released will now automatically appear in your Viewport help centre.&#x20;
