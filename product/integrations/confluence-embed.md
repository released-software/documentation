---
description: >-
  This guide will walk you through installing and configuring Released Portals
  for Confluence.
---

# Confluence Embed Macro

## Installation

{% stepper %}
{% step %}
#### Navigate to the Atlassian Marketplace

[https://marketplace.atlassian.com/apps/3830961120](https://marketplace.atlassian.com/apps/3830961120)
{% endstep %}

{% step %}
#### Install the App

* Click **Install** or **Try it free**
* Review the permissions requested by the app
* Click **Accept & install**
{% endstep %}

{% step %}
#### Verify Installation

* The app is now available in all Confluence pages
* You can start using the Released Embed macro immediately
{% endstep %}
{% endstepper %}

***

## Using the Macro

{% stepper %}
{% step %}
#### Edit a Confluence Page

* Navigate to the page where you want to embed your Released portal
* Click **Edit** in the top right
{% endstep %}

{% step %}
#### Insert the Released Embed Macro

* Type `/` to open the quick insert menu
* Type "Released" and select **Released Embed** from the list
* Or use the toolbar: Click **+** → Search for "Released Embed"
{% endstep %}

{% step %}
#### Configure the Macro

* A configuration dialog will appear
* Enter your [**Channel ID**](../../resources/how-tos/finding-the-channel-id.md) (required). Ensure you grab the channel ID from the [**Page** Embed](../portals/portal/announcement-page.md) settings in your workspace.&#x20;
* Optionally configure additional settings

| Setting           | Description                                                                                       | Required          |
| ----------------- | ------------------------------------------------------------------------------------------------- | ----------------- |
| **Channel ID**    | Your Released channel identifier. [Learn more](../../resources/how-tos/finding-the-channel-id.md) | ✅ Yes             |
| **Module**        | Choose what to display: `Changelog`, `Roadmap`, or `All`                                          | No (default: All) |
| **Show Header**   | Toggle header visibility                                                                          | No (default: Off) |
| **Primary Color** | Custom hex color code (e.g., `#6514DD`)                                                           | No                |
{% endstep %}

{% step %}
### Review the Preview



* The macro will show a preview in the editor
* If you don't have a valid Channel ID, you'll see an empty state message
{% endstep %}

{% step %}
### Save and Publish

* Click **Publish** in the top right
* Your Released portal is now live on the Confluence page
{% endstep %}
{% endstepper %}

***

## User Verification Setup

User verification enables personalized portal experiences for your Confluence users, allowing them to see content tailored to their profile and permissions.

#### Prerequisites

To enable user verification for your Confluence macro you will require your Released **Account ID** and **Shared Secret** which can be found under [#credentials](../administration/user-verification.md#credentials "mention") within the Released app in Jira.&#x20;

#### Configure in Confluence

{% stepper %}
{% step %}
#### Access Global Settings

* Click the **Settings** icon (⚙️) in Confluence
* Scroll down to **Atlassian Marketplace** section
* Click **Released Portals**
{% endstep %}

{% step %}
#### Enable User Verification

Toggle **Enable User Verification** to ON
{% endstep %}

{% step %}
#### Enter Your Credentials

* **Account ID**: Paste your Released account ID
* **Shared Secret**: Paste your shared secret

The system will automatically save and test the connection. If the connection fails, double-check your credentials
{% endstep %}

{% step %}
#### Add Trusted Domain

* After successful authentication, you'll see a **Trusted Domain Required** section
* Copy the displayed Forge domain (e.g., `https://xxxxxxxx.confluence-connect.com`)
* Add this domain to your [**Trusted Domains**](../administration/trusted-domains.md) in the Released app in Jira.&#x20;

📖 **Learn more:** [Trusted Domains Configuration](https://docs.released.so/guide/product/administration/trusted-domains)
{% endstep %}
{% endstepper %}

#### How It Works

Once configured:

1. **Automatic Authentication**
   * When a Confluence user views a page with the Released macro, they're automatically authenticated
   * No additional login required
2. **Personalized Content**
   * Users see content based on their Released.so permissions
   * Feedback submissions, upvotes, and comments are tied to their identity
3. **Profile Sync**
   * User's Confluence display name and avatar are synced to Released
   * Ensures consistent identity across platforms

#### Security Notes

* The **Shared Secret** is stored securely using Forge's encrypted storage
* User emails are only accessed when User Verification is enabled
* Data is transmitted over HTTPS to Released.so's authentication API
* Only the current user's own data is shared (no access to other users' data)

***

### Troubleshooting

<details>

<summary>Macro Doesn't Load</summary>

**Symptom:** The macro shows an empty state or doesn't display content

**Solutions:**

1. **Verify Channel ID**
   * Ensure your Channel ID is in the correct UUID format
   * Check for typos or extra spaces
   * Get the correct ID from Released.so → Settings → Integrations
2. **Check Trusted Domains**
   * Open your browser's developer console (F12)
   * Look for the warning: `[Released] If the embed does not load...`
   * Add your Confluence domain to Trusted Domains in Released.so
3. **Clear Browser Cache**
   * Hard refresh the page (Ctrl/Cmd + Shift + R)
   * Clear your browser cache and cookies

</details>

<details>

<summary>User Verification Not Working</summary>

**Symptom:** Users see "Email API access required" error

**Solutions:**

1. **Verify Credentials**
   * Go to Released Portals global settings in Confluence
   * Re-enter your Account ID and Shared Secret
   * Ensure the connection status shows "Authentication successful"
2. **Check Trusted Domains**
   * Verify the Forge domain is added to Released.so
   * The domain should match exactly (including `https://`)
3. **Email Access Permissions**
   * The app requires the `read:email-address:confluence` scope
   * This should be granted automatically during installation
   * If issues persist, try reinstalling the app

</details>

<details>

<summary>Configuration Not Saving</summary>

**Symptom:** Macro configuration doesn't persist

**Solutions:**

1. **Invalid Channel ID**
   * Ensure the Channel ID is a valid UUID format
   * The configuration dialog will show a red X if invalid
2. **Browser Issues**
   * Try a different browser
   * Disable browser extensions that might interfere
3. **Confluence Permissions**
   * Ensure you have edit permissions on the page
   * Check with your Confluence administrator

</details>

### Support

Need help? We're here for you. Contact us at [released.so/support](https://released.so/support)
