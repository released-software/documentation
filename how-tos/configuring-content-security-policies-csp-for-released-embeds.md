---
description: >-
  To embed Released into your app while maintaining a secure Content Security
  Policy (CSP), you may need to adjust your existing policy to allow certain
  domains used by Released.
---

# Configuring Content Security Policies (CSP) for Released Embeds

{% hint style="info" %}
Please note that these policies cannot be copied as-is and instead must be merged with your existing policy, otherwise your own assets will be blocked by this policy.
{% endhint %}

## **CSP Configuration** <a href="#csp-configuration" id="csp-configuration"></a>

### **Strictest CSP Policy** <a href="#strictest-csp-policy" id="strictest-csp-policy"></a>

At a minimum, the following CSP should work for most users embedding Released:

**Copy**

```
Content-Security-Policy: 
  connect-src https://api.released.so https://events.released.so; 
  script-src https://embed.released.so; 
  style-src 'unsafe-inline' https://cdn.released.so https://embed.released.so; 
  img-src https://cdn.released.so https://dwamxgqy3aotj.cloudfront.net; 
  font-src https://embed.released.so
```

### **Recommended CSP Policy** <a href="#recommended-csp-policy" id="recommended-csp-policy"></a>

To simplify updates and future-proof your policy against changes we make, we recommend using the source `https://*.released.so` to allow any subdomain of released.so as a source:

**Copy**

```
Content-Security-Policy: 
  connect-src https://*.released.so; 
  script-src https://*.released.so; 
  style-src 'unsafe-inline' https://*.released.so; 
  img-src https://*.released.so https://dwamxgqy3aotj.cloudfront.net; 
  font-src https://*.released.so
```

This policy covers all potential subdomains of Released, making it easier to accommodate updates or changes in our infrastructure without further adjustments.

### **Additional Media Domains** <a href="#additional-media-domains" id="additional-media-domains"></a>

If you are embedding video files or media content into your release notes and roadmaps and your CSP policy already includes a `media-src` or `default-src` directive, you will need to extend your `media-src` directive to include the locations of those images and videos.

### **Final Recommendations** <a href="#final-recommendations" id="final-recommendations"></a>

For maximum flexibility and security, adopting the wildcard strategy (`*.released.so`) in your CSP will help avoid issues as Released evolves. If you encounter specific errors, [contact our support team ](https://released.so/support)for further assistance.
