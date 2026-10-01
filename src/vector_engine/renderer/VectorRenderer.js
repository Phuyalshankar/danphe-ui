
"use strict";

class VectorRenderer {
    render(layoutNodes) {
        return layoutNodes.map(node => this.renderNode(node)).join("");
    }

    renderNode(node) {
        if (node.type === "TEXT_NODE") return node.text;

        let l = node.layout;
        let props = node.props || {};
        let classes = (props.className || props.class || "").split(" ");
        let tag = (node.tag || "").toUpperCase();
        
        let fill = "transparent";
        let stroke = "none";
        let rx = 0;
        let fontSize = 14;
        let textColor = "#94a3b8"; // Default slate text

        classes.forEach(c => {
            if (c.startsWith("bg-[")) fill = c.replace("bg-[", "").replace("]", "");
            else if (c === "bg-slate-900") fill = "#0f172a";
            else if (c === "bg-slate-950") fill = "#020617";
            else if (c === "bg-slate-800") fill = "#1e293b";
            else if (c === "bg-cyan-500") fill = "#06b6d4";

            if (c.startsWith("text-[")) textColor = c.replace("text-[", "").replace("]", "");
            else if (c === "text-cyan-400") textColor = "#22d3ee";
            else if (c === "text-slate-200") textColor = "#e2e8f0";
            else if (c === "text-white") textColor = "#ffffff";

            if (c.startsWith("rounded-")) rx = parseInt(c.split("-")[1]) === "xl" ? 12 : (c === "rounded-full" ? 20 : 6);
            if (c.includes("font-bold") || c.includes("font-black")) fontSize += 4;
        });

        if (props.style) {
            if (props.style.includes("background:")) {
                let bgMatch = props.style.match(/background:\s*([^;]+)/);
                if (bgMatch) fill = bgMatch[1].trim();
            }
            if (props.style.includes("color:")) {
                let colMatch = props.style.match(/color:\s*([^;]+)/);
                if (colMatch) textColor = colMatch[1].trim();
            }
        }

        let innerContent = "";
        if (node.children) innerContent = this.render(node.children);

        let idAttr = props.id ? " id=\"" + props.id + "\"" : "";
        let onclickAttr = props.onclick ? " onclick=\"" + props.onclick + "\"" : "";

        if (tag === "DIV" || tag === "DBOX" || tag === "NAV" || tag === "HEADER" || tag === "SECTION") {
            return "<g" + idAttr + onclickAttr + "><rect x=\"" + l.x + "\" y=\"" + l.y + "\" width=\"" + l.w + "\" height=\"" + l.h + "\" fill=\"" + fill + "\" rx=\"" + rx + "\" ry=\"" + rx + "\" />" + innerContent + "</g>";
        }
        else if (tag === "SPAN" || tag === "P" || tag === "H1" || tag === "H2" || tag === "LABEL" || tag === "DTEXT" || tag === "A") {
            return "<text x=\"" + l.x + "\" y=\"" + (l.y + fontSize + 2) + "\" font-family=\"monospace\" font-size=\"" + fontSize + "\" fill=\"" + textColor + "\"" + onclickAttr + ">" + innerContent.trim() + "</text>";
        }
        else if (tag === "BUTTON" || tag === "DBUTTON") {
            return "<g" + idAttr + onclickAttr + " class=\"cursor-pointer\"><rect x=\"" + l.x + "\" y=\"" + l.y + "\" width=\"" + l.w + "\" height=\"" + l.h + "\" fill=\"" + fill + "\" rx=\"" + (rx || 4) + "\" ry=\"" + (rx || 4) + "\" stroke=\"#334155\" stroke-width=\"1\" /><text x=\"" + (l.x + l.w/2) + "\" y=\"" + (l.y + l.h/2 + 4) + "\" text-anchor=\"middle\" font-family=\"monospace\" font-size=\"" + fontSize + "\" font-weight=\"bold\" fill=\"" + textColor + "\">" + innerContent.trim() + "</text></g>";
        }
        // Fallback for svg/use/etc
        return "<g>" + innerContent + "</g>";
    }

    compileRoot(ast) {
        const svgBody = this.render(ast);
        return "<svg viewBox=\"0 0 1920 1080\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n<style> text { user-select: none; } .cursor-pointer { cursor: pointer; } .cursor-pointer:hover rect:first-child { stroke: #38bdf8; } </style>\n<rect width=\"100%\" height=\"100%\" fill=\"#020617\"/>\n" + svgBody + "\n</svg>";
    }
}
module.exports = { VectorRenderer };

