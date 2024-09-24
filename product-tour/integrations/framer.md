---
description: Add Release Notes to your Framer website in minutes.
---

# Framer

Framer let's you design websites on a freeform canvas. Add animations, interactions and a CMS.&#x20;

With **Released + Framer**, you can seamlessly embed a widget or announcement page into your website.&#x20;

This section assumed you are familiar with Framer's code components. If you are new to code components, we recommend you read this page first: [https://www.framer.com/learn/code-components/](https://www.framer.com/learn/code-components/)

### Prerequisite&#x20;

* [ ] [Find the channel ID](../../how-tos/finding-the-channel-id.md) for the announcement page and note it down.&#x20;

### 1. Adding the embed code

Copy the following code snippet into the `<head>` element of your page.&#x20;

1. Click on the ⚙️ icon in the top right of the header in Framer.&#x20;
2. Click on **General**.
3. Scroll down to the **Custom Code** section.&#x20;
4. Insert the following code in the **End of \<head> tag** panel.&#x20;

```html
<script src="https://embed.released.so/1/embed.js"></script>
```

### 2. Adding the announcement page component

We have created a announcement page component that you can copy and paste into your Framer design view. Simply select the layer where you want to insert the announcement page and paste the URL below into the layer.&#x20;

```url
https://framer.com/m/Announcement-page-eOYM.js@Z0mbpA8Z50VzS62QH9dz
```

The component supports a number of properties that can be configured via the UI to adjust the look and feel.&#x20;

The only mandatory field is the announcement page [Channel Id](../../how-tos/finding-the-channel-id.md).&#x20;

<figure><img src="../../.gitbook/assets/Framer Component UI.png" alt=""><figcaption><p>Properties of the ReleasedPage Webflow Component</p></figcaption></figure>

{% hint style="info" %}
Since the release notes are loaded dynamically, you will need to **publish** the site in order to preview the changes.&#x20;
{% endhint %}

### 3. Adding the badge component

To notify users about the availability of a new post, you can enhance the user experience by incorporating a notification badge on the link or button leading to the announcement page.&#x20;

<figure><img src="../../.gitbook/assets/Badge.png" alt="" width="375"><figcaption><p>Add a notification badge to a link or a button.</p></figcaption></figure>

Similar to the Page component, Released provides a Badge component that you can copy and paste into your Framer design view.&#x20;

```url
https://framer.com/m/Released-badge-UvAC.js@DtpmL9J2ZjCuvy77OuXw
```

After adding the component next to your navigation link or button, you will have to enter the [Channel Id](../../how-tos/finding-the-channel-id.md) for the badge in the properties panel.&#x20;

{% hint style="info" %}
The Channel ID for the Badge and the Page are identical.&#x20;
{% endhint %}

Lastly, you may have to [adjust the positioning of the badge](../settings/announcement-page.md#adjusting-the-position-of-the-badge) using CSS added to the [Custom Code](framer.md#adding-the-embed-code) section.&#x20;

