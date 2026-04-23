---
description: Create consistent product updates in seconds with templates.
icon: memo
---

# Templates

{% embed url="https://www.loom.com/share/224e1f1427d64cb1860af674e9d7f4c9?sid=2290b85f-f69c-492e-93ba-61752f948b61" %}
Release Notes Template Demo
{% endembed %}

Templates simplify and accelerate the creation of changelogs, release notes, and other announcements, and ensure a consistent experience with every update.&#x20;

## Basics

### Creating a New Template

1. Navigate to the **Templates** section of your workspace **⚙ Settings**.
2. Click on **Create** to create a new template.
3. Choose an existing template to start with or start from scratch.
4. Customize the template with placeholders and formatting options as needed.
5. Save your template with a descriptive name for future use.

### Editing an Existing Template

1. Navigate to the **Templates** section of your **Settings**.
2. Select the template you wish to edit from the list.
3. Modify the template content and placeholders.
4. Save your changes to update the template.

### Basic Formatting Support

Aside from the above AI blocks, you can use most of the regular blocks available in the standard editor for templates as well. For more details, see the [editor](editor/ "mention") documentation.

{% hint style="warning" %}
#### Images

We currently do not support adding images in templates. However, you can add images once the post was generated.&#x20;
{% endhint %}

<figure><img src="../../.gitbook/assets/Announcement Page - Header.png" alt=""><figcaption><p>Template Example</p></figcaption></figure>

## AI Blocks

Our template feature includes dynamic placeholders that can be populated using AI-generated content. These placeholders ensure that your release notes are informative, consistent, and engaging.

### Title

Generates a title based on the post content.&#x20;

Type `/` while editing the title field and select **Title** in the AI blocks section.

### Introduction

Generates an introduction based on the post content.&#x20;

Type `/` in the content editor and select **Introduction** in the AI blocks section.&#x20;

### Issue sections

This block generates descriptions for all issues of the specified type(s) in paragraph format.&#x20;

For example: If the selected issue type was "Story", and the filter for the release announcement contains 3 stories, this block will create 3 sections, with a heading for each story.&#x20;

Type `/` while editing the title field and select **Issue sections** in the AI blocks section.&#x20;

{% hint style="info" %}
We recommend to use this block style for major features and improvements.
{% endhint %}

### Issue lists

This block generates descriptions for all issues of the specified type(s) in a list format.&#x20;

For example: If the selection issue type was "Bug", and the filter for the release announcement contains 5 bugs, this block will create 5 bullets points, one for each bug.&#x20;

{% hint style="info" %}
We recommend to use this block style for bugfixes and small improvements.&#x20;
{% endhint %}

### Settings

Each template block can be filtered to show specific work items, and its AI prompt can be customized to override the global default.

<table data-header-hidden><thead><tr><th width="174"></th><th></th></tr></thead><tbody><tr><td><strong>Filters</strong></td><td><p>Specify which work items appear in this block using one of three approaches:<br></p><ul><li><strong>Basic filters:</strong> Select work item types, status categories or labels directly from the dropdown menus.</li><li><strong>Saved Jira filters:</strong> Pick from your existing Jira filters to reuse filter logic you’ve already defined.</li><li><strong>JQL (advanced):</strong> Write a custom JQL query for full control over which issues are included.</li></ul><p><br><strong>Use cases</strong><br></p><ul><li><strong>Team-specific release notes:</strong> Add multiple Issue sections blocks, each filtered to a different team. This creates a dedicated section per team within a single release note — for example, one for Platform and one for Mobile.</li><li><strong>Audience-targeted updates:</strong> Use filters to separate customer-facing improvements from internal changes, so you can publish relevant updates to different audiences.</li><li><strong>Categorized bug reports:</strong> Combine an Issue sections block filtered to new features with an Issue lists block filtered to bug fixes, giving readers a clear picture of what’s new and what’s fixed.</li><li><strong>Component-based changelogs:</strong> Filter by Jira component or label to organize release notes by product area, such as API, Dashboard, or Integrations.</li></ul></td></tr><tr><td><strong>AI prompt</strong></td><td>Customize the AI prompt used for this section. Note that this only apply to newly generated descriptions. If the work item already has an existing changelog description, the existing descriotion will be used.</td></tr></tbody></table>

## Frequently Asked Questions

<details>

<summary>Do you have any tips on how to write effective product updates?</summary>

* **Be Concise**: Use the AI Summary for a quick overview and detailed sections for in-depth information.
* **Be Clear**: Utilize headings and lists to structure your content for better readability.
* **Keep it Consistent**: Stick to your template for a uniform look across all release notes.

</details>

<details>

<summary>What happens if an issue in the template already has a description?</summary>

That depends.

**If the description is stored in a** [released-description-field.md](settings/released-description-field.md "mention"): Released will use that description in the template and not generate a new description.

**If the description is stored in the issue properties (the default)**: Released will overwrite the description only if a **custom prompt** was used in the template. &#x20;

</details>
