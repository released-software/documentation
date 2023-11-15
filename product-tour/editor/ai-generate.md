---
description: Turn your Jira tickets into engaging descriptions of your improvements
---

# AI Generate

Released takes the summary and description of your Jira issues and turns them into copy for your announcement.&#x20;

### Generating a description

First, [create](../posts/creating-a-post.md) or edit a post.&#x20;

Then select one ore more issues in the [staging area](staging-area.md) of the post editing view. Once selected, an action toolbar will appear at the top of the sidebar. Click the **Generate** button to generate the descriptions for the selected issues.&#x20;

<figure><img src="../../.gitbook/assets/Generate Toolbar.png" alt=""><figcaption><p>Generate a Released description</p></figcaption></figure>

### Editing the generated description

If you have the **Released Description** custom field configured for your issues, you will be able to see and edit the generated description in the issue view.&#x20;

If the **Released Description** custom field is not configured, the generated description will be saved as an issue property and cannot be edited through the issue view. Nevertheless, you can still modify the generated text by simply dragging and dropping the card into the release notes editor.

### Limitations

#### Issue limit

The generation of descriptions is **limited to a maximum of 50 issues** at a time. In case you have a larger number of issues, it is recommended to select and generate the descriptions in smaller batches.&#x20;

#### Token limit

Consider tokens as fragments of words. Before the API tackles your prompts, it disassembles the input into these tokens. It's worth noting that tokens don't align perfectly with the beginnings or endings of words - they might encompass trailing spaces or parts of words. To understand the concept of token lengths, here are a few useful guidelines:

* 1 token \~= 4 chars in English
* 100 tokens \~= 75 words
* 2048 tokens \~= 1,500 words

Requests can use up to **4097** tokens shared between prompt and completion. If your prompt is 4000 tokens, your completion can be 97 tokens at most. Therefore we enforce a limit on the size of the prompt, which includes the issue description. \
\
As newer models with increased limits become available, we will be upgrading our limits as well.&#x20;

{% hint style="info" %}
If you require a larger limit for your use-case, we would love to hear from you. Please get in touch via our [help desk](https://released.so/support).&#x20;
{% endhint %}
