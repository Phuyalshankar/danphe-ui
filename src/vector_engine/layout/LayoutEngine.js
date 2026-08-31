
"use strict";

class LayoutEngine {
    constructor() {
        this.ctx = { x: 0, y: 0, w: 1920, h: 1080 };
    }

    compute(ast) {
        let layoutTree = JSON.parse(JSON.stringify(ast));
        this.calculateBounds(layoutTree, this.ctx.x, this.ctx.y, this.ctx.w, this.ctx.h);
        return layoutTree;
    }

    calculateBounds(nodes, startX, startY, parentW, parentH, isHorizontal = false) {
        let currentY = startY;
        let currentX = startX;

        for (let node of nodes) {
            if (node.type === "TEXT_NODE") continue;
            let props = node.props || {};
            let classes = (props.className || props.class || "").split(" ");
            let tag = (node.tag || "").toUpperCase();

            node.layout = { x: currentX, y: currentY, w: parentW, h: 24 };

            let gap = 0; let padding = 0;
            let isFlex = classes.includes("flex") || (props.style && props.style.includes("display:flex"));
            let isCol = classes.includes("flex-col") || (props.style && props.style.includes("flex-direction:column"));
            
            if (tag === "SPAN" || tag === "LABEL" || tag === "DTEXT" || tag === "P" || tag === "A") {
                node.layout.w = 100;
                if (node.children && node.children[0] && node.children[0].type === "TEXT_NODE") {
                    node.layout.w = node.children[0].text.length * 10 + 16;
                }
            }
            if (tag === "BUTTON" || tag === "DBUTTON") {
                node.layout.w = 120;
                node.layout.h = 40;
                if (node.children && node.children[0] && node.children[0].type === "TEXT_NODE") {
                    node.layout.w = node.children[0].text.length * 10 + 32;
                }
            }

            classes.forEach(c => {
                if (c.startsWith("gap-")) gap = parseInt(c.split("-")[1]) * 4;
                if (c.startsWith("p-")) padding = parseInt(c.split("-")[1]) * 4;
                if (c.startsWith("w-") && c !== "w-full") node.layout.w = parseInt(c.split("-")[1]) * 4;
                if (c === "w-full") node.layout.w = parentW;
                if (c.startsWith("h-") && c !== "h-full") node.layout.h = parseInt(c.split("-")[1]) * 4;
                if (c === "h-full") node.layout.h = parentH;
            });

            if (props.style) {
                if (props.style.includes("gap:")) {
                    let m = props.style.match(/gap:\s*(\d+)px/);
                    if (m) gap = parseInt(m[1]);
                }
                if (props.style.includes("padding:")) {
                    let m = props.style.match(/padding:\s*(\d+)px/);
                    if (m) padding = parseInt(m[1]);
                }
                if (props.style.includes("width:")) {
                    let m = props.style.match(/width:\s*(\d+)px/);
                    if (m) node.layout.w = parseInt(m[1]);
                }
                if (props.style.includes("height:")) {
                    let m = props.style.match(/height:\s*(\d+)px/);
                    if (m) node.layout.h = parseInt(m[1]);
                }
            }

            if (node.children && node.children.length > 0) {
                let innerStartX = node.layout.x + padding;
                let innerStartY = node.layout.y + padding;
                let innerW = node.layout.w - (padding * 2);
                let innerH = node.layout.h - (padding * 2);

                if (isFlex && isCol) {
                    this.calculateBounds(node.children, innerStartX, innerStartY, innerW, innerH, false);
                } else if (isFlex && !isCol) {
                    this.calculateBounds(node.children, innerStartX, innerStartY, innerW, innerH, true);
                } else {
                    this.calculateBounds(node.children, innerStartX, innerStartY, innerW, innerH, false);
                }
            }

            if (isHorizontal) currentX += node.layout.w + gap;
            else currentY += node.layout.h + gap;
        }
    }
}
module.exports = { LayoutEngine };

