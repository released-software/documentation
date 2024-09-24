# Configuring Content Security Policies (CSP) for Released Embeds

To embed **Released** into your app while maintaining a secure Content Security Policy (CSP), you may need to adjust your existing policy to allow certain domains used by Released. Below are the recommended steps and examples based on a recent customer case.

## **Step-by-Step CSP Configuration**

### **1. Minimum CSP for Released Embeds**

At a minimum, the following CSP should work for most users embedding Released:

```
Content-Security-Policy: 
  connect-src https://api.released.so; 
  script-src https://embed.released.so; 
  style-src 'unsafe-inline' https://cdn.released.so https://embed.released.so; 
  img-src https://cdn.released.so https://dwamxgqy3aotj.cloudfront.net; 
  font-src https://embed.released.so
```

This configuration allows basic functionality, including loading the widget and the styles associated with it.

### **2. Recommended Wildcard CSP Policy**

To simplify updates and future-proof your policy, we recommend wildcarding some of the subdomains like this:

```
Content-Security-Policy: 
  connect-src https://*.released.so; 
  script-src https://*.released.so; 
  style-src 'unsafe-inline' https://*.released.so; 
  img-src https://*.released.so https://dwamxgqy3aotj.cloudfront.net; 
  font-src https://*.released.so
```

This policy covers all potential subdomains of Released, making it easier to accommodate updates or changes in our infrastructure without further adjustments.

### **3. Potential Additional Domains**

If you are hosting video files or media content, you might need to extend your policy with a `media-src` directive. Additionally, be sure to verify if any external services your app uses, such as log management or analytics, require further CSP adjustments.

### **Final Recommendations**

For maximum flexibility and security, adopting the wildcard strategy (`*.released.so`) in your CSP will help avoid issues as Released evolves. If you encounter specific errors, [contact our support team ](https://released.so/support)for further assistance.
