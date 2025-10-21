---
icon: gear
---

# Settings

## Enabling feedback

Navigate to **Workspace >** **Settings > Feedback** to access the feedback settings.&#x20;

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

Feedback can be shown on related Jira items. How it's being displayed differs between Jira and JIra Product Discovery.&#x20;

### Software projects

Feedback is displayed in a “Feedback” panel, where individual feedback items can be reviewed. Additionally, a global “Feedback count” field tracks how many customers gave feedback.&#x20;

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

## Wishlist

### Show count

Configure whether the wish count is shown on roadmaps in the portal.&#x20;

Wishes are unique per user. If a user wishes for the same work item across multiple portals, it is counted only once.

{% hint style="info" %}
For internal use, you can share wish counts with your team or stakeholders. We recommend keeping counts hidden from customers to avoid influencing their choices.
{% endhint %}

### Maximum wishes per user

Set a limit on how many active wishes each customer can have at one time. When a user reaches the limit, they’ll need to remove an existing wish before adding a new one. This helps ensure every wish reflects a real priority, not a list of every possible idea.

{% hint style="info" %}
The wish limit applies across all roadmaps within the same portal.
{% endhint %}

### Wish count field&#x20;

The wish count is stored in a read only custom field against every work item. Add the wish count field to your projects to filter and sort work items by wish count.

{% tabs %}
{% tab title="Team-managed projects" %}
{% hint style="warning" %}
You must have the administrator role to configure work item types in team-managed projects. [Learn more about team-managed project roles](https://confluence.atlassian.com/jirasoftwarecloud/manage-how-people-access-your-next-gen-project-982321983.html).
{% endhint %}

To add the field to your work item types:

1. In the project sidebar, click **Project settings** > **Fields**.
2. Search for **Wish count**.&#x20;
   1. If the field is not available, click the **Add field** button.
   2. Select the **Wish count** field from the list.
   3. Click the **Add 1 field** button.
3. Use the **Work types** dropdown to select the work types where you want to add the field.
4. Search for the **Wish count** field in the fields sidebar on the right.
5. Drag the **Wish count** field into the context fields section.&#x20;
6. Click **Save changes**.

Repeat these steps for each work item type in your project.&#x20;

For more detail see: [Customize a work item's fields in team-managed projects](https://support.atlassian.com/jira-software-cloud/docs/customize-an-issues-fields-in-team-managed-projects/).&#x20;
{% endtab %}

{% tab title="Company-managed projects" %}
{% hint style="warning" %}
You must have the Jira administrator [global permission](https://confluence.atlassian.com/adminjiracloud/managing-global-permissions-776636359.html) to configure work item screens in company-managed projects.
{% endhint %}

You can control which screens a custom field will appear on when a work item is created, edited, or transitioned through workflow.&#x20;

To change which screens a custom field is associated with, refer to the Jira [configure work items documentation](https://support.atlassian.com/jira-cloud-administration/docs/configure-issues-to-track-individual-pieces-of-work/).&#x20;
{% endtab %}
{% endtabs %}

#### Configuring wish count in Jira Product Discovery

Jira Product Discovery currently does not support custom fields. Because of this limitation, the wish count field cannot be displayed directly in Jira Product Discovery spaces. However, you can create a _Number_ field within your Jira Product Discovery project and use it to store and display the wish count value.

{% stepper %}
{% step %}
#### Configure a number field in Jira Product Discovery

We suggest to name the field _Wish count_ for consistency, but you can give it any name you want.&#x20;
{% endstep %}

{% step %}
#### Select the field in the feedback settings

Navigate to **Workspace >** **Settings > Feedback** and select the number field for your JPD project in the Wishlist section.&#x20;
{% endstep %}
{% endstepper %}
