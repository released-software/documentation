# Creating Structured Output

## Overview

Creating structured output with AI can significantly enhance the consistency and clarity of your results. While AI can sometimes produce unpredictable responses, a well-crafted prompt can help ensure that you receive structured and reliable output every time.

## How to

### Jira issue description

The prompt example below assumes that your Jira issue description contains the standard description at the top, with an additional section at the bottom containing structured meta data about the issue.&#x20;

{% code overflow="wrap" %}
```
Title: Implement Automatic Change Logging for Task Tracking

Description:

We plan to enhance the task tracking feature by implementing automatic change logging. This improvement will allow users to see a complete history of changes made to tasks, including updates to assignees, due dates, and status changes. Once completed, users will be able to easily track task progress and accountability, leading to better project management and collaboration.</p>

=== Other information === 
Assignee: Jane Doe
Support tickets: JRA-456, JRA-789
Module:</b> Tasks Tracking
Documentation: https://docs.released.so/task-management
```
{% endcode %}

### Prompt Example

The prompt example is designed to help you create clear and easy-to-understand AI-generated content. It starts with some friendly tips on tone and style, encouraging you to keep things simple and focus on the benefits for users while avoiding too much technical jargon.

Then, it lays out a straightforward structure: you’ll have a title and a paragraph that explains what’s being improved and why it matters to users. There’s also an "Other information" section for extra details like who’s assigned to the task and any related support tickets.&#x20;

<pre class="language-html"><code class="lang-html"><strong>Use the following guidelines:
</strong>
1. General Tone and Style:
- Use clear, concise language that is easy for end-users to understand.
- Highlight the benefits of changes, improvements, or fixes.
- Minimise technical jargon unless it is essential for accuracy.

2. Content Structure:
&#x3C;h3> [Title]&#x3C;/h3>

&#x3C;p>[Description]&#x3C;/p> 
&#x3C;!-- Write a single paragraph that: -->
&#x3C;!-- - Describes what was improved, added, or fixed (&#x3C;Improvement/Change Summary>). -->
&#x3C;!-- - Explains the impact or benefits for the end-user (&#x3C;End-user Benefits>). -->

&#x3C;h4>Other information&#x3C;/h4> &#x3C;!-- Only show this section if there is other information available. -->
&#x3C;ul>
&#x3C;li>&#x3C;b>Assignee:&#x3C;/b> [Assignee name] &#x3C;/li> &#x3C;!-- Omit if no assignee is set -->
&#x3C;li>&#x3C;b>Support tickets:&#x3C;/b> [Linked support ticket IDs]&#x3C;/li> &#x3C;!-- Show IDs only. Eg: JRA-123, JRA-124 -->
&#x3C;li>&#x3C;b>Module:&#x3C;/b> [Customer name] &#x3C;!-- Omit if value is "Select Customer" or unavailable. -->
&#x3C;li>&#x3C;b>Learn more:&#x3C;/b> [Documentation link] 
&#x3C;/ul>
</code></pre>

### Additional tips

Here are some additional tips to help ensure that AI outputs structured format reliably through prompting:

1. **Be Specific**: Clearly define what you want in your prompt. The more specific you are about the structure and content, the better the AI can follow your instructions.
2. **Use Examples**: Providing examples of the desired output can help the AI understand the format you’re looking for. This can serve as a template for the AI to mimic.
3. **Break It Down**: If the output requires multiple sections, break down the prompt into smaller, manageable parts. This helps the AI focus on one section at a time.
4. **Reiterate Key Points**: If certain elements are crucial (like including a title or specific details), reiterate these points in your prompt to emphasize their importance.
5. **Test and Iterate**: Don’t hesitate to test different prompts and refine them based on the AI’s responses. Iteration can help you find the most effective way to communicate your needs.
6. **Encourage Clarity**: Remind the AI to prioritize clarity and conciseness in its responses. Phrases like "keep it simple" or "make it easy to understand" can reinforce this.
7. **Limit Jargon**: Specify that the AI should minimize technical jargon unless necessary. This helps ensure the output is accessible to a broader audience.

By incorporating these tips into your prompting strategy, you can enhance the likelihood of receiving structured and reliable output from the AI.
