# Permissions

<figure><img src=".gitbook/assets/Workspace - Access.png" alt=""><figcaption><p>Limit access to your workspace</p></figcaption></figure>

## Overview

Released integrates tightly with your project permission in Jira, removing the burden of setting up additional roles or access controls to draft and publish release notes.

## Global permissions&#x20;

### Access global permissions

In the Jira top navigation:&#x20;

* Select ⚙ > **System**.
* Click **Global Permissions**.

### Released administrator&#x20;

Released administrators are able to configure and adjust global settings in Released, such as [Product Hub details](global-settings/general.md), [internal domains](global-settings/internal-domains.md), or [user verification](global-settings/user-verification.md).&#x20;

{% hint style="warning" %}
By default, all Jira users are granted the **Released: Administrator** permission. To restrict access, you can modify permission in the Global Permissions settings.&#x20;

Read more about Global Permissions in the [Jira documentation](https://support.atlassian.com/jira-cloud-administration/docs/manage-global-permissions/).
{% endhint %}

## Workspace permissions

A workspace currently has two access types.&#x20;

### Open

Everyone with access to the Jira site can view the workspace and edit the changelog.&#x20;

### **Restricted**

To access a portal, users will require **Edit issue** permission in one of the linked projects. See the [Jira documentation](https://confluence.atlassian.com/adminjiraserver/managing-project-permissions-938847145.html) to learn more about Jira project permissions.&#x20;

{% hint style="warning" %}
If multiple projects are linked to a portal and the user only has access to one of them, they will only be able to view issues from projects they have access within the portal.
{% endhint %}
