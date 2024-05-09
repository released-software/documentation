---
description: Communicate high level plans with your stakeholders and customers.
---

# Roadmaps (private beta)

{% @arcade/embed flowId="VYxBoLsWUIhHkOn97jDM" url="https://app.arcade.software/share/VYxBoLsWUIhHkOn97jDM" fullWidth="false" %}

## Overview

Create internal or customer facing roadmaps, straight from your Jira issues. Expose as many or as few fields, and create a custom description that best describes your plans. Since all the data is stored on the issue, your roadmap will always be up to date.

## Pre-requisite

To use the roadmaps feature in your Jira instance, please [install the Released app](../getting-started/installing-the-app.md).

## Basics

### Enabling roadmaps&#x20;

While in private beta, Roadmaps are being rolled out progressively to customers on the waitlist.&#x20;

Once your spot becomes available, an email containing a link to activate roadmaps for your instance will be sent to you. Simply switch on the feature, and it will become available across all your spaces.

<figure><img src="../.gitbook/assets/Roadmaps labs.png" alt=""><figcaption><p>Enabling the Roadmaps beta</p></figcaption></figure>

### Creating a roadmap view

Creating a roadmap view only takes a couple of minutes.&#x20;

1. Select **Roadmap** in the sidebar navigation and click on the "Create roadmap" button.&#x20;
2. Select a field to create your board columns.&#x20;
3. Create your preferred column layout and map the field options to the columns.
4. Click **Create.**

### Filters

Use filters to narrow down the issues to show on the roadmap. Use basic filters like _issue type_ or _labels_ or use JQL for more advanced filtering&#x20;

{% hint style="warning" %}
**Beta limitation**&#x20;

The board is limited to 100 cards during the early beta. We will increase that limit in the coming weeks. &#x20;
{% endhint %}

<figure><img src="../.gitbook/assets/Roadmaps - Filter.png" alt=""><figcaption><p>Use JQL to create an advanced filter.</p></figcaption></figure>

### Publishing

{% hint style="warning" %}
**Beta limitation**

The roadmap can only be published to the [page embed](settings/announcement-page.md) view at this stage. See the [installation instruction](settings/announcement-page.md#installation) on how to embed the roadmap in your website or app.
{% endhint %}

To publish your roadmap, click the **Publish** button located in the top right corner. This action will publish the roadmap in its current state.

Currently, the following fields are displayed:

* **Summary** - the title of the idea
* **Public description** - an internal field that can be edited inline on the roadmap
* **Status** - the column status

Support for more fields will be added throughout the beta period.&#x20;

Once a roadmap has been published, a switch will appear on the page embed. Allowing you to navigate between the Changelog and the Roadmap.&#x20;

<div data-full-width="false">

<figure><img src="../.gitbook/assets/Embed Roadmap Switch.png" alt="" width="375"><figcaption><p>Switch between changelog and roadmap.</p></figcaption></figure>

</div>



### Unpublish

To unpublish the roadmap view, simply press the unpublish icon right next to the publish button. Your roadmap will be immediately unavailable on the page embed.&#x20;
