const fs = require("fs");
const path = require("path");
const { createCanvas, registerFont } = require("canvas");

const CANVAS_SIZE = 512;
const PADDING = 20;
const MAX_FONT_SIZE = 300;
const FONT_PATH = "Verdana.ttf";
const DATA_PATH = "tags.json";

registerFont(FONT_PATH, { family: "CustomFont" });

// Map category → background color
const CATEGORY_COLORS = {
    root: "#fca5a5", // red-300
    meta: "#fed7aa", // orange-200
    content: "#fef08a", // yellow-200
    text: "#d9f99d", // lime-200
    inline: "#a7f3d0", // emerald-200
    media: "#a5f3fc", // cyan-200
    embed: "#bfdbfe", // blue-200
    script: "#ddd6fe", // violet-200
    edit: "#f5d0fe", // fuchsia-200
    table: "#fecdd3", // rose-200
    form: "#e2e8f0", // slate-200
    interactive: "#5eead4", // teal-300
    component: "#a8a29e", // stone-400
    deprecated: "#a5b4fc", // indigo-300

};

// Helper: Fit text into canvas with auto font size
function autoFitText(ctx, text, maxSize, maxWidth, maxHeight) {
    let fontSize = maxSize;

    while (fontSize > 10) {
        ctx.font = `${fontSize}px CustomFont`;

        const metrics = ctx.measureText(text);
        const textWidth = metrics.width;
        const textHeight = fontSize * 1.2; // rough line height estimate

        if (textWidth <= maxWidth && textHeight <= maxHeight) {
            break; // it fits
        }

        fontSize -= 2;
    }

    return { fontSize, lines: [text] };
}

// Render one tag image
function renderTagImage(tag, category) {
    const canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    const ctx = canvas.getContext("2d");

    const label = `<${tag}>`;
    const bgColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.default;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Text
    const maxWidth = CANVAS_SIZE - PADDING * 2;
    const maxHeight = CANVAS_SIZE - PADDING * 2;

    const { fontSize, lines } = autoFitText(ctx, label, MAX_FONT_SIZE, maxWidth, maxHeight);
    ctx.font = `${fontSize}px CustomFont`;
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = Math.max(2, fontSize * 0.05); // scale stroke with font size
    ctx.strokeStyle = "black";
    ctx.strokeText(label, CANVAS_SIZE / 2, CANVAS_SIZE / 2);

    ctx.fillText(label, CANVAS_SIZE / 2, CANVAS_SIZE / 2);

    const filename = `output/${category}-${tag}.png`;
    const out = fs.createWriteStream(filename);
    canvas.createPNGStream().pipe(out);
}

// Main function
function run() {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
    if (!fs.existsSync("output")) fs.mkdirSync("output");

    data.forEach(({ tag, category }) => {
        renderTagImage(tag, category);
    });
}

run();
