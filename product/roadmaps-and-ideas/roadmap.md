---
description: Communicate your plans with stakeholders and customers.
icon: square-kanban
---

# Creating & Editing

## Creating a roadmap

Aside from the initial creation via the empty state, there are **3 ways to create a roadmap**.&#x20;

| Roadmap dropdown                                                                                                                                                | More (⋯) menu                                                                                                                                            | Save as new                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <p></p><div><figure><img src="../../.gitbook/assets/Roadmaps - Create 2.png" alt="" width="375"><figcaption><p>Roadmap selector</p></figcaption></figure></div> | <p></p><div><figure><img src="../../.gitbook/assets/Roadmaps - Create 1.png" alt="" width="375"><figcaption><p>More menu</p></figcaption></figure></div> | <p></p><div><figure><img src="../../.gitbook/assets/Roadmaps - Create 3.png" alt="" width="375"><figcaption><p>Save as new</p></figcaption></figure></div>                     |
| You can create a new roadmap using the **roadmap selector** found in the breadcrumbs navigation.                                                                | The more (**⋯**) menu offers a range of options for managing the current roadmap and also provides the ability to create a new roadmap.                  | When adjusting the filter or display options of a roadmap, you can either save the current roadmap or use the dropdown arrow to **Save as new** and create a separate version. |

## Project configuration

Roadmap views can display work items from multiple Jira projects. To include work items from a specific project on your roadmap, simply add the project to the [linked projects](/broken/pages/M1J2rppJq2UbtY2tc7Tr#linked-projects) within the workspace.

## Filtering work items

Use filters to refine the work items displayed on the roadmap. You can apply basic filters such as issue type or labels, or utilize JQL for more advanced filtering options.

## Selecting a view

You can view your roadmap as a [Board](/broken/pages/Yl1oAwSxMPeK4QsM18X1) or a [Timeline](/broken/pages/7iW1jp3XViP3bP9ZuFDo), depending on whether you prefer a Kanban-style layout or a time-based schedule.

## Field configuration

Released roadmaps support a variety of custom field types that can be displayed on the card or in the detail view.&#x20;

To add a field to the view, click the `+` icon next to the field names in the **Available Fields** section. By default, the field will appear on both the compact card on the board and the detailed (dialog) view. Use the checkboxes to show or hide fields in each respective view.

<figure><img src="../../.gitbook/assets/Field settings.png" alt="" width="375"><figcaption><p>Field settings</p></figcaption></figure>

### **Released system fields**

#### **Title**

By default, the Summary field is used as the title for each work item. The title is always shown on both the board and the detailed view, and cannot be hidden.

To use a different field as the title, click the  `T`  icon next to any compatible text field.

#### **Public description**

The Public Description is a special Released system field that can only be edited within a Released board. It uses the same rich-text editor as the changelog, making it easy to embed images, videos, and other media (including YouTube and Loom).

In the Board view, the public description is automatically truncated. If you prefer to show a shorter summary instead, you can hide the public description field and display a short text field in its place.

To edit the public description, click any card in a Released roadmap. You can edit the description inline — add text, images, or videos directly. See the [editor](../changelog/editor/ "mention") documentation for details.&#x20;

### Available Jira fields types

* Text field (multi-line)
* Short text
* Status
* Flagged
* Labels&#x20;
* Date / Time-date
* Select
* Multi-select
* Issue type
* Checkboxes
* Radio Buttons
* Team
* Rating (Jira Product Discovery)

#### Known field limitations

<details>

<summary>Text field (multi-line)</summary>

The following formatting options are not supported or have limited support.&#x20;

* **Images** – images can not be rendered on the public roadmap.
* **Action items** – render as a bullet item.&#x20;
* **Status lozenge** –  renders as `[ STATUS ]` .
* **Tables –** do not support all table features such as background colors.
* **Smart links** – render as regular links.
* **Expand panel** - always renders the title and content.
* **Panels (info, warning...)**  – render the content only, without the pabel styling.&#x20;

</details>

### Field ordering

You can adjust the order in which fields are displayed on the card and in the detail view by dragging and dropping the fields in the list. Note that the order of the title and description field can not be changed.&#x20;

## Editing issue details

Fields other than the public description can be edited on the full issue view.&#x20;

To open the issue view:

* Click on the issue key lozenge when hovering over a card, or
* Click on **Edit issue** from the card detail view.&#x20;

## Deleteting a roadmap

You can delete a roadmap through the More (⋯) menu in the top-right corner. Deleting a roadmap also unpublishes it, immediately removing it from the portal view.
