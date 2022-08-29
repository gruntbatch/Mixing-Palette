/** Mixer is an improved color picker for Adobe Photoshop
    Copyright (C) 2021  Peter Gregory

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>. */

const EVENT_EXCH = 1165517672; // "Exch"
const EVENT_RSET = 1383294324; // "Rset"
const EVENT_SETD = 1936028772; // "setd"

// Establish a line of communication with the host
const csInterface = new CSInterface();
const extensionId = csInterface.getExtensionID();

function getForegroundRGB() {
    return new Promise((resolve, reject) => {
        csInterface.evalScript("getForegroundRGB()", resolve);
    })
    .then(result => JSON.parse(result));
}

function setForegroundRGB([r, g, b]) {
    csInterface.evalScript(`setForegroundRGB(${r}, ${g}, ${b})`);
}

// All colors are stored in RGB
const SWATCH_COUNT = 6;
const FLEX = document.querySelector("#flex")
const SWATCHES = new Array(SWATCH_COUNT);

function createButtons() {
    for (let i=0; i<SWATCH_COUNT; i++) {
        e = document.createElement("div");
        e.onclick = onClick;
        e.oncontextmenu = onContextMenu;
        setColor(e, [0, 0, 0]);
        FLEX.appendChild(e);
        SWATCHES[i] = e;
    }
}

function setColor(e, [r, g, b]) {
    e.dataset.r = r;
    e.dataset.g = g;
    e.dataset.b = b;
    e.style.background = `rgb(${e.dataset.r}, ${e.dataset.g}, ${e.dataset.b})`;
}

function getColor(e) {
    return [e.dataset.r, e.dataset.g, e.dataset.b];
}

// Initialize the panel.
(_ => {
    createButtons();
})();

// Listen for canvas events
function onClick(event) {
    let e = event.target;
    getForegroundRGB().then((rgb) => {
        rgb = lerpRGB(rgb, getColor(e), 0.2);
        setForegroundRGB(rgb);
    });
}

function onContextMenu(event) {
    event.preventDefault();
    let e = event.target;
    getForegroundRGB().then((rgb) => {
        setColor(e, rgb);
    });
}

function lerpRGB(a, b, t) {
    return [
        lerp(a[0], b[0], t),
        lerp(a[1], b[1], t),
        lerp(a[2], b[2], t)
    ]
}

function lerp(a, b, t) {
    return a * (1.0 - t) + b * t;
}