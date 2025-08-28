# Installing Styled Components

To get the cosmic background working, you need to install the styled-components dependency.

## Quick Install

Run this command in your `frontend` directory:

```bash
npm install styled-components@^6.1.0 @types/styled-components@^5.1.34
```

## What This Does

- Installs `styled-components` v6.1.0 for React component styling
- Installs TypeScript types for styled-components
- Enables the BackgroundSystem component to render the cosmic background

## After Installation

1. The cosmic background should now be visible when you run the app
2. The BackgroundSystem component will render behind all content
3. Theme switching will work properly (dark = cosmic background, light = no background)

## Verification

After installation, you should see:
- A deep space gradient background
- Animated starfield with stars and nebulae
- Proper layering behind your test content
- Smooth theme switching between light and dark

## Troubleshooting

If the background still doesn't appear:
1. Check the browser console for any errors
2. Verify styled-components is installed: `npm list styled-components`
3. Ensure the BackgroundSystem component is imported in App.tsx
4. Check that the dark theme is active (the cosmic background only shows in dark mode)
