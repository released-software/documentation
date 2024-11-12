# Access

<figure><img src="../../.gitbook/assets/Permissions - Header.png" alt=""><figcaption><p>Limit access to your portal</p></figcaption></figure>

## Overview

The access settings allow you to control who can create, publish and view content in the portals.&#x20;

## Visibility

A portal will always be accessible via it's Portal URL, which is the canonical destination to view the portals content. However, who can access the portal can be controlled with the settings below. \
\
With the visibility setting you can further control whether the portal will be listed on the Product Hub or whether it's only reachable directly via the portal URL.&#x20;

## Creator access

Content creation and publishing are restricted to users who have access to the linked Jira projects.

Available access levels are:

* **Open**, everyone with access to the Jira site can view and edit content in the portal.&#x20;
* **Restricted**, only users with access to the linked Jira project(s) can view and edit content in this portal, depending on their level of access in the Jira project(s).&#x20;

If a portal is linked to multiple Jira projects, users must have access to at least one of those projects to access the portal.

{% hint style="warning" %}
Users will only be able to see issues and fields for which they have the necessary permissions.
{% endhint %}

## Viewer access

Viewer access determines who can view the portal on the Product Hub or when it’s embedded in a website or app.&#x20;

To grant access,  select one of the three available access levels.

<figure><img src="../../.gitbook/assets/Portals - Access level.png" alt="" width="375"><figcaption><p>Access levels</p></figcaption></figure>

### Private&#x20;

Access to the portal is limited to users within your organization.&#x20;

<table data-header-hidden><thead><tr><th width="245"></th><th></th></tr></thead><tbody><tr><td><strong>Creator access</strong></td><td>Everyone with creator access also has viewer access to the portal. </td></tr><tr><td><strong>Company domain</strong></td><td>Anyone with a company email address can access the portal. </td></tr></tbody></table>

{% hint style="info" %}
Best for stakeholder / internal communication.
{% endhint %}

### Restricted

Access to the portal is available to authorized users outside your organization.

<table data-header-hidden><thead><tr><th width="244"></th><th></th></tr></thead><tbody><tr><td><strong>Customers</strong></td><td>Anyone who has been identified via SSO or the client side SDK can access the portal.</td></tr><tr><td><strong>Allowed email domains</strong></td><td>Anyone with an email address at these domains can access the portal.</td></tr><tr><td><strong>Individuals</strong></td><td>The portal is accessible to individuals with the following email addresses.</td></tr></tbody></table>

{% hint style="info" %}
Best for restricted communication with a small number of select customers.&#x20;
{% endhint %}

### Public

Access to the portal is open to the public. Everyone with a direct link to the portal will be able to access it, even if not listed on the Product Hub.&#x20;

{% hint style="info" %}
Best for public release notes embedded on your website or app.
{% endhint %}
