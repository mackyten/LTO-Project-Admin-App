# LTO Admin App

[![CI](https://github.com/mackyten/LTO-Project-Admin-App/actions/workflows/ci.yml/badge.svg)](https://github.com/mackyten/LTO-Project-Admin-App/actions/workflows/ci.yml)

A web dashboard for administrators of the LTO traffic-violation system. It is the back office for the [LTO Enforcer App](https://github.com/mackyten/LTO-Project-Enforcer-App).

## Features

- **Dashboard**: overview cards, paid vs. unpaid chart, violations per month and by address, latest violations and payments, today's payments.
- **Drivers and enforcers**: browse profiles, add and remove enforcers.
- **Appeals**: review driver appeals and their details.
- **Administrators**: manage admin accounts.
- **Account page**: edit profile, upload a photo (Cloudinary), change password.

## Tech stack

- React 19, TypeScript, Vite
- MUI, Recharts
- TanStack Query, Zustand, React Hook Form with Zod
- Firebase (Auth, Firestore, Hosting), Cloudinary for uploads
- GitHub Actions deploy to Firebase Hosting

## Getting started

```bash
npm install
cp .env.example .env   # fill in the Cloudinary and Firebase values
npm run dev
```

Production build: `npm run build`.

## Structure

```
src/
  components/pages/   one folder per page (components, hooks, schema, store)
  cloudinary/         image upload helper
```

## License

[MIT](LICENSE)
