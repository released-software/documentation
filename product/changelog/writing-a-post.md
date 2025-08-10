---
icon: pen-to-square
---

# Writing and Managing Posts

Whether you are writing an update for a single change, or a release summary for the past week. Creating a post is easy and fast with Released.&#x20;

## Creating a new post

To create a new Post,&#x20;

{% stepper %}
{% step %}
#### Create post

Click the Create post button in the top right corner of the Changelog page.
{% endstep %}

{% step %}
#### Select which work items to include

A post can include work items from one or multiple projects. If you want to add additional projects, you can configure them in the [Changelog filter](settings/changelog-filter.md) settings.
{% endstep %}

{% step %}
#### Get started

Click the **Get started** button to create a draft and start editing.
{% endstep %}
{% endstepper %}

<details>

<summary>Available filters</summary>

Select which work items you want to include in the post.&#x20;

<table><thead><tr><th width="260.5">Filter</th><th>Description</th><th data-hidden></th></tr></thead><tbody><tr><td><strong>Resolved since</strong> </td><td>Include work items resolved since a specific date.</td><td></td></tr><tr><td><strong>Version</strong></td><td>Include work items with a specific version. </td><td></td></tr><tr><td><strong>Label</strong></td><td>Include work items with a specific label.</td><td></td></tr><tr><td><strong>Work item type</strong></td><td>Include specific types of work items.</td><td></td></tr><tr><td><strong>Jira Filter</strong></td><td>Include work items that match a given <a href="https://support.atlassian.com/jira-software-cloud/docs/save-your-search-as-a-filter/">Jira filter</a>.  </td><td></td></tr></tbody></table>

{% hint style="info" %}
Choose JQL mode for even more powerful filtering options.&#x20;
{% endhint %}

</details>

## Editing a post

After creating a new post, you can start with a blank page or use a template (if one is set up for the portal).

### Starting with an blank page

You can always write your update manually in the [editor](editor/) — but if you’d like help from AI, we recommend following these steps to craft a polished update more efficiently.

{% stepper %}
{% step %}
#### Generate description with AI

Select one ore more work items in the right-hand staging area. Once selected, an action toolbar will appear at the top of the sidebar. Click the **Generate** button to generate the descriptions for the selected work items.

To **select multiple work items** at once:

* Press `Cmd/Ctrl` and click on multiple work items.
* Click to select the first work item. Then press `Shift` and click the last work item. This will select the first work item, the last work items, and all work items in between.

{% hint style="info" %}
You can generate a description for a maximum of 50 work items at a time. Please refer to the [limits](writing-a-post.md#limits) section below for more details.&#x20;
{% endhint %}
{% endstep %}

{% step %}
#### Drag cards into the editor

Once you’ve generated changelog descriptions for your work items, you can drag individual items into the editor — or select and insert multiple items at once.

Each inserted item will include its AI-generated description along with a direct link to the original work item.

{% embed url="https://www.loom.com/share/be820ba72195452193011a409ee5f46c" %}
Bulk adding work items
{% endembed %}
{% endstep %}

{% step %}
#### Editing the content

After inserting the generated descriptions, you can freely edit the content in the editor to make it your own. Refine the wording, adjust the tone, or add extra context. You can also embed rich media — such as images, GIFs, YouTube or Loom videos — to bring your updates to life.
{% endstep %}
{% endstepper %}

### Using templates

To create a post from a template, choose one of the available templates in the empty state of editor. A dialog will appear showing the template's name and the number of issues it will include.

{% hint style="info" %}
You’ll need to [create a template](templates.md) first before it appears in the empty state.
{% endhint %}

Based on the template setup, the AI copywriter will create a title, intro, and description for each issue in the post. After the post is generated, you can edit the text in the editor and add images and videos.

Learn more about [templates](templates.md).

## Updating a post

If you need to edit a post once [published](publishing.md), you can easily update the post.&#x20;

Simply click on **Edit** in on a post, make your changes and publish the post again.&#x20;

If you published a post to the wrong channel, you can disable the channel when updating the post, and it will be retracted from that channel.&#x20;

## Deleting a post

You can delete a post from via the post editor.&#x20;

* Click to edit a post.
* Click the **Unpublish** button in the top bar of the editor.
* Once unpublished, click the **Discard draft** button in the top bar of the editor to completely delete the post.&#x20;

## Drafts

When you create a new post or make edits to an existing one, a draft is automatically generated, ensuring that you can conveniently resume your work at a later time.

### Editing a draft

To edit a previously created draft, navigate to the **Changelog** section in your [Space](../portals/). All current drafts can be found at the top of the overview page.&#x20;

Click on a draft to start editing.&#x20;

{% hint style="info" %}
Drafts are only shown to users with edit permission in the linked project if access to the space is restricted. See [permissions ](../administration/permissions.md)for details.
{% endhint %}

### Saving a draft

Drafts are saved automatically as you type.&#x20;

### Deleting a draft

To delete a draft, click the **Discard draft** button in the top bar of the editor. Keep in mind that discarding a draft only deletes unpublished content.

## Limits

<details>

<summary>AI generation work item limit</summary>

The generation of descriptions is **limited to a maximum of 50** work items at a time. In case you have a larger number of work items, it is recommended to select and generate the descriptions in smaller batches.

</details>

<details>

<summary>AI generation token limit</summary>

Consider tokens as fragments of words. Before the API tackles your prompts, it disassembles the input into these tokens. It's worth noting that tokens don't align perfectly with the beginnings or endings of words - they might encompass trailing spaces or parts of words. To understand the concept of token lengths, here are a few useful guidelines:

* 1 token \~= 4 chars in English
* 100 tokens \~= 75 words
* 2048 tokens \~= 1,500 words

Requests can use up to **4097** tokens shared between prompt and completion. If your prompt is 4000 tokens, your completion can be 97 tokens at most. Therefore we enforce a limit on the size of the prompt, which includes the work item description.\
\
As newer models with increased limits become available, we will be upgrading our limits as well.

</details>
