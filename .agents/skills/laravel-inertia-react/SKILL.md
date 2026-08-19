---
name: laravel-inertia-react
description: Best practices and patterns for full-stack Laravel applications using Inertia.js v2 and React 19. Use when creating Inertia pages, managing forms, handling props, configuring persistent layouts, or routing between Laravel and React.
---

# Laravel Inertia.js (React) Development Guide

This skill guides development for full-stack Laravel applications utilizing **Inertia.js v2** with **React 19**.

## Core Architecture Principles

1. **Pages in `resources/js/Pages/`**:
   - Each page component corresponds to an `Inertia::render('PageName', [...])` call from Laravel.
   - Always export default React components in page files.

2. **Persistent Layouts**:
   - Wrap views inside persistent layouts (e.g. `AppLayout`) to preserve scroll position and avoid re-rendering common UI (like Sidebar or Navbar) on navigation.
   ```jsx
   import AppLayout from '@/components/layout/AppLayout';

   const PeraturanDetailPage = ({ id, peraturan }) => {
     return (
       <AppLayout>
         {/* Page content */}
       </AppLayout>
     );
   };

   export default PeraturanDetailPage;
   ```

3. **Navigation & Links**:
   - Always use `<Link href="/url">` from `@inertiajs/react` for client-side routing instead of standard `<a href="...">` tags.
   - For programmatic navigation, use `router.visit('/url')`, `router.get(...)`, or `router.post(...)`.

4. **Form Handling with `useForm`**:
   - Use `useForm` hook for reactive forms, automatic error binding, and submit state management:
   ```jsx
   import { useForm } from '@inertiajs/react';

   const { data, setData, post, processing, errors, reset } = useForm({
     title: '',
     category: '',
     document: null,
   });

   const submit = (e) => {
     e.preventDefault();
     post('/peraturan', {
       onSuccess: () => reset(),
     });
   };
   ```

5. **Shared Props via `HandleInertiaRequests`**:
   - Global props like `auth.user`, `flash.message`, and app settings are shared through `app/Http/Middleware/HandleInertiaRequests.php`.
   - In React components, access them using `usePage().props`.

6. **Controller Data Flow**:
   - Pass raw array or API Resource data to `Inertia::render()`.
   ```php
   use Inertia\Inertia;
   use Inertia\Response;

   public function show(string $id): Response
   {
       $peraturan = Peraturan::with('category')->findOrFail($id);
       return Inertia::render('PeraturanDetailPage', [
           'peraturan' => $peraturan,
       ]);
   }
   ```
