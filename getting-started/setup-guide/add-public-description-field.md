# Add Public Description Field

To enable AI-generated descriptions for your issues in Released, you must add the "Public Description" custom field to every issue type you want to include in your release notes.

### Configuring the description field&#x20;

{% tabs %}
{% tab title="Team-managed projects" %}
{% hint style="warning" %}
You must have the administrator role to configure issue types in team-managed projects. [Learn more about team-managed project roles](https://confluence.atlassian.com/jirasoftwarecloud/manage-how-people-access-your-next-gen-project-982321983.html).
{% endhint %}

**To add the Public Description field to your issue types:**

1. In the project sidebar, click **Project settings** > **Issue types**.
2. Select the issue type you want to edit.
3. Drag from the toolbar to the list of fields. Jira will highlight the areas where you can drop the field. We recommend to place it into the **Description fields** section.
4. Click **Save changes**.

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
3. Find the **Public Description** custom field and click **More** > **Associate to screens**.
4. Check the boxes next to the screens you want the custom field to appear on.
5. Click **Save**.

To add more screens or remove screens, click the custom field's **Screens** link and then click **Add or remove associated screens**.
{% endtab %}
{% endtabs %}

