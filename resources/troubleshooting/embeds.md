---
description: >-
  Use this guide to troubleshoot problems when embedding a portal in a third
  party site or app.
---

# Embeds

## Communication errors

This error indicates that the Released embed can’t establish a secure connection. It can be caused by issues on the website visitor  side or by how the embed is configured by the owner.

### Network connectivity

Your browser’s network connection is unstable or blocked.

#### How to fix it

* Check your internet connection.
* Disable VPNs, firewalls, or network filters that may block iframe communication.
* Reload the page once connectivity is stable.

### Safari: Storage access denied

Safari applies strict privacy rules. In some cases, it permanently blocks communication inside iframes.

#### How to fix it

{% stepper %}
{% step %}
In the macOS menu bar, go to Safari > Settings.
{% endstep %}

{% step %}
Open the Privacy tab.
{% endstep %}

{% step %}
Click Manage Website Data….
{% endstep %}

{% step %}
Search for the domain of the Product Hub you logged into (for example releasedhub.com).
{% endstep %}

{% step %}
Select it and click Remove.
{% endstep %}

{% step %}
Reload the page and try again.
{% endstep %}
{% endstepper %}

This clears stored data for that domain and allows Safari to re-establish communication.

### Iframe sandbox restrictions

If the Released embed is placed inside an iframe, the iframe must allow certain capabilities.

#### How to fix it

Ensure the iframe includes at least the following sandbox attributes:

{% code overflow="wrap" %}
```javascript
sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin allow-top-navigation-by-user-activation allow-storage-access-by-user-activation"
```
{% endcode %}

### Content Security Policy (CSP)

Your website may be blocking the Released embed.

Some websites use a security setting called **Content Security Policy (CSP)**. CSP controls which external content is allowed to load on a page. If it is too restrictive, it can prevent the Released Product Hub from loading inside the page, which results in the Communication error.

Released is loaded using an iframe, so your CSP must explicitly allow your Released Product Hub to be embedded.

#### What to check

Look at the Content-Security-Policy header set by your site and check which directive controls frames.

Browsers evaluate CSP rules for iframes in this order:

1. frame-src (if present)
2. child-src (if frame-src is not present)
3. default-src (if neither is present)

#### How to fix it

**If your CSP includes frame-src** you must add your Released Product Hub origin to it.

```
Content-Security-Policy: frame-src https://mysubdomain.releasedhub.com;
```

If frame-src exists and your hub is not listed, the embed will be blocked, even if default-src allows it.

**If your CSP does not include frame-src, but includes child-src** add your Released Product Hub origin to child-src.

```
Content-Security-Policy: child-src https://mysubdomain.releasedhub.com;
```

This only works if frame-src is not defined.

**If your CSP only includes default-src** you have two options:

{% stepper %}
{% step %}
**Option 1**: Add the hub origin to default-src

{% code overflow="wrap" %}
```javascript
Content-Security-Policy: default-src 'self' https://mysubdomain.releasedhub.com;
```
{% endcode %}
{% endstep %}

{% step %}
**Option 2 (recommended)**: Define a dedicated frame-src&#x20;

{% code overflow="wrap" %}
```javascript
Content-Security-Policy: default-src 'self'; frame-src https://mysubdomain.releasedhub.com;
```
{% endcode %}
{% endstep %}
{% endstepper %}

This makes it explicit that Released is allowed to load as an iframe.

#### How to confirm it’s working

* Reload the page containing the embed
* Open your browser’s developer console
* Confirm there are no CSP-related errors blocking releasedhub.com

If CSP was the issue, the Communication error should no longer appear.



### Product Hub unavailable

This error can also appear if the Product Hub cannot be reached.

#### How to fix it

* Verify that you can open your Product Hub directly in the browser.
* Check Released Status for any ongoing outages.
* If you use a custom hostname, confirm it is correctly configured.

## Invalid origin

This error means the current domain is not allowed to embed the Product Hub.

#### How to fix it

* Add the embedding domain to Trusted Domains in Released Global Settings.
* Note that internal and restricted embeds can only be used on trusted domains.
