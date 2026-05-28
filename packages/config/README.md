# @pulse-r24/config

Typed environment configuration using Zod. Import `getConfig()` or `env`.

Example:

```ts
import { getConfig } from '@pulse-r24/config'
const cfg = getConfig()
console.log(cfg.DATABASE_URL)
```
