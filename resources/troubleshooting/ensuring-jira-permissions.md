---
description: This page will help you troubleshoots errors caused by permission issues.
---

# Permissions Issues

## Overview

Released adheres to Jira permissions for viewing and editing issues. Therefore, your Jira project permission settings determine what you can do and see in Released.

{% hint style="warning" %}
**App Access Rules**

Atlassian has introduced [App Access rules](https://support.atlassian.com/security-and-access-policies/docs/block-app-access/) to manage app access to your organization’s data.\
\
If a project is hidden from Released using App Access rules, you won't be able to interact with it in Released. Add Released to your allowlist or remove it from your blocklist to use Released with your protected Jira projects.
{% endhint %}

### Required Jira project permissions

To access a portal, users will require **Edit issue** permission in one of the linked projects.

<table><thead><tr><th width="219">Permission</th><th>Required for</th></tr></thead><tbody><tr><td><strong>Edit issues</strong></td><td>Accessing and creating content in a portal.</td></tr></tbody></table>

### Required Jira admin permissions

To install Released and setup the Changelog description custom field, certain administrator permissions are required.

<table><thead><tr><th width="219">Permission</th><th>Required for</th></tr></thead><tbody><tr><td><strong>Administer projects</strong></td><td>Setting up the <strong>Changelog description</strong> custom field.</td></tr><tr><td><strong>Jira administrators</strong></td><td>Installing the Released App.</td></tr></tbody></table>

### Problem generating descriptions

When Released generates a description for you, that description is saved in one of two places:

1. In the [Changelog description field](../../getting-started/setup-guide/released-description-field.md), if the field is available on the issue type.
2. In the [Issue Entity Property](https://developer.atlassian.com/cloud/jira/platform/jira-entity-properties/), if the description custom field is not available.

Since both locations require edit permissions, you will see the message "Not permitted to save some generated descriptions" if you lack permission to edit the issue.

There are a few reasons why you might not be able to edit the issue:

1. You don't have the [Edit issues](https://support.atlassian.com/jira-cloud-administration/docs/permissions-for-company-managed-projects/#Issue-permissions) permission for that project. If this is the case, speak to the project administrator about obtaining edit access to that project.
2. Certain [workflow properties](https://support.atlassian.com/jira-cloud-administration/docs/use-workflow-properties/) in Jira can restrict the editing of issues based on their status. For instance, the `jira.issue.editable` property can be set to `false` when the issue status is `Done,`preventing edits once the issue is closed. In such cases, consider adding a additional workflow step for the "Write release notes" phase, allowing the issue to remain editable. The exact implementation depends on your specific requirements, but you might use the `jira.permission.edit.assignee` property to ensure only the assignee can edit issues in this status.
