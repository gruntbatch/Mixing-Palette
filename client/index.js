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

// Establish a line of communication with the host
const csInterface = new CSInterface();

function getForegroundRGB() {
    return new Promise((resolve, reject) => {
        csInterface.evalScript("getForegroundRGB()", resolve);
    })
    .then(result => JSON.parse(result));
}

function setForegroundRGB([r, g, b]) {
    csInterface.evalScript(`setForegroundRGB(${r}, ${g}, ${b})`);
}

const FLEX = document.querySelector("#flex")
let SWATCHES;

// Initialize the panel.
(_ => {
    SWATCHES = load();
    SWATCHES.forEach((value, index) => {
        e = document.createElement("div");
        FLEX.appendChild(e);

        e.index = index;
        setStyle(e, value);

        e.onclick = (event) => {
            let e = event.target;
            getForegroundRGB().then((rgb) => {
                rgb = lerpRGB(rgb, SWATCHES[e.index], 0.1);
                setForegroundRGB(rgb);
            });
        }

        e.oncontextmenu = (event) => {
            event.preventDefault();
            let e = event.target;
            getForegroundRGB().then((rgb) => {
                setStyle(e, rgb);
                SWATCHES[e.index] = rgb;
                save(SWATCHES);
            });
        };
    });
})();

function load() {
    const get = key => Number(window.localStorage.getItem(key)) || 0;
    return new Array(get("sc") || 6).fill([0, 0, 0]).map((_, index) => [
        get(`s${index}r`),
        get(`s${index}g`),
        get(`s${index}b`),
    ]);
}

function save(swatches) {
    const set = (key, value) => window.localStorage.setItem(key, value);
    set("sc", swatches.length);
    swatches.forEach(([r, g, b], index) => {
        set(`s${index}r`, r);
        set(`s${index}g`, g);
        set(`s${index}b`, b);
    });
}

function setStyle(e, [r, g, b]) {
    e.style.background = `rgb(${r}, ${g}, ${b})`;
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