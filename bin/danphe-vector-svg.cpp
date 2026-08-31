#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_NODES 512
#define MAX_STR 256

typedef struct {
    int op;
    char label[MAX_STR];
    float x, y, w, h;
    char color[32];
    char textColor[32];
    float rx;
    float fs;
} TitanNode;

int extractField(const char* json, const char* key, char* out, int maxLen) {
    char search[64];
    snprintf(search, sizeof(search), "\"%s\":", key);
    const char* pos = strstr(json, search);
    if (!pos) return 0;
    pos += strlen(search);
    while (*pos == ' ') pos++;
    if (*pos == '"') {
        pos++;
        int i = 0;
        while (*pos && *pos != '"' && i < maxLen-1) out[i++] = *pos++;
        out[i] = 0; return 1;
    } else {
        int i = 0;
        while (*pos && *pos != ',' && *pos != '}' && *pos != ']' && i < maxLen-1) out[i++] = *pos++;
        out[i] = 0; return 1;
    }
}

void renderSVG(TitanNode* nodes, int count, float vw, float vh) {
    printf("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
    printf("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 %.0f %.0f\" width=\"100%%\" height=\"100%%\">\n", vw, vh);
    
    // ThorVG-Grade Vector Shaders & Filters
    printf("<defs>\n");
    printf("  <!-- Global Drop Shadow -->\n");
    printf("  <filter id=\"drop-shadow\" x=\"-20%%\" y=\"-20%%\" width=\"140%%\" height=\"140%%\">\n");
    printf("    <feDropShadow dx=\"0\" dy=\"4\" stdDeviation=\"6\" flood-color=\"#000000\" flood-opacity=\"0.6\"/>\n");
    printf("  </filter>\n");
    printf("  <!-- Neon Glow Shaders -->\n");
    printf("  <filter id=\"glow-cyan\" x=\"-30%%\" y=\"-30%%\" width=\"160%%\" height=\"160%%\">\n");
    printf("    <feGaussianBlur stdDeviation=\"3\" result=\"blur\"/>\n");
    printf("    <feMerge><feMergeNode in=\"blur\"/><feMergeNode in=\"SourceGraphic\"/></feMerge>\n");
    printf("  </filter>\n");
    printf("  <filter id=\"glow-amber\" x=\"-30%%\" y=\"-30%%\" width=\"160%%\" height=\"160%%\">\n");
    printf("    <feGaussianBlur stdDeviation=\"3\" result=\"blur\"/>\n");
    printf("    <feMerge><feMergeNode in=\"blur\"/><feMergeNode in=\"SourceGraphic\"/></feMerge>\n");
    printf("  </filter>\n");
    printf("  <!-- Metallic Button Gradients -->\n");
    printf("  <linearGradient id=\"btn-grad-dark\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n");
    printf("    <stop offset=\"0%%\" stop-color=\"#1e293b\" stop-opacity=\"0.95\"/>\n");
    printf("    <stop offset=\"100%%\" stop-color=\"#0a0f1d\" stop-opacity=\"0.98\"/>\n");
    printf("  </linearGradient>\n");
    printf("  <linearGradient id=\"btn-grad-primary\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n");
    printf("    <stop offset=\"0%%\" stop-color=\"#0284c7\"/>\n");
    printf("    <stop offset=\"100%%\" stop-color=\"#0369a1\"/>\n");
    printf("  </linearGradient>\n");
    printf("  <linearGradient id=\"btn-grad-purple\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n");
    printf("    <stop offset=\"0%%\" stop-color=\"#8b5cf6\"/>\n");
    printf("    <stop offset=\"100%%\" stop-color=\"#6d28d9\"/>\n");
    printf("  </linearGradient>\n");
    printf("  <linearGradient id=\"slider-track-bg\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n");
    printf("    <stop offset=\"0%%\" stop-color=\"#050811\"/>\n");
    printf("    <stop offset=\"100%%\" stop-color=\"#0f172a\"/>\n");
    printf("  </linearGradient>\n");
    printf("</defs>\n");

    // Ultra-Modern Anti-Aliased Typography & Micro-Interactions
    printf("<style>\n");
    printf("  text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, sans-serif; user-select: none; letter-spacing: 0.3px; }\n");
    printf("  .titan-hardware-btn { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }\n");
    printf("  .titan-hardware-btn:hover { filter: brightness(1.25); cursor: pointer; }\n");
    printf("  .titan-hardware-btn:hover .btn-border { stroke: #38bdf8; stroke-width: 1.5; opacity: 1; }\n");
    printf("  .titan-slider-group:hover .slider-thumb { transform: scale(1.15); }\n");
    printf("  .slider-thumb { transition: transform 0.15s ease; }\n");
    printf("</style>\n");

    for (int i = 0; i < count; i++) {
        TitanNode* n = &nodes[i];
        const char* fill = n->color[0] ? n->color : "transparent";
        const char* tc = n->textColor[0] ? n->textColor : "#94a3b8";
        float rx = n->rx > 0 ? n->rx : 0;
        float fs = n->fs > 0 ? n->fs : 12;

        if (n->op == 0x12) { // Container / Glassmorphic Panel
            if (strcmp(n->label, "bg") == 0) {
                printf("<rect x=\"%.1f\" y=\"%.1f\" width=\"%.1f\" height=\"%.1f\" fill=\"%s\"/>\n",
                    n->x, n->y, n->w, n->h, fill);
            } else {
                printf("<g class=\"titan-panel\">\n");
                printf("  <rect x=\"%.1f\" y=\"%.1f\" width=\"%.1f\" height=\"%.1f\" fill=\"%s\" rx=\"%.1f\" stroke=\"rgba(255,255,255,0.07)\" stroke-width=\"1\"/>\n",
                    n->x, n->y, n->w, n->h, fill, rx);
                printf("</g>\n");
            }
        }
        else if (n->op == 0x10) { // ThorVG-Style Tactile Hardware Button
            const char* gradId = "btn-grad-dark";
            if (strstr(fill, "0284c7") || strstr(fill, "cyan") || strstr(fill, "primary")) gradId = "btn-grad-primary";
            else if (strstr(fill, "7c3aed") || strstr(fill, "purple") || strstr(fill, "8b5cf6")) gradId = "btn-grad-purple";

            printf("<g class=\"titan-hardware-btn\">\n");
            // Soft Drop shadow
            printf("  <rect x=\"%.1f\" y=\"%.1f\" width=\"%.1f\" height=\"%.1f\" rx=\"%.1f\" fill=\"#000\" opacity=\"0.4\" filter=\"url(#drop-shadow)\"/>\n",
                n->x, n->y + 1, n->w, n->h, rx > 0 ? rx : 6.0f);
            // Main Gradient Body
            printf("  <rect x=\"%.1f\" y=\"%.1f\" width=\"%.1f\" height=\"%.1f\" rx=\"%.1f\" fill=\"url(#%s)\"/>\n",
                n->x, n->y, n->w, n->h, rx > 0 ? rx : 6.0f, gradId);
            // Inner Specular Top Bevel (ThorVG Highlight)
            printf("  <path d=\"M %.1f %.1f L %.1f %.1f\" stroke=\"rgba(255,255,255,0.22)\" stroke-width=\"1\" stroke-linecap=\"round\"/>\n",
                n->x + (rx > 0 ? rx : 6.0f), n->y + 1, n->x + n->w - (rx > 0 ? rx : 6.0f), n->y + 1);
            // Crisp Border
            printf("  <rect class=\"btn-border\" x=\"%.1f\" y=\"%.1f\" width=\"%.1f\" height=\"%.1f\" rx=\"%.1f\" fill=\"none\" stroke=\"rgba(255,255,255,0.08)\" stroke-width=\"1\"/>\n",
                n->x, n->y, n->w, n->h, rx > 0 ? rx : 6.0f);
            // Cyber LED Dot
            printf("  <circle cx=\"%.1f\" cy=\"%.1f\" r=\"2\" fill=\"%s\" filter=\"url(#glow-cyan)\"/>\n",
                n->x + 8, n->y + n->h/2, tc);

            if (n->label[0] && n->label[0] != ' ') {
                printf("  <text x=\"%.1f\" y=\"%.1f\" text-anchor=\"middle\" dominant-baseline=\"central\" font-size=\"%.0f\" font-weight=\"600\" fill=\"%s\">%s</text>\n",
                    n->x + n->w/2 + 2, n->y + n->h/2, fs, tc, n->label);
            }
            printf("</g>\n");
        }
        else if (n->op == 0x16) { // Typography / Section Headers
            printf("<text x=\"%.1f\" y=\"%.1f\" dominant-baseline=\"hanging\" font-size=\"%.0f\" font-weight=\"700\" fill=\"%s\" letter-spacing=\"0.6px\">%s</text>\n",
                n->x, n->y, fs > 0 ? fs : 12.0f, tc, n->label);
        }
        else if (n->op == 0x19) { // ThorVG Studio Glow Slider
            float trackY = n->y + 18;
            float trackH = 6;
            float fillW = n->w * 0.58f;
            
            printf("<g class=\"titan-slider-group\" style=\"cursor:pointer;\">\n");
            // Label Left
            printf("  <text x=\"%.1f\" y=\"%.1f\" font-size=\"11\" font-weight=\"600\" fill=\"#94a3b8\">%s</text>\n",
                n->x, n->y + 9, n->label);
            // Numeric Pill Right
            printf("  <rect x=\"%.1f\" y=\"%.1f\" width=\"38\" height=\"15\" rx=\"4\" fill=\"#070d19\" stroke=\"rgba(255,255,255,0.08)\" stroke-width=\"1\"/>\n",
                n->x + n->w - 38, n->y);
            printf("  <text x=\"%.1f\" y=\"%.1f\" text-anchor=\"middle\" font-size=\"9.5\" font-weight=\"700\" fill=\"%s\">58%%</text>\n",
                n->x + n->w - 19, n->y + 11, tc);

            // Track Inset Well
            printf("  <rect x=\"%.1f\" y=\"%.1f\" width=\"%.1f\" height=\"%.1f\" rx=\"3\" fill=\"url(#slider-track-bg)\" stroke=\"rgba(255,255,255,0.05)\" stroke-width=\"1\"/>\n",
                n->x, trackY, n->w, trackH);
            // Glowing Active Gradient Fill
            printf("  <rect x=\"%.1f\" y=\"%.1f\" width=\"%.1f\" height=\"%.1f\" rx=\"3\" fill=\"%s\" opacity=\"0.95\"/>\n",
                n->x, trackY, fillW, fill);
            // Highlight specular line on track
            printf("  <line x1=\"%.1f\" y1=\"%.1f\" x2=\"%.1f\" y2=\"%.1f\" stroke=\"rgba(255,255,255,0.35)\" stroke-width=\"0.8\"/>\n",
                n->x + 2, trackY + 1, n->x + fillW - 2, trackY + 1);

            // 3D Metallic Precision Thumb Knob
            printf("  <g class=\"slider-thumb\" transform=\"translate(%.1f, %.1f)\">\n", n->x + fillW, trackY + 3);
            printf("    <circle cx=\"0\" cy=\"0\" r=\"8\" fill=\"#0b1220\" stroke=\"%s\" stroke-width=\"2\" filter=\"url(#drop-shadow)\"/>\n", tc);
            printf("    <circle cx=\"0\" cy=\"0\" r=\"4\" fill=\"%s\"/>\n", tc);
            printf("    <circle cx=\"-2\" cy=\"-2\" r=\"1.5\" fill=\"rgba(255,255,255,0.7)\"/>\n");
            printf("  </g>\n");
            printf("</g>\n");
        }
    }
    printf("</svg>\n");
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        TitanNode demo[2]; memset(demo, 0, sizeof(demo));
        demo[0].op=0x12; demo[0].w=400; demo[0].h=300; strcpy(demo[0].color,"#020617");
        demo[1].op=0x16; demo[1].x=10; demo[1].y=10; strcpy(demo[1].label,"ThorVG Vector Engine Ready"); strcpy(demo[1].textColor,"#38bdf8"); demo[1].fs=14;
        renderSVG(demo, 2, 400, 300); return 0;
    }
    TitanNode nodes[MAX_NODES]; memset(nodes, 0, sizeof(nodes));
    int count = 0;
    float vw = 1920, vh = 1080;
    char buf[131072]; memset(buf, 0, sizeof(buf));
    strncpy(buf, argv[1], sizeof(buf)-1);

    const char* ptr = buf;
    while ((ptr = strchr(ptr, '{')) != NULL && count < MAX_NODES) {
        const char* end = strchr(ptr, '}');
        if (!end) break;
        int len = end - ptr + 1;
        char obj[2048]; if (len > 2047) { ptr=end+1; continue; }
        strncpy(obj, ptr, len); obj[len]=0;
        char tmp[64];
        if (extractField(obj,"op",tmp,sizeof(tmp))) nodes[count].op=(int)strtol(tmp,NULL,16);
        extractField(obj,"label",nodes[count].label,MAX_STR);
        if (extractField(obj,"x",tmp,sizeof(tmp))) nodes[count].x=atof(tmp);
        if (extractField(obj,"y",tmp,sizeof(tmp))) nodes[count].y=atof(tmp);
        if (extractField(obj,"w",tmp,sizeof(tmp))) { nodes[count].w=atof(tmp); if(count==0&&nodes[count].op==0x12) vw=nodes[count].w; }
        if (extractField(obj,"h",tmp,sizeof(tmp))) { nodes[count].h=atof(tmp); if(count==0&&nodes[count].op==0x12) vh=nodes[count].h; }
        if (extractField(obj,"rx",tmp,sizeof(tmp))) nodes[count].rx=atof(tmp);
        if (extractField(obj,"fs",tmp,sizeof(tmp))) nodes[count].fs=atof(tmp);
        extractField(obj,"color",nodes[count].color,32);
        extractField(obj,"textColor",nodes[count].textColor,32);
        count++; ptr=end+1;
    }
    if (count > 0) {
        if (nodes[0].op == 0x12 && nodes[0].w > 0) { vw = nodes[0].w; vh = nodes[0].h; }
        renderSVG(nodes, count, vw, vh);
    }
    return 0;
}