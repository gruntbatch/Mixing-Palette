/** Copyright (C) 2021  Peter Gregory */

function getForegroundRGB() {
    var rgb = app.foregroundColor.rgb;
    return ["[", rgb.red, ", ", rgb.green, ", ", rgb.blue, "]"].join("");
}

function setForegroundRGB(r, g, b) {
    // Create a new color object based on the given hsb values, then
    // set foregroundColor once, and only once. This prevents multiple
    // signals being sent back to the client.
    var color = new SolidColor();
    color.rgb.red = r;
    color.rgb.green = g;
    color.rgb.blue = b;
    app.foregroundColor = color;
}
