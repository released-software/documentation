---
description: Customise Released's language model
---

# Artificial Intelligence

The advanced AI prompts of Released have undergone meticulous fine-tuning to produce release notes from an array of Jira issue descriptions. However, achieving a universally perfect prompt catered to every content type remains challenging.

To guarantee that the AI output meets your expectations, you have the option to personalize the prompt, molding it to suit your distinct content requirements.

{% hint style="info" %}
**Custom prompts are not a guarantee**\
It's important to note that the resulting description might not strictly follow your input. Your personalized prompts serve as navigational tools for guiding Released's content creation in the desired direction, leading to reduced editing efforts. However, it's essential to understand that a custom prompt does not ensure an infallible or guaranteed result.
{% endhint %}

## Base prompt

The base prompt is the initial instruction provided to the language model to guide its response. It sets the context for the AI's subsequent language generation. The quality and clarity of the base prompt significantly influence the AI's output. \
\
To incorporate broad instructions that apply to all types of issues, you can easily customize the base prompt according to your needs.

### What makes a good custom prompt?

* **Instructive Language:** Utilize custom prompts as instructional tools, employing metaphors to elucidate intricate ideas. Rather than using requests like "<mark style="background-color:red;">please incorporate metaphors</mark>" or "<mark style="background-color:red;">this changelog needs metaphors</mark>," focus on guiding language like "<mark style="background-color:green;">utilize metaphors to clarify complex concepts.</mark>"
* **Negation Avoidance:** Keep in mind that language models can struggle with negations. To enhance results, it's advisable to rephrase custom prompts. For instance, instead of "<mark style="background-color:red;">do not include details that aren't relevant</mark>," you're likely to achieve better outcomes with "<mark style="background-color:green;">avoid details that aren't relevant</mark>."

## Issue specific prompts

Enhance your prompt by incorporating issue-specific instructions, customizing the desired response length, adjusting the tone of voice, or requesting the AI to provide additional context as needed.

Issue specific prompts provide you the flexibility to adopt a playful tone while crafting feature descriptions and maintain a professional tone when communicating security vulnerabilities.

\
