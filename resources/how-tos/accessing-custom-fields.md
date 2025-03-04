# Accessing Custom Fields

## Overview

Released lets you choose which description field to use for generating release notes. But every so often, you might want to include information from other fields in your release notes as well.&#x20;

Common examples are:&#x20;

* Documentation links
* Product area
* Theme
* Customer

This guide outlines a simple workaround to include additional fields in your release notes until native support is available.

Here’s how it works:

1. **Copy field values** into the description field using automation.
2. **Adjust your AI prompt** to reference those fields.

{% embed url="https://www.loom.com/share/9b5399472c50409d9ba4edadeb3ed6aa?sid=90e8286b-d0d0-4538-923c-c0ca28b257d5" %}

## How to

With Jira Automation, you can easily copy values from other fields into the description field used for generating release notes.

You can trigger this automation manually or automatically when an issue’s status changes.

Follow the step-by-step guide below to set it up.&#x20;

{% hint style="info" %}
If you are not familar with Jira automations, we recommend that you read the [Getting Started Guide for Jira Automations ](https://www.atlassian.com/software/jira/guides/automation/overview)first.&#x20;
{% endhint %}

### 1. Setting up the automation

#### Adding a trigger

<figure><img src="../../.gitbook/assets/Jira Automation - Trigger.png" alt=""><figcaption></figcaption></figure>

First, decide how you want to trigger the automation. The most common options are:

* Manual trigger (shown above) – Run the automation on demand.
* Workflow transition trigger – Automatically trigger the automation when an issue’s status changes.

#### Adding an action

Once the automation is triggered, the next step is to define an action. In this case, we want to edit the description field used to create the release notes.&#x20;

In the below example, we’re updating the description field by:

1. Keeping the original description at the top to preserve existing information.
2. Adding a section labeled “Other Information” below, where we include values from various issue fields.
3. Structuring the field data as key value pairs. This will allow for referencing the fields in the AI prompt.&#x20;

<figure><img src="../../.gitbook/assets/Jira Automation - Edit Action.png" alt="" width="375"><figcaption></figcaption></figure>

{% hint style="info" %}
Click on the curly brackets in the bottom right of the text editor to easily access the available fields for the issues.&#x20;
{% endhint %}

#### Example

```
{{issue.description}}

h3. Other information

Assignee: {{assignee.displayName}}
Versions: {{issue.fixVersions.name}}
Documentation: {{issue.customfield_10414}} // the custom field ID will differ.
```

### 2. Reference the data in your AI prompt

Once the data is available in the description field, you can reference it directly in the AI prompt. Simply use the field name as specified in the structured format above to ensure consistent output.

{% hint style="info" %}
For more detail on how to write an AI prompt using custom fields read [creating-structured-output.md](../ai-tips/creating-structured-output.md "mention")
{% endhint %}

