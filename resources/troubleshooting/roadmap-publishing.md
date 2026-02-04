# Roadmap Publishing

## Troubleshooting roadmap publishing problems <a href="#troubleshooting-roadmap-publishing-problems" id="troubleshooting-roadmap-publishing-problems"></a>

If your roadmap fails to publish, or publishes but doesn’t appear in your portal, this guide walks you through the most common causes and how to fix them.

We’ll cover:

1. Roadmap won’t publish (shows an error)
2. Roadmap publishes, but doesn’t show in the portal
3. What to try if nothing here helps

### 1. Roadmap won’t publish <a href="#id-1.-roadmap-wont-publish" id="id-1.-roadmap-wont-publish"></a>

#### 1.1 The roadmap is too large to publish <a href="#id-1.1-the-roadmap-is-too-large-to-publish" id="id-1.1-the-roadmap-is-too-large-to-publish"></a>

When a roadmap grows very large, the publish action can fail behind the scenes due to size limits.

**Typical signs**

* It starts happening after:
  * Adding or filling in **Short description** (or other text fields) for many items
  * Adding a lot more issues to the roadmap

**What you can try**

1. **Reduce what’s included in the roadmap**, then try publishing again:
   * Temporarily remove some **optional fields** (like short description) from your roadmap configuration.
   * Or temporarily narrow down which issues are shown (for example, by project or status).
2. **Try publishing again** after making it smaller.
3. If that works, gradually add fields or issues back until you find the point where it starts failing again.

If you consistently hit a limit even with a fairly small roadmap, contact support – we may need to adjust a backend limit for your site.

#### 1.2 A specific field on the roadmap is causing the failure <a href="#id-1.2-a-specific-field-on-the-roadmap-is-causing-the-failure" id="id-1.2-a-specific-field-on-the-roadmap-is-causing-the-failure"></a>

Sometimes a single field on the roadmap doesn’t publish correctly because of how its data is stored. This can happen in particular with:

* **Parent / hierarchy fields**
* Certain **custom fields**, including fields coming from other products (for example, Jira Product Discovery fields like “Goal impact”)

**Typical signs**

* Roadmap used to publish, then suddenly started failing.
* The failure happens after:
  * Adding a new field to your roadmap, or
  * Changing which fields are shown.

**What you can try**

1. Open your roadmap **configuration** (fields/columns shown on the roadmap).
2. Temporarily **remove recently added or complex fields**, such as:
   * Parent / Epic / higher‑level hierarchy fields
   * Rating, score, or other custom fields
   * Any fields you added “just before it stopped working”
3. Try **publishing again**.
   * If it publishes successfully, you’ve likely found the cause.
4. Add fields back **one by one**, publishing each time:
   * When publishing fails after adding a specific field back, that field is the problem.

If you identify a specific field that always causes publishing to fail, keep it removed from the published roadmap and contact support with:

* The field name
* A screenshot of your roadmap field configuration
* A link to the roadmap

### 2. Roadmap publishes but doesn’t show in the portal <a href="#id-2.-roadmap-publishes-but-doesnt-show-in-the-portal" id="id-2.-roadmap-publishes-but-doesnt-show-in-the-portal"></a>

Sometimes publishing succeeds, but your customers still can’t see the roadmap in your portal. In these cases, the issue is usually configuration, not the publish action itself.

#### 2.1 Roadmap module is not enabled in the portal <a href="#id-2.1-roadmap-module-is-not-enabled-in-the-portal" id="id-2.1-roadmap-module-is-not-enabled-in-the-portal"></a>

Your project portal can show or hide the roadmap and other modules (like changelog). If the roadmap module is turned off, publishing will complete but the roadmap won’t appear to customers.

**What you can try**

1. Go to your project’s **Portal / Customer portal settings**.
2. Look for settings related to **Roadmap** and **Changelog** (or similar modules).
3. Make sure the **Roadmap module is enabled** for the portal you expect customers to use.
4. Save the settings, then **refresh the portal page** and check again.

If you see the changelog but not the roadmap (or vice versa), double‑check that both modules are enabled for that portal.

#### 2.2 Permissions or visibility restrictions <a href="#id-2.2-permissions-or-visibility-restrictions" id="id-2.2-permissions-or-visibility-restrictions"></a>

Even if the roadmap is enabled in the portal, some people may still not see it if they lack access.

**What you can try**

* Check who can access the **portal** itself.
* Confirm that:
  * The roadmap is linked to the **correct project / portal**.
  * The customers you’re testing with have access to that project’s portal.

Try opening the portal in an **incognito/private window** or with a test account that has the same access as your customers, to confirm what they see.

### 3. Still stuck? What to share with support <a href="#id-3.-still-stuck-what-to-share-with-support" id="id-3.-still-stuck-what-to-share-with-support"></a>

If you’ve tried the steps above and publishing still fails, or your roadmap still doesn’t appear, gather the following and contact support:

1. **A link to the roadmap** you’re trying to publish.
2. **A screenshot of the error message** you see when publishing.
3. **Which of these applies to you:**
   * Roadmap fails with an error and never publishes, or
   * Roadmap says it’s published but doesn’t appear in the portal.
4. **Any recent changes** you made shortly before it stopped working, such as:
   * Adding or removing fields from the roadmap
   * Adding custom fields (e.g. “Goal impact” or Parent hierarchy fields)
   * Changing portal settings

Providing this information helps support quickly narrow down whether this is:

* A problem with a specific field on your roadmap, or
* A portal configuration/visibility issue.
