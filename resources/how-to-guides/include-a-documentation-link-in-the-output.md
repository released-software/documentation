# 🤖 Include a Documentation Link in the Output

## Overview

Adding links to in depth articles or documentation is a great way to keep the product update short while giving readers the opportunity to dive into the details.&#x20;

Using a custom prompts, you can easily incorporate links to other resources and create a consistent structure for your output.&#x20;

## Basics

### Issue description

Let's assume we have a ticket with the following description:

```
## Overview
It would be great if changes to a task would be recorded. 

Information that would be useful to know is: 

* Assignee
* Due date
* Status changes

## Documentation
https://docs.released.so
```

We want to generate a description from the overview section and add the documentation link to the bottom of the description with a pre-fix of "Learn more:"&#x20;

### Prompt

Switch the **Base prompt** setting from Default to Custom.&#x20;

In your custom prompt, keep the first part as is.&#x20;

Then, add additional instructions to format the description, followed by an example:&#x20;

```
Remove details not relevant for a release announcement such as mentions of a workaround or steps to reproduce. Remove internal language, like use-cases and requirements. Describe bugs and problems as resolved. 

Use the following structure for the description. Consider text in angular brackets as placeholders. Output in HTML format:
START
[Title]
[Description]

Learn more: [Documentation url]
END
```

That's it.&#x20;

### Preview

Preview the prompt in the **Issue specific prompts** section. &#x20;

* Pick an issue type
* Select an issue in the top right of the issue type box

Once an issue has been selected, the preview, using the above prompt, will start to load.&#x20;

{% hint style="info" %}
The above prompt will apply to all issue types. If you would like to only apply the instructions to certain issue types, simply move the prompt into the custom prompt setting for the  specific issue types.&#x20;
{% endhint %}

<figure><img src="../../.gitbook/assets/Howto - Prompt Preview.png" alt=""><figcaption><p>Prompt Preview</p></figcaption></figure>
