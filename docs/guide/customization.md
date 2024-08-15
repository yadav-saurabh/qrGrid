---
title: Customization
outline: deep
---
<script setup>
import ModuleQr from '../.vitepress/components/customization/ModuleQr.vue'
import FinderQr from '../.vitepress/components/customization/FinderQr.vue'
import ColorQr from '../.vitepress/components/customization/ColorQr.vue'
import ShapeQr from '../.vitepress/components/customization/ShapeQr.vue'
import LogoQr from '../.vitepress/components/customization/LogoQr.vue'
</script>

# Customization

Customizing a QR code goes beyond just altering its appearance, it’s about creating a unique visual experience while ensuring that the code remains functional. Whether you’re looking to integrate branding elements, change colors, or add creative flair, understanding the structure of a QR code is essential. Customization allows you to transform a standard black-and-white grid into a compelling design that captures attention and aligns with your brand or project.

In this guide, we’ll dive into the key components that make up a QR code, such as modules, reserved bits, and finder patterns. With these basics in hand, you can confidently explore various customization techniques, from adjusting colors and shapes to embedding logos, all while maintaining the integrity and scannability of the QR code.

::: tip Visualize a QR Code as a Grid
A QR code (quick-response code) is a type of two-dimensional matrix barcode. [Learn more on wikipedia](https://en.wikipedia.org/wiki/QR_code)
:::

## Modules

A QR code is composed of a grid of squares, known as `modules`. These evenly spaced squares intersect to form the code's structure. The dimensions of a QR code are measured by the number of modules it contains, represented as `module x module`.

<ModuleQr />

The QR code shown above has a grid size of `25`, meaning it contains `25 x 25` modules.

## Reserved Bits

Reserved bits in a QR code are specific areas that are set aside for metadata, such as error correction levels and version information. These areas should not be altered during customization, as they ensure the QR code remains scannable and reliable. Reserved bits can appear as either dark or light, depending on the QR code’s specific configuration and size.

### Finder Patterns

Finder patterns are the three large squares located at the corners of a QR code. They help scanners accurately detect and orient the code, regardless of the angle it’s scanned from. These patterns are essential for the functionality of the QR code and should remain unaltered during customization.

<FinderQr />

## Customization Techniques

### Color Customization

You can modify the colors of the QR code to match your brand or aesthetic. However, ensure there is sufficient contrast between the dark and light modules to maintain scanability. Dark modules should remain darker than the light ones.

<ColorQr />

### Shape Customization

Modules can be customized into different shapes, such as circles, hexagons etc. While doing so, maintain the grid structure and ensure that the overall design doesn’t interfere with the QR code’s readability.

<ShapeQr />

### Logo Integration

A logo can be added at the center of the QR code, but it's essential to avoid covering key elements like the finder patterns. Keep the logo size moderate to ensure that the QR code remains functional.

<LogoQr />

## Best Practices for Customization

- **Maintain Contrast** <br> Always ensure there’s enough contrast between the foreground and background colors for easy scanning.
- **Preserve Key Areas** <br> Avoid altering the finder patterns and reserved bits, as they are crucial for the code’s functionality.
- **Test Rigorously** <br> After customization, test the QR code across different devices and scanners to confirm that it remains scannable.
