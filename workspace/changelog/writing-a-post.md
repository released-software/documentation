---
description: >-
  Learn how Released helps you writing your posts by transforming your Jira
  tickets into release notes.
---

# Writing a Post

## Overview

When creating a new post, you can start with a blank page or use a template (if one is set up for the portal).

<figure><img src="../../.gitbook/assets/Changelog - Empty state.png" alt=""><figcaption></figcaption></figure>

## Starting with an empty page

### Generating a changelog description

Select one ore more issues in the right-hand staging area. Once selected, an action toolbar will appear at the top of the sidebar. Click the **Generate** button to generate the descriptions for the selected issues.&#x20;

{% hint style="info" %}
To select multiple issues either:&#x20;

* Press `Cmd/Ctrl` and click on multiple issues.&#x20;
* Click to select the first issue. Then press `Shift` and click the last issue. This will select the first issue, the last issue, and all issues in between.&#x20;
{% endhint %}

<figure><img src="../../.gitbook/assets/Changelog - Generate button.png" alt="" width="375"><figcaption><p>Generate a Changelog description</p></figcaption></figure>

<details>

<summary>AI generation issue limit</summary>

The generation of descriptions is **limited to a maximum of 50 issues** at a time. In case you have a larger number of issues, it is recommended to select and generate the descriptions in smaller batches.&#x20;

</details>

<details>

<summary>AI generation token limit</summary>

Consider tokens as fragments of words. Before the API tackles your prompts, it disassembles the input into these tokens. It's worth noting that tokens don't align perfectly with the beginnings or endings of words - they might encompass trailing spaces or parts of words. To understand the concept of token lengths, here are a few useful guidelines:

* 1 token \~= 4 chars in English
* 100 tokens \~= 75 words
* 2048 tokens \~= 1,500 words

Requests can use up to **4097** tokens shared between prompt and completion. If your prompt is 4000 tokens, your completion can be 97 tokens at most. Therefore we enforce a limit on the size of the prompt, which includes the issue description. \
\
As newer models with increased limits become available, we will be upgrading our limits as well.&#x20;

</details>

### Adding issues

After generating a changelog description for the issues, you can drag individual issues into the editor or select and insert multiple issues at once.

{% embed url="https://www.loom.com/share/be820ba72195452193011a409ee5f46c" %}
Bulk adding issues
{% endembed %}

### Editing the generated description

If you have the **C**[**hangelog description**](../../getting-started/setup-guide/released-description-field.md) custom field configured for your issues, you will be able to see and edit the generated description in the issue view.&#x20;

If the **Changelog description** custom field is not configured, the generated description will be saved as an issue property and cannot be edited through the issue view. Nevertheless, you can still modify the generated text by simply dragging and dropping the card into the release notes editor.

## Using templates

To create a post from a template, choose one of the available templates. A dialog will appear showing the template's name and the number of issues it will include.

{% hint style="info" %}
Learn how to [create a template](../settings/templates.md).&#x20;
{% endhint %}

<figure><img src="../../.gitbook/assets/Changelog - Template dialog.png" alt=""><figcaption></figcaption></figure>

Based on the template setup, the AI copywriter will create a title, intro, and description for each issue in the post. After the post is generated, you can edit the text in the editor and add images and videos.
