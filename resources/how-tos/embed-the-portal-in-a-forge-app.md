---
description: >-
  This guide explains how to properly configure and embed Released.so widgets in
  Atlassian Forge applications.
---

# Embed the Portal in a Forge App

## Overview

Released.so is a changelog and release notes platform that provides embeddable widgets to display product updates. This documentation covers the complete setup process for integrating Released.so embeds in Forge apps while handling Content Security Policy (CSP) requirements.

## Prerequisites

* A Forge app with UI components
* A Released.so account with an embed widget configured
* Access to your Released.so embed script URL

## Configuration Steps

### Manifest Configuration

The Released.so embed requires multiple types of external resources:

| Permission Type | Address Pattern | Purpose                                          |
| --------------- | --------------- | ------------------------------------------------ |
| `scripts`       | `*.released.so` | Main embed script and dynamically loaded modules |
| `styles`        | `*.released.so` | CSS files including fonts (Inter font family)    |
| `fonts`         | `*.released.so` | Web font files                                   |
| `images`        | `*.released.so` | Post images and other visual assets              |
| `fetch.client`  | `*.released.so` | API calls for loading content                    |

Add the necessary external permissions to your `manifest.yml` file to allow Released.so resources:

```yaml
permissions:
  external:
    fetch:
      client:
        - address: "*.released.so"
    scripts:
      - address: "*.released.so"
    styles:
      - address: "*.released.so"
    fonts:
      - address: "*.released.so"
    images:
      - address: "*.released.so"
```

### Frontend Implementation

#### React/TypeScript Example

```typescript
import React, { useEffect } from 'react';

interface ReleasedEmbedProps {
  embedId: string;
  className?: string;
}

export const ReleasedEmbed: React.FC<ReleasedEmbedProps> = ({ 
  embedId, 
  className = '' 
}) => {
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.src = 'https://embed.released.so/1/embed.js';
    script.async = true;
    script.setAttribute('data-embed-id', embedId);
    
    // Add to document head
    document.head.appendChild(script);
    
    // Cleanup function
    return () => {
      document.head.removeChild(script);
    };
  }, [embedId]);

  return (
    <div 
      className={`released-embed ${className}`}
      id={`released-embed-${embedId}`}
    >
      {/* Released.so content will be injected here */}
    </div>
  );
};
```

#### HTML Example

```html
<!DOCTYPE html>
<html>
<head>
  <script 
    src="https://embed.released.so/1/embed.js" 
    data-embed-id="YOUR_EMBED_ID"
    async>
  </script>
</head>
<body>
  <div id="released-embed">
    <!-- Released.so content will be injected here -->
  </div>
</body>
</html>
```

## Troubleshooting

### Common CSP Violations

If you encounter Content Security Policy violations, verify these configurations:

#### Script Loading Issues

```
Error: Loading the script 'https://embed.released.so/...' violates CSP directive
```

**Solution**: Ensure `scripts: - address: "*.released.so"` is in external permissions.

#### Style Loading Issues

```
Error: Loading stylesheet 'https://embed.released.so/fonts/inter/inter.css' blocked by CSP
```

**Solution**: Add `styles: - address: "*.released.so"` to external permissions.

#### Image Loading Issues

```
Error: Loading image from 'https://cdn.released.so/...' blocked by CSP
```

**Solution**: Add `images: - address: "*.released.so"` to external permissions.

#### Debugging Steps

{% stepper %}
{% step %}
**Check Browser DevTools**

Look for CSP violation errors in the console
{% endstep %}

{% step %}
**Verify Manifest**

Ensure all required external permissions are present
{% endstep %}

{% step %}
**Test Deploy**

Run `forge deploy` after manifest changes
{% endstep %}

{% step %}
**Clear Cache**

Browser cache might retain old CSP policies&#x20;
{% endstep %}
{% endstepper %}

## Best Practices

### Security Considerations

1. **Use Specific Domains**: We use `*.released.so` to allow subdomains but limit to Released.so only
2. **Avoid Wildcards**: Don't use `*` for all domains - be specific to Released.so

### Performance Optimization

1. **Lazy Loading**: Load the embed script only when needed
2. **Async Loading**: Always use `async` attribute on script tags
