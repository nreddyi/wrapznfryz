# Wrapz N Fryz — website (brand edition)

Seven design options, same brand assets:

| Option | Page | Styles | Script | Feel |
|---|---|---|---|---|
| 1 | `index.html` | `css/style.css` | `js/main.js` | Bold & loud: chunky outlines, hunger-o-meter, wrap wheel, sticker board |
| 2 | `index-2.html` | `css/style-2.css` | `js/main-2.js` | Editorial snack zine: serif type, bento tiles, receipt menu, fortune fry, quiz |
| 3 | `index-3.html` | `css/style-3.css` | `js/main-3.js` | Corporate but funny: investor-report look, KPI dashboard, product catalogue table, hunger chart, team order planner, "leadership team", FAQ |
| 4 | `index-4.html` | `css/style-4.css` | `js/main-4.js` | Food first: dark, modern & creative, no jokes. Scroll-driven hero, step-by-step craft, ingredients, menu with hover previews, parallax gallery |
| 5 | `index-5.html` | `css/style-5.css` | `js/main-5.js` | Clean & simple: light, spacious, one font, brand blue accent, simple menu tabs |
| 6 | `index-6.html` | `css/style-6.css` | `js/main-6.js` | Food & fun: brand colours, wavy sections, floating ingredients, "Find your wrap" picker, swipeable menu cards, tap-the-dips, perfect pairs |
| 7 | `index-7.html` | `css/style-7.css` | `js/main-7.js` | Copy of option 6, to be updated with the full menu and categories |

To make another option the homepage, rename `index.html` → `index-1.html` and the chosen file → `index.html`
(then update the "Option" links in its footer).

Logo, colours, clipart, character stickers and photos all come from the
"Wrapz n Frys Logo Presentation" file.

## Brand colours (from the logo presentation)
| Name   | Hex      | Used for                           |
|--------|----------|------------------------------------|
| Blue   | #0D5DBF  | primary, buttons, bands, footer    |
| Blue (wordmark) | #0059AB | logo                      |
| Red    | #F6271E  | accents, CTA, franchise band       |
| Yellow | #F8CB2D  | highlights, tags, footer logo      |
| Cream  | #F9F8F3  | page background (graph-paper grid) |
| Ink    | #140D03  | outlines, text, shadows            |

These live at the top of `css/style.css` (`:root`).

## Folders
```
index.html
css/style.css            all styles
js/main.js               menu data, filters, hunger-o-meter, wheel, fry rain, sticker drag, gallery
images/brand/            logo-wordmark (blue / yellow / cream), logo-monogram (WNF), logo-with-clipart, underline, burst
images/clipart/          brand doodles: fries-box, loaded-fries, wraps-duo, wrap-in-hand, dips, hands, veg, star…
                         (ufo, shake, mojito, dessert are extra drawings recoloured to the brand palette)
images/stickers/         the 4 character stickers
images/photos/           brand photos (wrap hero, wrapped pack, cups, kiosk, window sign, cap)
images/products/         drop real product photos here; they replace the menu clipart automatically
tools/get-photos.ps1     pulls product photos from wrapznfryz.com
```

Edit the menu in the `MENU` array at the top of `js/main.js`.
Easter eggs: type "fryz" anywhere; click the fries box in the hero three times.
