---
hidden: true
---

# Custom domain

By default, your Product Hub is accessible on a `[subdomain].releasedhub.com` domain.

You can customize this by setting a custom domain, meaning your audience can access your Hub on a chosen domain.

{% stepper %}
{% step %}
#### Choose a subdomain <a href="#choose-a-subdomain" id="choose-a-subdomain"></a>

When choosing a subdomain, you can either use `www` or a custom one. Some commonly used subdomains are:

* `hub.example.com`
* `updates.example.com`
* `roadmaps.example.com`
{% endstep %}

{% step %}
#### Initiate the custom domain setup <a href="#initiate-the-custom-domain-setup" id="initiate-the-custom-domain-setup"></a>

Navigate to the **Global Settings,** then choose **General Settings.**

From here, you'll see a section called su where you can enter the custom domain you chose in the first step. Type it out and click **Next.**
{% endstep %}

{% step %}
#### Configure the DNS <a href="#configure-the-dns" id="configure-the-dns"></a>

At this stage, you'll see a window with three fields: **Type, Name, Target.**

Those are the details you'll use to set your custom domain in your DNS provider. This is done _outside_ GitBook, in the provider you are using for your domain.

Copy the contents of the **Name** and **Target** fields to use in your DNS provider. Each provider is different, so when in doubt, check directly with them how to add this record. You should be able to pick the **Type** of record from a list in your provider.

After adding the record, it might take some time for the changes to propagate. We recommend **waiting at least 1 hour** before moving to the next step. Click **Next** when you are ready
{% endstep %}

{% step %}
#### Finalize your setup <a href="#finalize-your-setup" id="finalize-your-setup"></a>

After adding the record and it being propagated, it's time to go live! GitBook will verify the domain, the record you added and will automatically configure the SSL certificate for your domain.

Once done, you'll receive a notification and can click **Finish**. You can also close the window if you need, and we'll send you a notification once the process is done on our side.
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

