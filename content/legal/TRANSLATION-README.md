# EventUAlly Legal Documents

English is the canonical legal source.

Required locales:
- en — English
- fr — French
- de — German
- hi — Hindi
- ar — Arabic
- ru — Russian
- ja — Japanese
- ko — Korean

Do not publish a partial translation as if it were complete. Until a locale has a complete translation of all three documents, the client should fall back to English.

## Recommended serving model

Expose the documents from one canonical server/website source so the mobile app and website do not maintain separate legal copies.

Example:

`GET /api/legal/privacy?lang=en`

`GET /api/legal/terms?lang=en`

`GET /api/legal/community-guidelines?lang=en`

Return the requested locale when a complete version exists; otherwise return English.

Suggested response metadata:

```json
{
  "document": "privacy-policy",
  "language": "en",
  "version": "1.0",
  "effectiveDate": "2026-09-29",
  "lastUpdated": "2026-09-29",
  "content": "..."
}
```

The app should record which version the user viewed/accepted if acceptance tracking is later required.
