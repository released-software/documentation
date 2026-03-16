---
description: Capture feedback from Slack and manage the conversation in Released.
icon: slack
---

# Slack

**Available in** [<mark style="color:purple;">**Advanced edition**</mark>](https://marketplace.atlassian.com/apps/1230872?hosting=cloud\&tab=pricing)

The Slack integration lets you turn Slack messages into feedback items and reply from the Released inbox. When you respond in Released, your message is posted back to the original Slack thread so the conversation stays in sync.

<figure><img src="../../.gitbook/assets/Settings - Slack.jpeg" alt=""><figcaption></figcaption></figure>

## What you can do

#### **Capture feedback from Slack**

Turn any Slack message or thread into a feedback item in Released.

#### **Manage Slack conversations in your inbox**

Slack feedback appears in your Released inbox alongside feedback from other sources.

#### Reply from Released

Respond to Slack feedback directly from the inbox. Your reply is posted back to the original Slack thread.

#### Connect multiple workspaces

Link multiple Slack workspaces and route feedback to the appropriate Released workspace.

#### Keep conversation context

If a message is part of a thread, the thread context is preserved when the feedback is created.

## Connect Slack

{% stepper %}
{% step %}
#### Access settings

Go to Global **Settings → Slack** (under Integrations)
{% endstep %}

{% step %}
#### Connect to Slack

Click **Connect Slack** or click the **+** icon under Connections if another workspace is already connected.&#x20;
{% endstep %}

{% step %}
**Select your Slack workspace**&#x20;

Select the Slack workspace to which you want to add the integration.&#x20;
{% endstep %}

{% step %}
**Select Released workspace**

Select the Released workspace to which you want to send feedback from Slack
{% endstep %}
{% endstepper %}

## Capture feedback from Slack

Once connected, you can create feedback directly from Slack.

### Using the message menu

Using the message menu

1. Find the message in Slack
2. Open the **⋯** menu on the message
3. Select **Create Released Feedback**

The message will immediately appear in your Released inbox.

### Using the slash command

Type:

`/capture` or `/released`

in a channel or thread to capture the message as feedback.

### What gets captured

When a Slack message is captured, Released records:

* Message content
* Author
* Channel and Slack workspace
* Thread context (if applicable)
* Attachments
* Timestamp

A link to the original message in Slack is also included.

## Viewing Slack feedback in Released

Slack feedback appears in your Inbox and is marked with a Slack badge.

Opening the item shows:

* The original Slack message
* Author and channel
* Thread history (if applicable)
* A link to open the conversation in Slack

### Responding to Slack feedback

You can reply to Slack feedback directly from the Released inbox.

1. Open the feedback item
2. Write your response
3. Click **Send**

Your message will:

* Appear in Released
* Be posted to **the original Slack thread**
* Maintain the conversation context

Replies appear in Slack as messages from the **Released bot**, attributed to you.

## Permissions and access

* You can only capture messages from channels you have access to in Slack
* For private channels, the Released bot must be invited first
* Feedback from different Slack workspaces remains separate

## FAQ

<details>

<summary><strong>Do edits to Slack messages sync to Released?</strong></summary>

No. If a Slack message is edited after being captured, the feedback item does not update.

</details>

<details>

<summary><strong>What happens if a Slack message is deleted?</strong></summary>

The feedback item remains in Released, but the link back to Slack may no longer work.

</details>

<details>

<summary><strong>Can I capture messages from private channels?</strong></summary>

Yes, but the Released bot must first be invited to the channel using /invite @Released.

</details>

<details>

<summary><strong>Where do replies appear in Slack?</strong></summary>

Replies are always posted in the original Slack thread, not as new channel messages.

</details>

<details>

<summary><strong>Who appears as the sender in Slack?</strong></summary>

Messages are posted by the Released bot and attributed to the person who replied in Released.

</details>

<details>

<summary><strong>Can I edit Slack messages from Released?</strong></summary>

No. Slack messages must be edited directly in Slack.

</details>

<details>

<summary><strong>Can I connect multiple Slack workspaces?</strong></summary>

Yes. Each Slack workspace can be connected and mapped to one or more Released workspaces.

</details>

<details>

<summary><strong>What happens if I disconnect a Slack workspace?</strong></summary>

Existing feedback stays in Released, but new messages can no longer be captured and replies will stop syncing until the workspace is reconnected.

</details>
