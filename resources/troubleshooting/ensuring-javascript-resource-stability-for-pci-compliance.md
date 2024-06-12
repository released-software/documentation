---
description: >-
  How can I ensure that the referenced JavaScript resource doesn't change for
  PCI compliance reasons?
---

# Ensuring JavaScript Resource Stability for PCI Compliance

To ensure that the referenced JavaScript resource remains stable and doesn't change unexpectedly, follow these steps:

### **Understanding the Current Setup**

* We currently provide a loader file that dynamically references the latest hashed version of the embed code. You can access the loader file here: [https://embed.released.so/1/embed.js](https://embed.released.so/1/embed.js).
* When you load this loader file in the browser, it redirects you to the latest hashed version of the embed code, such as [https://embed.released.so/CeAQG3QB/embed.js](https://embed.released.so/CeAQG3QB/embed.js).

### **Directly Referencing the Hashed File**

Instead of using the loader file, you can directly reference the hashed file. This ensures that the file will not change, thus maintaining PCI compliance. For example, use the URL provided by the loader file (e.g., [https://embed.released.so/CeAQG3QB/embed.js](https://embed.released.so/CeAQG3QB/embed.js)).

### **Benefits of Direct Reference**

* **Stability:** The file content remains consistent and unchanged, preventing unexpected issues.
* **Compliance:** Helps maintain PCI compliance by using a stable, verified file.

### **Considerations**

**Manual Updates:** By referencing the hashed file directly, you will not automatically receive updates or improvements. You will need to manually update to the latest version when it becomes available.

### **Future Versioning**

We have not made any breaking changes to the file to date. Before implementing any such changes, we will introduce proper versioning to ensure seamless updates.

