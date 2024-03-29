---
description: Manage your release notes settings
---

# General

<figure><img src="../../.gitbook/assets/Settings General - Header.png" alt=""><figcaption><p>General Settings</p></figcaption></figure>

## Basics

### Changelog page

#### Space name

Customize the name of your Space. Make sure the name is descriptive and clearly identifies what updates you are aiming to communicate. This name is **only used internally** and doesn't show on the portal or embedded pages or widgets.&#x20;

### Linked projects

Spaces are tightly interwoven with Projects. For that reason, each Space must have at least one linked project, but can also be linked to multiple projects.&#x20;

But linked projects provide more than a simple link to projects. They determine:&#x20;

* Access rights to the Space, if restricted (see below)
* Default projects used for filters&#x20;
* Which projects the Space's changelog will be displayed in

{% hint style="info" %}
If a project administrator does not have view permission for a previously added project, the project name will be obfuscated.
{% endhint %}

### Access&#x20;

A Space can be either:

* **Open**, everyone with access to the Jira site can view and edit content in the Space.&#x20;
* **Restricted**, only users with access to the linked Jira project(s) can view and edit content in this space, depending on their level of access in the Jira project(s).&#x20;

For more details on access and the required Jira permissions. See the [Permissions](permissions.md) guide.

### Delete Space

Deleting this Space will move it to the trash. It will be permanently removed after 30 days.&#x20;

<figure><img src="../../.gitbook/assets/Trash - Header.png" alt=""><figcaption></figcaption></figure>

Jira admins can restore or permanently delete a Space from the trash via the App settings:&#x20;

* Click on the global settings (⚙ in the Jira navigation bar) a click on **Apps**.
* In the left navigation, find the Released section and click on **Trash**.
* To restore a space, click the **Restore** icon.

\
