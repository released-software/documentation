---
icon: gear
---

# Settings

## Enabling feedback

Feedback can be toggled on or off by workspace. Once enabled, users with portal access can submit feedback through the feedback form or comment directly on roadmap items.

Feedback is accessible in the [Inbox](inbox.md) and linked to its corresponding work item.&#x20;

After activation, the following feedback-related settings become available.

## Privacy

Manage permissions to control access and visibility of comments and feedback submitted through the portal. The privacy settings are useful for preventing customers from viewing each other's comments.

### Feedback visibility

<table data-header-hidden><thead><tr><th width="192.984375"></th><th></th></tr></thead><tbody><tr><td><strong>Author</strong></td><td>Only the author and workspace members can view feedback.</td></tr><tr><td><strong>Everyone</strong></td><td>Everyone with access to the portal will be able to view feedback.</td></tr></tbody></table>

### What happens when the visibility setting is changed?

When a user posts a new comment (starting a thread), it gets a permanent "visibility stamp" based on the portal's setting _at that exact moment_.

* If the portal is Public when the comment is posted, the thread gets a permanent Public stamp.
* If the portal is Private when the comment is posted, the thread gets a permanent Private stamp.

This stamp never changes from private to public, even if you change the portal's visibility setting later. I private comment will always remain private.&#x20;

**The most private setting wins**

To decide who can see a comment thread, the system looks at two things:

1. The thread's permanent stamp.
2. The portal's current visibility setting.

The most restrictive (most private) setting of the two is always applied.

<table><thead><tr><th width="161.265625">Thread's Stamp</th><th width="209.00390625">Portal's Current Setting</th><th>Final Visibility</th></tr></thead><tbody><tr><td>Public</td><td>Public</td><td>✅ Visible to Everyone</td></tr><tr><td>Public</td><td>Private</td><td>🔒 Private </td></tr><tr><td>Private</td><td>Public</td><td>🔒 Private </td></tr><tr><td>Private</td><td>Private</td><td>🔒 Private </td></tr></tbody></table>

## Showing feedback on Jira work items

Feedback can be shown on related Jira items. How it's being displayed differes between Jira and JIra Product Discovery.&#x20;

### Software projects

Feedback is displayed in a “Customers” panel, where individual feedback items can be reviewed. Additionally, a global “Customer count” field tracks how many customers gave feedback.&#x20;

#### Configuring the customer count field&#x20;

Add the customer count field to your projects to filter and sort work items by customer count.

{% tabs %}
{% tab title="Team-managed projects" %}
{% hint style="warning" %}
You must have the administrator role to configure issue types in team-managed projects. [Learn more about team-managed project roles](https://confluence.atlassian.com/jirasoftwarecloud/manage-how-people-access-your-next-gen-project-982321983.html).
{% endhint %}

To add the field to your issue types:

1. In the project sidebar, click **Project settings** > **Fields**.
2. Search for **Customer count**.&#x20;
   1. If the field is not available, click the **Add field** button.
   2. Select the **Customer count** field from the list.
   3. Click the **Add 1 field** button.
3. Use the **Work types** dropdown to select the work types where you want to add the field.
4. Search for the **Customer count** field in the Fields sidebar on the right.
5. Drag the **Customer count** field into the context fields section.&#x20;
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

### Discovery projects

Feedback is stored as insights in discovery projects. Once connected, incoming feedback will be added using the connected account below.

Before you can create insights in Jira Product Discovery, you will need to authenticate.&#x20;

{% stepper %}
{% step %}
#### Click the **Authenticate** button

Released will ask for permission to view and update content in Jira Product Discovery on your behalf.&#x20;
{% endstep %}

{% step %}
#### Select a site (optional)

If you have multiple sites, select the site you want to connect to.&#x20;
{% endstep %}

{% step %}
#### Click **Accept**
{% endstep %}
{% endstepper %}

