# Pin npm packages by running ./bin/importmap

pin "application"

# Third-party JavaScript is loaded as ES modules straight from a CDN (no build step).
#
# Uppy is pinned via esm.sh's `?bundle`, which packs Uppy and *all* its dependencies
# (including a single copy of preact) into one ES module. This matters because Uppy's
# UI plugins (Dashboard, StatusBar) use preact hooks: any setup that loads more than one
# preact copy breaks rendering with "Cannot read properties of undefined (reading '__H')".
pin "@hotwired/stimulus", to: "https://cdn.jsdelivr.net/npm/@hotwired/stimulus@3.2.2/+esm"
pin "uppy", to: "https://esm.sh/uppy@5.2.4?bundle"
pin "nanoid", to: "https://cdn.jsdelivr.net/npm/nanoid@5.1.6/+esm"

# Local modules served by Propshaft from app/javascript.
pin "uppy_helper"
pin_all_from "app/javascript/controllers", under: "controllers"
