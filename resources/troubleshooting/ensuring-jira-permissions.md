---
description: >-
  Jira permissions are powerful...and complex.
---

# Ensuring Jira permissions allow you to generate issue descriptions

When it comes to the content in your Jira issues, Released respects the permission schemes you've set up in Jira. This means
that how you configure your Jira project permissions affects what you can do in Released.

Because Released inherits the permissions of the acting user, for the most part, whatever you can do in Jira you can also do in Released.

## App Access Rules

One big exception to this is Atlassian's new [App Access rules](https://support.atlassian.com/security-and-access-policies/docs/block-app-access/). If a project is hidden from Released using App Access rules, you won't be able to interact with it in Released. Add Released to your allowlist or remove it from your blocklist to use Released with your protected Jira projects.

## Generating descriptions

When Released generates a description for you, that description is saved in one of two places:

1. If you've configured the [released-description-field.md](../../../getting-started/setup-guide/released-description-field.md "mention") for the issue, the new description is stored there.
2. If you haven't, then Released creates an [Issue Entity Property](https://developer.atlassian.com/cloud/jira/platform/jira-entity-properties/) for the issue and stores the new description there.

Because both of these locations can only be updated if you have edit permissions to the issue, you will see the message "Not permitted to save some generated descriptions" if
you don't have permission to edit the issue

There are a few reasons why you might not be able to edit the issue:

1. You don't have the Edit Issues permission for that project. If this is the case, speak to your Jira Administrator about obtaining edit access to that project.
2. Certain [Workflow properties](https://support.atlassian.com/jira-cloud-administration/docs/use-workflow-properties/) in Jira can prevent the editing of issues only when they
have a particular status in the workflow. For example, the `jira.issue.editable` property can be set to `false` and prevent you from editing the issue. If this is the case, consider
adding a new Workflow step for the "Write release notes" part of your workflow in which the issue is still editable by, for example, the Content Designer assigned to write release notes.
The exact implementation you choose depends on your own requirements, but you might set the `jira.permission.edit.assignee` property so that only the assignee may edit issues in this status.
