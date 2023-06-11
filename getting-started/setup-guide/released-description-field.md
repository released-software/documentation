---
description: >-
  Learn how to configure Jira to view and edit the AI-generated descriptions
  right on your Jira ticket.
---

# Released Description Field

Released AI-generates descriptions for your Jira tickets based on their title and internal description. By default, the description is stored in issue properties.

To be able to view and edit the generated description on the Jira issue itself, you have the option to store the description in a custom field. To do so, add the "Released Description" custom field to every issue type you want to include in your release notes.

### Configuring the description field&#x20;

Select the type of project that contain the issues for your release notes and follow the instructions below to set up the custom field.&#x20;

{% tabs %}
{% tab title="Team-managed projects" %}
{% hint style="warning" %}
You must have the administrator role to configure issue types in team-managed projects. [Learn more about team-managed project roles](https://confluence.atlassian.com/jirasoftwarecloud/manage-how-people-access-your-next-gen-project-982321983.html).
{% endhint %}

To add the **Released Description** field to your issue types:

1. In the project sidebar, click **Project settings** > **Issue types**.
2. Select the issue type you want to edit.
3. Search for the **Released Description** field in the Fields sidebar on the right.
4. Drag the **Released Description** field into the **Description fields** section in the middle. Jira will highlight the dropzone with a blue border.&#x20;
5. Click **Save changes**.

Repeat these steps for each issue type in your project.&#x20;

For more detail see: [Customize an issue's field in team-managed projects](https://support.atlassian.com/jira-software-cloud/docs/customize-an-issues-fields-in-team-managed-projects/).&#x20;
{% endtab %}

{% tab title="Company-managed projects" %}
{% hint style="warning" %}
You must have the Jira administrator [global permission](https://confluence.atlassian.com/adminjiracloud/managing-global-permissions-776636359.html) to configure issue screens in company-managed projects.
{% endhint %}

You can control which screens a custom field will appear on when an issue is created, edited, or transitioned through workflow. To change which screens a custom field is associated with, follow these steps:

1. Go to **Issues**.
2. Under **Fields**, click **Custom fields**.
3. Find the **Released Description** custom field and click **More** > **Associate to screens**.
4. Check the boxes next to the screens you want the custom field to appear on.
5. Click **Save**.

To add more screens or remove screens, click the custom field's **Screens** link and then click **Add or remove associated screens**.

For more details see: [Configure issue custom fields](https://support.atlassian.com/jira-cloud-administration/docs/configure-issue-custom-fields/).
{% endtab %}
{% endtabs %}

