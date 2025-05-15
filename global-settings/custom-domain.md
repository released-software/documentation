---
hidden: true
---

# Custom domain

By default, your Product Hub is accessible on a `[subdomain].releasedhub.com` domain.

You can customize this by setting a custom domain, meaning your audience can access your hub on a domain of your choice.

## Setting up the custom domain

Find the **Custom domain** section in the global settings.&#x20;

{% stepper %}
{% step %}
#### Initiate the custom domain setup <a href="#initiate-the-custom-domain-setup" id="initiate-the-custom-domain-setup"></a>

Click the **Set a custom domain** link to get started.&#x20;
{% endstep %}

{% step %}
#### Choose a subdomain <a href="#choose-a-subdomain" id="choose-a-subdomain"></a>

When choosing a subdomain, you can either use `www` or a custom one. Some commonly used subdomains are:

* `hub.example.com`
* `updates.example.com`
* `roadmaps.example.com`

Apex domains, for example `example.com` without the subdomain, are currently not supported.
{% endstep %}

{% step %}
#### Configure the DNS <a href="#configure-the-dns" id="configure-the-dns"></a>

At this stage, you'll see a dialog with three fields: **Type, Name, Target.**

Those are the details you'll use to set your custom domain in your DNS provider. This is done _outside_ Released, in the provider you are using for your domain.

Copy the contents of the **Name** and **Target** fields to use in your DNS provider. Each provider is different, so when in doubt, check directly with them how to add this record. You should be able to pick the **Type** of record from a list in your provider.

After adding the record, it might take some time for the changes to propagate. In some cases, it might take up to **1 hour** before your CNAME records has been verified.&#x20;

Once verified, click **Go live**.&#x20;
{% endstep %}

{% step %}
#### Finalizing your setup <a href="#finalize-your-setup" id="finalize-your-setup"></a>

Released will automatically configure the SSL certificate for your domain.

Once done, the globe icon next to the domain name will turn green. Your domain is now ready to go.

<img src="../.gitbook/assets/Settings-Custom Domain.png" alt="" data-size="original">
{% endstep %}
{% endstepper %}

## Troubleshooting <a href="#troubleshooting" id="troubleshooting"></a>

Setting up a custom domain can occasionally run into obstacles. Below, we outline frequent problems encountered during this process and provide detailed solutions to each of them.

<details>

<summary>SSL error: an error occurred when provisioning your SSL certificate </summary>

When you set a custom domain, we automatically set up an SSL certificate for secure HTTPS access. You do not need to purchase or configure an SSL certificate yourself.

If an error occurs during SSL setup, it is often because the CNAME record for your custom domain has not yet propagated. To resolve this:

In these cases, we can recommend the following:

1. Check that your CNAME record is set up correctly. Please review our page about configuring DNS to help you with this. If the CNAME record is incorrect, we won't be able to configure the SSL certificate and complete the custom domain set-up.
2. Allow _**at least one hour**_ between configuring the CNAME record and finalizing the custom domain setup.
3. Verify if the CNAME has propagated. You can try using a third-party DNS lookup tool, such as [WhatsMyDNS](https://www.whatsmydns.net/), to find out what the servers believe to be correct for your correct CNAME record.
4. If you are using Cloudflare, please confirm that you don’t have the record proxied [as explained here](https://developers.cloudflare.com/fundamentals/setup/manage-domains/pause-cloudflare/#disable-proxy-on-dns-records).

</details>

<details>

<summary>Domain already connected error: you subdomain is already configured for different content. </summary>

A custom domain assigned to a site must be unique. Attempting to use the same custom domain in more than one location will result in an error.

The solution to this error will always be one of two things, however:

1. Choose a different custom domain; or
2. Disconnect the custom domain from the content it is already connected to, then reconnect it to the new content.

</details>

