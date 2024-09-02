# Permissions

<figure><img src="../../.gitbook/assets/Permissions - Header.png" alt=""><figcaption><p>Limit access to your Space</p></figcaption></figure>

## Overview

Released integrates tightly with your project permission in Jira, removing the burden of setting up additional roles or access controls to draft and publish release notes.&#x20;

## Basics

### Access types

A Space can be either:

* **Open**, everyone with access to the Jira site can view and edit content in the Space.&#x20;
* **Restricted**, only users with access to the linked Jira project(s) can view and edit content in this space, depending on their level of access in the Jira project(s).&#x20;

### Required Jira project permissions

To access a space, users will require **Edit issue** permission in one of the linked projects.

{% hint style="warning" %}
If multiple projects are linked to a Space and the user only has access to one of them, they will only be able to view issues from projects they have access within the space.&#x20;
{% endhint %}

<table><thead><tr><th width="219">Permission</th><th>Required for</th></tr></thead><tbody><tr><td><strong>Edit issues</strong></td><td>Editing and publishing a post. </td></tr></tbody></table>

### Required Jira admin permissions

To install Released and setup the Changelog description custom field, certain administrator permissions are required.&#x20;

<table><thead><tr><th width="219">Permission</th><th>Required for</th></tr></thead><tbody><tr><td><strong>Administer projects</strong></td><td>Setting up the <strong>Changelog description</strong> custom field.</td></tr><tr><td><strong>Jira administrators</strong></td><td>Installing the Released App.</td></tr></tbody></table>
