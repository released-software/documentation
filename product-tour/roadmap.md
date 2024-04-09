---
description: Communicate high level plans with your stakeholders and customers.
---

# Roadmaps (private beta)

<figure><img src="../.gitbook/assets/Roadmap - Header.png" alt=""><figcaption><p>Organize and share your plans with Roadmaps</p></figcaption></figure>

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
2. Select the projects you want to source issues from.&#x20;
3. Create your preferred column layout and map the roadmap states to the columns.
4. Click **Create.**

{% hint style="warning" %}
**Beta limitation**&#x20;

* Only **Jira Product Discovery** projects are supported right now.
* You must have a custom status called **"Roadmap"** of type **Select field**. This status is automatically created when you create a project with the "Product discovery" template, but will not exist in a "Blank project". &#x20;

Please see the Jira Product Discovery documentation on how to [create a custom field](https://support.atlassian.com/jira-product-discovery/docs/create-and-manage-custom-fields/).
{% endhint %}

### Publishing

{% hint style="warning" %}
**Beta limitation**

The roadmap can only be published to the [page embed](settings/announcement-page.md) view at this stage.&#x20;
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
