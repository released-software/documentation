---
description: >-
  Learn how to configure Jira to view and edit the AI-generated descriptions
  right on your Jira ticket.
---

# Changelog Description Field (optional)

Released AI-generates descriptions for your Jira tickets based on their title and internal description. By default, the description is stored in issue properties.

To be able to view and edit the generated description on the Jira issue itself, you have the option to store the description in a custom field. To do so, add the "Changelog description" custom field to every issue type you want to include in your release notes.

### Configuring the description field&#x20;

Select the type of project that contain the issues for your release notes and follow the instructions below to set up the custom field.&#x20;

{% tabs %}
{% tab title="Team-managed projects" %}
{% hint style="warning" %}
You must have the administrator role to configure issue types in team-managed projects. [Learn more about team-managed project roles](https://confluence.atlassian.com/jirasoftwarecloud/manage-how-people-access-your-next-gen-project-982321983.html).
{% endhint %}

To add the field to your issue types:

1. In the project sidebar, click **Project settings** > **Fields**.
2. Search for **Changelog description**.&#x20;
   1. If the field is not available, click the **Add field** button.
   2. Select the **Changelog description** field from the list.
   3. Click the **Add 1 field** button.
3. Use the **Work types** dropdown to select the work types where you want to add the field.
4. Search for the **Changelog description** field in the Fields sidebar on the right.
5. Drag the **Changelog description** field into the description fields section.&#x20;
6. Click **Save changes**.

Repeat these steps for each work item type in your project.&#x20;

For more detail see: [Customize an issue's field in team-managed projects](https://support.atlassian.com/jira-software-cloud/docs/customize-an-issues-fields-in-team-managed-projects/).&#x20;
{% endtab %}

{% tab title="Company-managed projects" %}
{% hint style="warning" %}
You must have the Jira administrator [global permission](https://confluence.atlassian.com/adminjiracloud/managing-global-permissions-776636359.html) to configure issue screens in company-managed projects.
{% endhint %}

You can control which screens a custom field will appear on when an issue is created, edited, or transitioned through workflow.&#x20;

To change which screens a custom field is associated with, refer to the Jira [configure work items documentation](https://support.atlassian.com/jira-cloud-administration/docs/configure-issues-to-track-individual-pieces-of-work/).&#x20;
{% endtab %}
{% endtabs %}

