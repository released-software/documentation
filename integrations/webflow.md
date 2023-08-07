---
description: Add Release Notes to your Webflow website in minutes.
---

# Webflow

Webflow lets you create professional, custom websites in a completely visual canvas with no code.&#x20;

With **Released + Webflow**, you can seamlessly embed a widget or announcement page into your website.&#x20;

## Prerequisite&#x20;

If you aren't familiar with Webflow's custom code embed feature, we recommend you watch this their tutorial first: [https://university.webflow.com/lesson/custom-code-embed](https://university.webflow.com/lesson/custom-code-embed)

## Get the embed code from Released

1. Follow the [installation instructions](../product-tour/settings/announcement-page.md#installation) to get the embed code within Released.
2. Take note of the `<script>` and the `<released-page>` tags. You will require those snippets in the next step.&#x20;

## Adding the announcement page

In your Webflow interface.&#x20;

1. Click on the ﹢ icon in the top left or simply click `a` to open the **Add elements** panel.
2. Scroll to the **Advanced** section and click the **Embed** element.
3. Copy the code snippets from above into the dialog.&#x20;
4. Click **Save & Close**. The element has now been added.&#x20;
5. Move it to the section of the page where you want to display the announcement page.&#x20;

## Adding the notification badge



<figure><img src="../.gitbook/assets/Badge.png" alt="" width="375"><figcaption><p>Add a notification badge to a link or a button.</p></figcaption></figure>

{% hint style="info" %}
To add a notification badge, we recommend to add the `<script>` tag in the site's `<head>`tag  instead of in the **Embed** block to ensure it's available on every page. \
\
[https://university.webflow.com/lesson/custom-code-in-the-head-and-body-tags#custom-code-in-page-settings](https://university.webflow.com/lesson/custom-code-in-the-head-and-body-tags#custom-code-in-page-settings)
{% endhint %}

Similar to adding the announcement page, you can add the notification badge via the embed element.&#x20;

* Click on the ﹢ icon in the top left or simply click `a` to open the **Add elements** panel.
* Scroll to the **Advanced** section and click the **Embed** element.
* Copy the code snippets from above into the dialog.&#x20;
* Click **Save & Close**. The element has now been added.&#x20;
* Move the element next to the link or button where you want to show the badge. Typically in the navigation.&#x20;
* Use the **2D & 3D transforms** settings to adjust the position of the badge&#x20;

<figure><img src="../.gitbook/assets/Transform Settings.png" alt="" width="375"><figcaption><p>Adjust the position of the badge with the element's transform settings.</p></figcaption></figure>



## Video tutorial

Watch a 90 seconds walk through on how to add your release notes to your Webflow site.&#x20;

{% embed url="https://youtu.be/Ll1hArmqOAg" %}

