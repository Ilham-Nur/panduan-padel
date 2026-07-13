---
name: Kinetic Court
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#424936'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#727a64'
  outline-variant: '#c2cab0'
  surface-tint: '#446900'
  primary: '#446900'
  on-primary: '#ffffff'
  primary-container: '#a3e635'
  on-primary-container: '#416400'
  inverse-primary: '#98da27'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#515f74'
  on-tertiary: '#ffffff'
  tertiary-container: '#c5d3ec'
  on-tertiary-container: '#4d5b70'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b2f746'
  primary-fixed-dim: '#98da27'
  on-primary-fixed: '#121f00'
  on-primary-fixed-variant: '#334f00'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#d5e3fd'
  tertiary-fixed-dim: '#b9c7e0'
  on-tertiary-fixed: '#0d1c2f'
  on-tertiary-fixed-variant: '#3a485c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  score-display:
    fontFamily: Montserrat
    fontSize: 96px
    fontWeight: '800'
    lineHeight: 100px
    letterSpacing: -0.04em
  score-display-mobile:
    fontFamily: Montserrat
    fontSize: 64px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  touch-target-min: 48px
  container-padding: 20px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for the high-energy, social environment of Padel. It prioritizes immediate legibility and high-speed interaction, acknowledging that users will likely be outdoors, under bright sunlight, and using the interface with sweaty hands or during brief breaks in play.

The aesthetic is **Clean Modern-Sport**. It draws from contemporary athletic apparel and high-performance equipment: a mix of surgical precision and high-impact energy. The style utilizes a white-base minimalism to ensure maximum contrast, paired with aggressive, large-scale typography to communicate scores and match states instantly from a distance. The emotional response is one of clarity, athleticism, and professional-grade utility.

## Colors

The palette is optimized for outdoor visibility.
- **Primary (Padel Green):** Used exclusively for interactive actions (Primary Buttons), progress indicators, and "winning" states. It provides a vibrant visual link to the court itself.
- **Secondary (Dark Navy):** Used for structural elements and the heaviest typography. It provides the "anchor" for the UI, ensuring that even in glare, the most critical information remains legible.
- **Background:** A very light cool gray (#F8FAFC) is used instead of pure white to reduce eye strain in bright light while maintaining a clean, airy feel.
- **Surface:** Pure white is reserved for cards and modals to create a subtle layered effect against the background.

## Typography

Typography is the most critical asset for this design system. We use **Montserrat** for all headlines and score displays to convey strength and momentum. The "Score Display" role is an ultra-large style intended for the main counter, ensuring the score is visible even if the phone is resting on a bench several feet away.

**Inter** is used for all functional UI text, labels, and settings. It provides a neutral, highly readable balance to the expressive headlines. All caps with increased letter spacing is used for secondary labels (e.g., "SET 1", "MATCH TIME") to create a clear information hierarchy without needing heavy color.

## Layout & Spacing

This design system uses a **Fluid Content Model** optimized for a PWA experience. 
- **The Score Grid:** On mobile, the score counter should utilize a 2-stack layout (Team A over Team B). On tablets or landscape, this reflows into a side-by-side split screen.
- **Touch-First Philosophy:** All interactive elements must maintain a minimum 48px touch target. Spacing between interactive elements (like + and - score buttons) should be generous (minimum 16px) to prevent accidental taps during active play.
- **Margins:** A consistent 20px outer margin is used on mobile to ensure content doesn't hit the bezel, providing a "safe zone" for holding the device.

## Elevation & Depth

This design system uses **Tonal Layering** combined with high-performance **Ambient Shadows**. 
- **Level 0:** Background (#F8FAFC).
- **Level 1:** Cards and primary surfaces. These use a pure white fill and a soft, wide-spread shadow (15% opacity of the Secondary color) to appear "lifted" from the court.
- **Level 2:** Active states and floating action buttons. These use a slightly tighter shadow with 20% opacity to indicate a higher level of importance.

We avoid heavy gradients. Depth is created through the contrast between the flat, vibrant Primary color and the soft shadows of the containers.

## Shapes

The shape language is defined by **Large Radii**. This echoes the curves of a Padel racket and ball, while making the UI feel friendly and modern.
- **Standard Cards/Buttons:** 16px (`rounded-lg`)
- **Outer Containers:** 24px (`rounded-xl`)
- **Score Increments:** Perfectly circular buttons are used for the primary "+" actions to differentiate them from secondary "-" controls.

## Components

- **Primary Action Buttons:** Solid Padel Green (#A3E635) with Dark Navy text (#0F172A). Large padding (16px vertical, 32px horizontal) and 16px corner radius.
- **Score Cards:** White background, 16px radius, containing the "Score-Display" typography. The card should occupy the maximum available width to emphasize the data.
- **Chips/Status Tags:** Used for "Serving" indicators. These should be small, pill-shaped, and use the Secondary color with white text to stand out against the Padel Green buttons.
- **Input Fields:** Large, 16px rounded borders with a 2px stroke in Padel Green when focused.
- **Lists:** Clean, unbordered rows separated by the background color (#F8FAFC) creating a "slotted" appearance. 
- **Modals:** Slide up from the bottom on mobile, using 24px top-corner radii to create a "sheet" effect that feels tactile.