---
description: Add Release Notes to your Framer website in minutes.
---

# Framer

Framer let's you design websites on a freeform canvas. Add animations, interactions and a CMS.&#x20;

With **Released + Framer**, you can seamlessly embed a widget or announcement page into your website.&#x20;

This section assumed you are familiar with Framer's code components. If you are new to code components, we recommend you read this page first: [https://www.framer.com/learn/code-components/](https://www.framer.com/learn/code-components/)

## Prerequisite&#x20;

* [ ] [Find the channel ID](../getting-started/setup-guide/finding-the-channel-id.md) for the announcement page and note it down.&#x20;

## Adding the embed code

Copy the following code snippet into the `<head>` element of your page.&#x20;

1. Click on the ⚙️ icon in the top right of the header in Framer.&#x20;
2. Click on **General**.
3. Scroll down to the **Custom Code** section.&#x20;
4. Insert the following code in the **End of \<head> tag** panel.&#x20;

```html
<script src="https://embed-staging.released.so/1/embed.js"></script>
```

Alternatively, you have the option to include the code in the section of the specific page where you wish to display the announcement page. However, considering that you may want to incorporate a notification badge in other sections of the website as well, it is advisable to follow the instructions mentioned above and add it in the General section.

## Creating a component

1. To create a new code component go to **Assets → Code** and click the plus button.&#x20;
2. Delete the Framer example code and copy and paste the following code into the editor:

```tsx
// We need to define an interface for our release page custom html component.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            // The name of the custom component and the available attributes
            "released-page": {
                "channel-id": string
                "color-scheme"?: string
                "color-primary"?: string
                "header"?: string
                "top-offset"?: string
            }
        }
    }
}

// This is the output of our custom component that will be rendered in the page.
export default function Released_page(props) {
    return (
        <>
            <released-page
                channel-id="CHANNEL_ID"
                header="true"
                color-scheme="light"
                top-offset="60"
            ></released-page>
        </>
    )
}
```

3. Replace the **CHANNEL\_ID** placeholder with your announcement page **channel-id**.&#x20;
4. Customize the properties of the `<released-page>`tag at the bottom with your preferred configuration. For further details on the available options, refer to the [announcement-page.md](../product-tour/settings/announcement-page.md "mention") documentation.&#x20;

You can now use your component like other HTML components in Framer. Drag it onto the page where you want to display the announcements.&#x20;
