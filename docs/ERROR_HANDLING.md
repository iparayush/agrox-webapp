# ERROR_HANDLING.md — Standardized API Error System

All API endpoints return errors in this consistent JSON structure:

```json
{
  "success": false,
  "message": "Human readable error summary",
  "code": "ERROR_CODE",
  "errors": [
    {
      "field": "price",
      "message": "Price must be a positive number"
    }
  ]
}
```

## Error Codes
- `VALIDATION_ERROR` (400 Bad Request)
- `UNAUTHORIZED` (401 Unauthorized)
- `FORBIDDEN` (403 Forbidden)
- `NOT_FOUND` (404 Not Found)
- `INSUFFICIENT_STOCK` (409 Conflict)
- `INTERNAL_SERVER_ERROR` (500 Internal Server Error)
