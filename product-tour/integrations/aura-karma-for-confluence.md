---
description: Add Release Notes to Confluence with Aura and Karma
---

# Aura / Karma for Confluence

[Aura ](https://marketplace.atlassian.com/apps/1221974/aura-content-formatting-macros-tabs-miro-figma-google-html?hosting=cloud\&tab=overview)is the top rated formatting app that allows users to create visually appealing and engaging content in Confluence with a suite of intuitive macros, highlighting important content, providing intuitive navigation, and enhancing readability.

Additionally, Aura offers a free expansion called [Karma](https://marketplace.atlassian.com/apps/1228839/karma-confluence-page-builder-content-formatting-free?hosting=cloud\&tab=overview), which is a simple WYSIWYG page builder that enables users to create engaging Confluence pages quickly using various templates.

## Integrating Released with Aura / Karma

Released is supported natively through [Aura Embed](https://appanvil.atlassian.net/wiki/spaces/AC/pages/2763784238/Aura+Embed+Cloud), making it a breeze to display your announcement page in Confluence. Set-up takes less than 60 seconds.

### Prerequisite&#x20;

* [ ] You must have Aura installed in your Confluence instance.&#x20;
* [ ] [Find the channel ID](../../getting-started/setup-guide/finding-the-channel-id.md) for the announcement page and note it down.&#x20;

### 1. Create page with Aura macro

* Create a Confluence page where you want your release notes to show up.&#x20;
* Add the "Aura - Embed" macro to the page.&#x20;

<figure><img src="../../.gitbook/assets/Aura Embed.png" alt=""><figcaption><p>Adding the Aura Embed macro to a Confluence page</p></figcaption></figure>

### 2. Select Released

* In the "Type" dropdown, select **Released** within the "Collaboration" section.

<figure><img src="../../.gitbook/assets/Aura Type Select.png" alt=""><figcaption><p>Select Released in the Type Dropdown</p></figcaption></figure>

### 3. Enter the Channel ID

* Enter the [Channel ID](../../getting-started/setup-guide/finding-the-channel-id.md) into the "Released URL" field - your release notes should render in the preview on the right once entered.&#x20;
* Press "Save"

### 4. Publish the page

* Click "Publish" in the top-right to publish the Confluence page.&#x20;

\
**Congratulations, you're done 🎉**

New posts published to the [Announcement Page channel](../posts/publishing.md#announcement-page) in Released will now automatically appear in Confluence.&#x20;

