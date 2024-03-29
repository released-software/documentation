---
description: Customise Released's language model
---

# Artificial Intelligence

<figure><img src="../../.gitbook/assets/AI - Header.png" alt=""><figcaption></figcaption></figure>

## Overview&#x20;

The AI settings allow you to tailor the AI to your issue description and adjust the output to your brands tone of voice.&#x20;

## Basics

The advanced AI prompts of Released have undergone meticulous fine-tuning to produce release notes from an array of Jira issue descriptions. However, achieving a universally perfect prompt catered to every content type is challenging.

To guarantee that the AI output meets your expectations, you have the option to personalize the prompt, molding it to suit your distinct content requirements.

{% hint style="info" %}
**Custom prompts are not a guarantee**\
It's important to note that the resulting description might not strictly follow your input. Your personalized prompts serve as navigational tools for guiding Released's content creation in the desired direction, leading to reduced editing efforts. However, it's essential to understand that a custom prompt does not ensure an infallible or guaranteed result.
{% endhint %}

To access the AI settings, click on **Settings > AI settings** in the sidebar navigation.&#x20;

To create the perfect output, Released offers a number of settings to customize the prompt as well as the input source for the AI description.&#x20;

* [AI input field](artificial-intelligence.md#ai-input-field) – customize which field is used as the source for the AI description.
* [Base prompt](artificial-intelligence.md#base-prompt) – customize the general instructions provided to the AI model across all issue types.&#x20;
* [Issue specific prompt](artificial-intelligence.md#issue-specific-prompts) – add a custom prompt tailored to specific issue types.

### AI input field

By default, the issue summary (also known as title), and the description are used as input for the AI. That's the content it uses to create the public description.&#x20;

However, if your team uses the description field to capture technical details or just generally content that can not be used to generate a meaningful description, you have to option to select a different field as input.&#x20;

<figure><img src="../../.gitbook/assets/AI - Input Field.png" alt=""><figcaption><p>AI input field setting</p></figcaption></figure>

The AI input field dropdown contains all fields of type "Paragraph". Please make sure that the field is configured for all issue types you intend to include in your update.&#x20;

{% hint style="warning" %}
If the field selected for the **AI input field** is not configured for a given issue, the AI will fallback to the standard description field as input. &#x20;
{% endhint %}

### Base prompt

The base prompt is the initial instruction provided to the language model to guide its response. It sets the context for the AI's subsequent language generation. The quality and clarity of the base prompt significantly influence the AI's output. \
\
To incorporate broad instructions that apply to all types of issues, you can easily customize the base prompt according to your needs.

#### Tips for writing a good base prompt

| Tip                                                                                                                          | ✅ Good                                           | 🚫 Bad                                         |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------- |
| Utilize custom prompts as instructional tools. Focus on guiding language.                                                    | Utilize metapphors to clarify complex concepts.  | Please incorporate metaphors.                  |
| Keep in mind that language models can struggle with negations. To enhance results, it's advisable to rephrase custom prompts | Avoid details that aren't relevant.              | Do not include details that aren't' relevant.  |

### Issue specific prompts

Enhance your prompt by incorporating issue-specific instructions, customizing the desired response length, adjusting the tone of voice, or requesting the AI to provide additional context as needed.

Issue specific prompts provide you the flexibility to adopt a playful tone while crafting feature descriptions and maintain a professional tone when communicating security vulnerabilities.

<figure><img src="../../.gitbook/assets/AI- Issue Prompt.png" alt=""><figcaption><p>AI Issue Specific Prompt</p></figcaption></figure>

#### Format

The formatting option empowers you to tailor the length of the generated description. For instance, bug-fixes usually warrant succinct, one-sentence explanations, while major features can be elaborated upon with a couple of paragraphs.

#### Tone of voice

The _Tone of Voice_ settings let you customize how Released writes. You can configure the tone of voice via the issue specific prompt settings. There, you'll see an option that looks something like this:

{% hint style="info" %}
Incorporating a tone of voice will guide Released towards a particular writing style, yet it doesn't ensure that all your content will strictly adhere to that tone. For instance, opting for the Humorous tone will infuse elements of humor into the article, but Released can not guarantee that the output will be a comedic masterpiece.
{% endhint %}

#### Custom prompt

With the custom prompt option, you can go beyond the pre-configured choices to personalize formatting and tone of voice according to your preferences. Additionally, feel free to include any extra instructions you'd like.

#### Tips for writing a good custom tone prompt

| Tip                                                                                                                        | ✅ Good                                   | 🚫 Bad                                                                           |
| -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------- |
| Express custom tones of voice as adjectives.                                                                               | Motivational, philosophical, and cheeky. | Injecting humor, projecting authority, and emulating Shakespearean style.        |
| Incorporating conjunctions (such as 'and') is acceptable, although brevity in your tone is preferable for optimal results. | Lively and engaging.                     | Example is: lively, engaging, concise, inspirational, and authentically genuine. |

\
