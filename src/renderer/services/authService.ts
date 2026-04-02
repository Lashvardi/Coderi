// კოდერი — ავტორიზაციის სერვისი
// ავტორიზაციის ლოგიკა მართულია:
//   - Main process: src/main/auth.ts (IPC handlers, crypto.scrypt ჰეშირება, users.json)
//   - Renderer: src/renderer/context/AuthContext.tsx (სესიის state, useAuth hook)
//   - Bridge: src/main/preload.ts (window.koderiAPI.auth)
