# Rezoni Isolated Operations CRM (`admin.rezoni.shop`)

This repository folder contains the isolated, standalone administration portal for Rezoni E-Commerce.

## Security Architecture
- **Completely isolated** from the customer-facing storefront (`rezoni.shop`).
- **Zero hardcoded credentials**: All IDs, secrets, and database keys are ingested exclusively via server environment variables.
- **Timing-safe comparison**: Protects administrative login from timing attacks.
- **Cryptographic HMAC session tokens**: Stored in secure HTTP-only cookies.
- **Direct Cloud Integration**: Queries live Supabase cloud database (`public.orders`, `public.returns`, `public.customers`, `public.reviews`, `public.users`).

## Environment Variables (`.env.local`)
```env
ADMIN_ID=admin@rezoni.shop
ADMIN_PASSWORD=your_secure_password
ADMIN_SESSION_SECRET=your_cryptographic_secret
NEXT_PUBLIC_SUPABASE_URL=https://hvqnllaciizebguorgvc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_STORE_URL=https://rezoni.shop
```

## Running Locally
```bash
npm run dev
# Starts on port 3006: http://localhost:3006
```

## Deploying to Vercel for `admin.rezoni.shop`
1. Create a new project on Vercel linked to the repository.
2. Under **Root Directory**, set: `admin`.
3. Add the environment variables from `.env.local`.
4. Under **Domains**, attach: `admin.rezoni.shop`.
