---
description: Add Release Notes to your Scroll Sites help centre.
---

# Scroll Sites for Confluence

[Scroll Sites](https://marketplace.atlassian.com/apps/1211636/scroll-viewport-for-confluence?tab=overview\&hosting=cloud) is an Atlassian marketplace app by K15t that allows you to transform your documentation in Confluence into a public or restricted online help center for your users.&#x20;

Released now integrates with Scroll Sites through their [custom JavaScript inject](https://help.k15t.com/scroll-viewport/inject-custom-javascript) feature. Setting up this integration is a breeze and requires just a few simple steps, taking less than 5 minutes to complete.

## Installation&#x20;

{% stepper %}
{% step %}
**Get the Released Channel ID**

[Find the channel ID](../../resources/how-tos/finding-the-channel-id.md) for the announcement page and note it down.&#x20;
{% endstep %}

{% step %}
**Create a placeholder page in Confluence**&#x20;

* Create a page where you want the release notes to appear in your Sites documentation.&#x20;
* Give the page your preferred name, e.g. "Release Notes".&#x20;
* Leave the page empty and save.&#x20;
{% endstep %}

{% step %}
**Get the Confluence Page ID**

Note down the Confluence **Page ID** from the URL (see screenshot below).

<figure><img src="../../.gitbook/assets/Confluence PageID.png" alt=""><figcaption><p>Note down the Confluence page ID from the URL</p></figcaption></figure>
{% endstep %}

{% step %}
**Add the custom JavaScript snippet to your Sites theme**

1. Navigate to your Sites theme settings.
2. [Inject the following JavaScript](https://help.k15t.com/scroll-viewport/inject-custom-javascript).&#x20;

```javascript
(function () {
  /* ----- SCRIPT CONFIGURATION -----
   * Add your Page IDs here with the matching channel ID and which modules you want to show.
   */
  const PAGE_MAPPINGS = {
    "663257133": { // Confluence pageId
      channelId: "5cca688e-d54f-4819-ae29-3b8775bc306a", // Released channelId
      modules: "" //roadmap, changelog or empty for both
    } 
  };
 // ----- SCRIPT CONFIGURATION -----*/

  const SCRIPT_URL = "https://embed.released.so/1/embed.js";
  const MARKER_ID = "released-embed-root";

  // ----- LOGIC -----
  const currentPageId =
    document.documentElement.dataset.confluenceContentId ||
    (window.vp && vp.source && vp.source.confluencePageId);

  const config = PAGE_MAPPINGS[String(currentPageId)];

  if (!currentPageId || !config) return;

  function injectRoadmap() {
    if (document.getElementById(MARKER_ID)) return;

    // We target the article container to keep the header visible
    const article = document.querySelector("#content.fb-layout-container");
    const articleBody = document.querySelector(".article-body");
    
    if (!article || !articleBody) return;

    // 1. Build the custom element tag
    const moduleAttr = config.modules ? ` modules="${config.modules}"` : "";
    const embedHtml = `<released-page channel-id="${config.channelId}"${moduleAttr}></released-page>`;

    // 2. Hide only the restricted body and the TOC
    articleBody.style.display = 'none';
    const toc = document.querySelector('.toc');
    if (toc) toc.style.display = 'none';

    // 3. Create wrapper
    const wrapper = document.createElement("div");
    wrapper.id = MARKER_ID;
    wrapper.style.width = "100%";
    wrapper.style.display = "block";
    wrapper.innerHTML = embedHtml;
    
    // 4. Inject into the article container
    // This keeps it below the original <header> but replaces the body
    article.appendChild(wrapper);

    // 5. Load the Released script
    if (window.vp && typeof vp.loadScript === "function") {
      vp.loadScript(SCRIPT_URL);
    } else {
      const script = document.createElement("script");
      script.src = SCRIPT_URL;
      document.head.appendChild(script);
    }
  }

  const check = setInterval(() => {
    if (document.querySelector("#content.fb-layout-container") && document.querySelector(".article-body")) {
      injectRoadmap();
      clearInterval(check);
    }
  }, 100);
})();
```

{% hint style="info" %}
Ensure you replace the **Page\_ID** and **CHANNEL\_ID** placeholders with the IDs noted in the previous steps.&#x20;
{% endhint %}
{% endstep %}

{% step %}
**Add the custom CSS snippet to your Sites theme**

To override the standard width of the knowledge base theme and enable full-page width for roadmaps, add the following CSS styles:

```css
/* Selector with Confluence pageID to apply the styles only to those pages.  */
html[data-confluence-content-id="663257133"]{

    --_content-width: 100% !important;
    --theme-container-width: 100% !important;

    & .article-page .main-content {
        display: block !important; 
        width: 100% !important;
        max-width: 100% !important;
        padding-inline: 40px !important; 
    }

    & #released-embed-root {
        display: block !important;
        width: 100% !important;
        min-height: 800px;
    }

    & .footer {
        display: flex !important;
        clear: both !important;
    }
}
```
{% endstep %}

{% step %}
**Save changes**

Click save, and you're done! :tada:
{% endstep %}
{% endstepper %}

## Instructions for Scroll Viewport Sites

**Add the custom JavaScript snippet to your Viewport theme**

1. Navigate to your Sites theme settings.
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



**Congratulations, you're done 🎉**

New posts published with Released will now automatically appear in your Sites help centre.&#x20;
