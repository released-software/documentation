---
description: >-
  This page provides an in-depth guide on how to correctly configure the color
  scheme settings to ensure Dark and Light mode are rendered as expected.
---

# Configuring Dark Mode

## Overview

Released embeds offer three color schemes: `"light"`, `"dark"`, and `"system"` (which is the default). It's important to choose the value that best matches the behavior of the page you are embedding into.

## How to update the Released Color Scheme setting

You can update the color scheme setting in the Released app in the [Page](../../workspace/settings/portal/announcement-page.md), [Widget](../../workspace/settings/portal/widget.md), or [Portal](../../workspace/settings/portal/) design settings for your Workspace. This will update the value for all embedded `<released-page>` or `<released-widget>` elements respectively for that Workspace, or for that Workspace's Portal in the Product Hub.

If you have a specific widget or page that is embedded into a different context, you can add the `color-scheme="{light|dark|system}"` attribute to that element to override the value you've set in the Workspace settings. For example, to st a single Announcement Page to use the Light color scheme:

```html
<released-page color-scheme="light" (other attributes)></released-page>
```

## Light, Dark, and System/Auto - which setting do I want?

Which Released Color Scheme you choose depends on how your page handles the native browser color-scheme values for your users. Specifically, it depends on how your page interacts with:

* Your user's [`prefers-color-scheme` CSS media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme), which describes whether the user has configured their browser to prefer a dark or light color scheme.
* The HTML document's [`color-scheme` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme) which describes the actual color-scheme the document is using. Technically, we only look at the `color-scheme` value on the `<released-page>` or `<released-widget>` element itself, but this is usually inherited and consistent across the whole document.

<table><thead><tr><th width="219">Color scheme</th><th width="100">HTML attribute value</th><th>Use this value if…</th></tr></thead><tbody><tr><td><strong>Light</strong></td><td>light</td><td><ul><li>your page doesn't respond to a user's <code>prefer-color-scheme</code> settings and always has a light background, or</li><li>your page has a Dark Mode setting, but doesn't set the CSS <code>color-scheme</code> property to match, and the user has chosen a Light color scheme in your app.</li></ul></td></tr><tr><td><strong>Dark</strong></td><td>dark</td><td><ul><li>your page doesn't respond to a user's<code>prefer-color-scheme</code> settings and always has a dark background, or</li><li>your page has a Dark Mode setting, but doesn't set the CSS <code>color-scheme</code> property to match, and the user has chosen a Dark color scheme in your app.</li></ul></td></tr><tr><td><strong>Auto</strong></td><td>system</td><td><ul><li>your page <em>does</em> respond to a user's <code>prefer-color-scheme</code>, or</li><li>your page sets the CSS <code>color-scheme</code> property to match the color-scheme it is displaying.</li></ul></td></tr></tbody></table>

## Common issues

### White text on white background

At night, my Announcement Page header text looks white on a white background.

This happens because:

* Your operating system or browser:
  * may be using an Automatic color scheme. It sets `prefers-color-scheme` to `"light"` during the day, and `"dark"` at night.
* The page where you've embedded Released:
  * uses a **white** background at all times,
  * does not use a `prefers-color-scheme` media query to change the background if the user prefers a dark color scheme,
  * does not set a `color-scheme: light` CSS value to indicate that it is using a Light color scheme.
* Your Workspace Page Color Scheme is set to **"Auto"** (if the user's `prefers-color-scheme` is `"dark"`) or **"Dark"**.

You should set your Workspace Page Color Scheme to **"Light"** to match the behavior of your web page.

### Black text on dark background

When users choose my app's Dark color scheme, the Released Announcement Page header text looks black on a black background.

This happens because:

* The user's operating system or browser:
  * may be using a Light or Automatic color scheme and has currently set `prefers-color-scheme` to `"light"`.
* The page where you've embedded Released:
  * uses a **black** background for this user,
  * does not set a `color-scheme: dark` CSS value to indicate that it is using a Dark color scheme.
* Your Workspace Page Color Scheme setting is set to **"Auto"** (if the user's `prefers-color-scheme` is `"light"`) or **"Light"**.

You should either:

* Begin applying the `color-scheme` CSS property to match your users' Dark Mode choices and set your Workspace Page Color Scheme to **"Auto"** to match the behavior of your web page.
* Add an explicit `color-scheme` attribute to your `<released-page>` element that matches the current user's choice of light or dark color scheme.
