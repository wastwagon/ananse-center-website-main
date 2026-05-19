const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

// Configuration
const WIDTH = 1280;
const HEIGHT = 720;
const OUTPUT_DIR = './thumbnails';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Color palettes for different themes
const colorPalettes = {
    love: {
        primary: '#FF6B6B', // Soft coral
        secondary: '#FFE066', // Warm yellow
        background: '#FFF5F5',
        accent: '#FF8A80'
    },
    integrity: {
        primary: '#4FC3F7', // Soft blue
        secondary: '#A5D6A7', // Soft green
        background: '#E3F2FD',
        accent: '#29B6F6'
    },
    healing: {
        primary: '#7E57C2', // Soft purple
        secondary: '#FFAB91', // Soft peach
        background: '#F3E5F5',
        accent: '#BA68C8'
    },
    excellence: {
        primary: '#FFB300', // Gold
        secondary: '#FFFFFF', // White
        background: '#FFF8E1',
        accent: '#F57F17'
    },
    learning: {
        primary: '#4DB6AC', // Soft teal
        secondary: '#FFCC80', // Soft orange
        background: '#E0F2F1',
        accent: '#26A69A'
    },
    failure: {
        primary: '#78909C', // Soft gray-blue
        secondary: '#FF7043', // Soft orange-red
        background: '#F5F5F5',
        accent: '#546E7A'
    },
    success: {
        primary: '#66BB6A', // Soft green
        secondary: '#FFCA28', // Soft yellow
        background: '#E8F5E8',
        accent: '#4CAF50'
    },
    grace: {
        primary: '#81D4FA', // Soft sky blue
        secondary: '#E1BEE7', // Soft lavender
        background: '#E3F2FD',
        accent: '#4FC3F7'
    }
};

// Typography settings
const typography = {
    titleFont: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    titleSize: 64,
    titleWeight: 'bold',
    subtitleFont: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    subtitleSize: 28,
    subtitleWeight: '600'
};

// Helper functions
function drawRoundedRect(ctx, x, y, width, height, radius, color) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function drawAbstractShape(ctx, x, y, width, height, color, type) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;

    switch (type) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'triangle':
            ctx.beginPath();
            ctx.moveTo(width / 2, 0);
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            ctx.fill();
            break;
        case 'wave':
            ctx.beginPath();
            ctx.moveTo(0, height / 2);
            for (let i = 0; i <= width; i += 10) {
                ctx.lineTo(i, height / 2 + Math.sin(i / 20) * 20);
            }
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            ctx.fill();
            break;
        case 'lines':
            ctx.beginPath();
            for (let i = 0; i < width; i += 40) {
                ctx.moveTo(i, 0);
                ctx.lineTo(i + 20, height);
            }
            ctx.lineWidth = 8;
            ctx.strokeStyle = color;
            ctx.stroke();
            break;
        case 'gradient':
            const grad = ctx.createLinearGradient(0, 0, width, height);
            grad.addColorStop(0, color);
            grad.addColorStop(1, 'rgba(255,255,255,0.3)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
            break;
    }
    ctx.restore();
}

function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

// Thumbnail generation functions
function createThumbnail(title, subtitle, palette, shapeType, shapeColor, shapePosition) {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    // Draw background
    ctx.fillStyle = palette.background;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Draw abstract shape
    const shapeSize = Math.min(WIDTH, HEIGHT) * 0.6;
    const shapeX = shapePosition === 'left' ? 50 : WIDTH - shapeSize - 50;
    const shapeY = (HEIGHT - shapeSize) / 2;

    drawAbstractShape(ctx, shapeX, shapeY, shapeSize, shapeSize, shapeColor, shapeType);

    // Draw title
    ctx.fillStyle = palette.primary;
    ctx.font = `${typography.titleWeight} ${typography.titleSize}px ${typography.titleFont}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const titleLines = wrapText(ctx, title, WIDTH * 0.8);
    const titleY = HEIGHT * 0.3;

    titleLines.forEach((line, index) => {
        const y = titleY + (index * (typography.titleSize + 10));
        ctx.fillText(line, WIDTH / 2, y);
    });

    // Draw subtitle if provided
    if (subtitle) {
        ctx.fillStyle = palette.secondary;
        ctx.font = `${typography.subtitleWeight} ${typography.subtitleSize}px ${typography.subtitleFont}`;
        ctx.fillText(subtitle, WIDTH / 2, HEIGHT * 0.7);
    }

    return canvas;
}

// Generate all thumbnails
const thumbnails = [
    {
        title: "MARRIAGE & RELATIONSHIPS",
        subtitle: "Love, Partnership & Connection",
        palette: colorPalettes.love,
        shapeType: 'circle',
        shapeColor: colorPalettes.love.accent,
        shapePosition: 'right'
    },
    {
        title: "THE MINDSET OF INTEGRITY",
        subtitle: "Honesty & Values",
        palette: colorPalettes.integrity,
        shapeType: 'gradient',
        shapeColor: colorPalettes.integrity.primary,
        shapePosition: 'left'
    },
    {
        title: "HEALED WOUNDS BUT UGLY SCARS",
        subtitle: "Emotional Healing & Resilience",
        palette: colorPalettes.healing,
        shapeType: 'wave',
        shapeColor: colorPalettes.healing.accent,
        shapePosition: 'left'
    },
    {
        title: "THE NEED FOR EXCELLENCE",
        subtitle: "Achievement & Success",
        palette: colorPalettes.excellence,
        shapeType: 'triangle',
        shapeColor: colorPalettes.excellence.accent,
        shapePosition: 'right'
    },
    {
        title: "EMPOWERING MINDS, SHAPING FUTURES",
        subtitle: "UEW Lecture Series 2025",
        palette: colorPalettes.learning,
        shapeType: 'lines',
        shapeColor: colorPalettes.learning.accent,
        shapePosition: 'left'
    },
    {
        title: "THE MINDSET OF FAILURE",
        subtitle: "Learning & Growth",
        palette: colorPalettes.failure,
        shapeType: 'gradient',
        shapeColor: colorPalettes.failure.primary,
        shapePosition: 'right'
    },
    {
        title: "TOP OF THE TOP TEN",
        subtitle: "ALIVE Nigeria, MEC 2019",
        palette: colorPalettes.success,
        shapeType: 'triangle',
        shapeColor: colorPalettes.success.accent,
        shapePosition: 'left'
    },
    {
        title: "UNCOMFORTABLE GRACE",
        subtitle: "Grace & Challenge",
        palette: colorPalettes.grace,
        shapeType: 'circle',
        shapeColor: colorPalettes.grace.accent,
        shapePosition: 'right'
    }
];

// Generate and save all thumbnails
thumbnails.forEach((config, index) => {
    const canvas = createThumbnail(
        config.title,
        config.subtitle,
        config.palette,
        config.shapeType,
        config.shapeColor,
        config.shapePosition
    );

    const filename = `thumbnail_${index + 1}_${config.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), buffer);

    console.log(`Generated: ${filename}`);
});

console.log('\n✅ All 8 YouTube thumbnails have been generated successfully!');
console.log(`📁 Thumbnails saved to: ${OUTPUT_DIR}`);
console.log('\n🎯 Features:');
console.log('   • 16:9 aspect ratio (1280x720)');
console.log('   • High-resolution PNG format');
console.log('   • Consistent modern minimalistic style');
console.log('   • Soft complementary color palettes');
console.log('   • Bold readable typography');
console.log('   • Abstract symbolic imagery for each topic');
console.log('   • Professional website-ready quality');