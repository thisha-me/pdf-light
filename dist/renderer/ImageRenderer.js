"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageRenderer = void 0;
// import { fetch } from 'cross-fetch'; // Not needed in newer Node or use pure http if native constraint is strict?
// User said "No native dependencies", "pure Node.js". Node 18+ has fetch.
// Let's assume standard fetch or http.
const http = __importStar(require("http"));
const https = __importStar(require("https"));
class ImageRenderer {
    static async render(node, context) {
        if (!node.src)
            return;
        try {
            const imageBytes = await ImageRenderer.fetchImage(node.src);
            let image;
            // Embed image based on type (simple check)
            // In a real generic parser we'd check headers or extension
            if (node.src.endsWith('.png')) {
                image = await context.pdfDoc.embedPng(imageBytes);
            }
            else {
                image = await context.pdfDoc.embedJpg(imageBytes);
            }
            const { width, height } = image.scale(0.5); // Simple scaling for now, ideally strictly from styling
            // Check availability
            if (context.cursorY - height < context.margins.bottom) {
                context.addPage();
            }
            context.currentPage.drawImage(image, {
                x: context.cursorX,
                y: context.cursorY - height, // drawImage anchors bottom-left usually, but pdf-lib is bottom-left coord system. 
                // If cursorY is top of where we want to draw, we draw at y.
                // Wait, pdf-lib (0,0) is bottom left.
                // Our cursorY is starting from Top (handled by init logic presumably being PageHeight - MarginTop)
                // So to draw an image below the cursor:
                // The top of the image should be at cursorY.
                // So y = cursorY - height.
                width: width,
                height: height,
            });
            context.cursorY -= height;
        }
        catch (e) {
            console.warn(`Failed to load image: ${node.src}`, e);
        }
    }
    static fetchImage(url) {
        return new Promise((resolve, reject) => {
            const lib = url.startsWith('https') ? https : http;
            const req = lib.get(url, (res) => {
                const chunks = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => resolve(Buffer.concat(chunks)));
            });
            req.on('error', reject);
        });
    }
}
exports.ImageRenderer = ImageRenderer;
