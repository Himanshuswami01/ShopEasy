class SkinToneAnalyzer {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.skinToneData = null;
    }

    // Skin tone categories and their characteristics
    static SKIN_TYPES = {
        COOL: {
            undertones: ['pink', 'red', 'blue'],
            bestColors: ['navy', 'blue', 'purple', 'pink', 'white', 'gray'],
            avoidColors: ['orange', 'yellow', 'olive', 'rust'],
            seasons: ['summer', 'winter']
        },
        WARM: {
            undertones: ['yellow', 'peach', 'golden'],
            bestColors: ['brown', 'orange', 'olive', 'coral', 'cream', 'gold'],
            avoidColors: ['gray', 'black', 'blue', 'purple'],
            seasons: ['spring', 'autumn']
        },
        NEUTRAL: {
            undertones: ['mix of warm and cool'],
            bestColors: ['most colors work well'],
            avoidColors: ['very bright or very muted colors'],
            seasons: ['all seasons']
        }
    };

    async analyzeSkinTone(videoElement) {
        try {
            // Capture frame from video
            this.canvas.width = videoElement.videoWidth;
            this.canvas.height = videoElement.videoHeight;
            this.ctx.drawImage(videoElement, 0, 0);

            // Get face region using face detection
            const faceRegion = await this.detectFace();
            if (!faceRegion) {
                throw new Error('No face detected');
            }

            // Analyze skin pixels in face region
            const skinToneData = this.analyzeSkinPixels(faceRegion);
            this.skinToneData = {
                ...skinToneData,
                colorPalette: this.generateColorPalette(skinToneData.undertone),
                seasonalAnalysis: this.determineSeason(skinToneData)
            };

            return this.skinToneData;
        } catch (error) {
            console.error('Skin tone analysis failed:', error);
            throw error;
        }
    }

    async detectFace() {
        // Simulate face detection
        // In a real app, use a face detection API like TensorFlow.js or Face-API.js
        return {
            x: this.canvas.width * 0.25,
            y: this.canvas.height * 0.2,
            width: this.canvas.width * 0.5,
            height: this.canvas.height * 0.6
        };
    }

    analyzeSkinPixels(faceRegion) {
        const imageData = this.ctx.getImageData(
            faceRegion.x, faceRegion.y,
            faceRegion.width, faceRegion.height
        );
        
        // Calculate average RGB values
        let totalR = 0, totalG = 0, totalB = 0;
        const pixels = imageData.data;
        const numPixels = pixels.length / 4;

        for (let i = 0; i < pixels.length; i += 4) {
            totalR += pixels[i];
            totalG += pixels[i + 1];
            totalB += pixels[i + 2];
        }

        const avgR = totalR / numPixels;
        const avgG = totalG / numPixels;
        const avgB = totalB / numPixels;

        return {
            undertone: this.determineUndertone(avgR, avgG, avgB),
            intensity: this.determineIntensity(avgR, avgG, avgB),
            contrast: this.determineContrast(imageData),
            rgbValues: { r: avgR, g: avgG, b: avgB }
        };
    }

    determineUndertone(r, g, b) {
        // Analyze RGB ratios to determine undertone
        const warmth = (r + g) / b;
        if (warmth > 2.2) return 'warm';
        if (warmth < 1.8) return 'cool';
        return 'neutral';
    }

    determineIntensity(r, g, b) {
        // Calculate overall brightness
        const brightness = (r + g + b) / 3;
        if (brightness > 200) return 'light';
        if (brightness > 150) return 'medium';
        return 'deep';
    }

    determineContrast(imageData) {
        // Analyze value distribution for contrast level
        const histogram = this.calculateHistogram(imageData);
        const variance = this.calculateVariance(histogram);
        
        if (variance > 2000) return 'high';
        if (variance > 1000) return 'medium';
        return 'low';
    }

    generateColorPalette(undertone) {
        const skinType = undertone.toUpperCase();
        return {
            bestColors: SkinToneAnalyzer.SKIN_TYPES[skinType].bestColors,
            avoidColors: SkinToneAnalyzer.SKIN_TYPES[skinType].avoidColors,
            neutrals: this.getNeutralPalette(undertone)
        };
    }

    getNeutralPalette(undertone) {
        const neutrals = {
            warm: ['ivory', 'cream', 'camel', 'brown', 'bronze'],
            cool: ['pure white', 'gray', 'navy', 'charcoal', 'black'],
            neutral: ['off-white', 'taupe', 'medium gray', 'soft black']
        };
        return neutrals[undertone];
    }

    determineSeason(skinData) {
        const { undertone, intensity, contrast } = skinData;
        
        // Determine season based on characteristics
        if (undertone === 'cool') {
            return contrast === 'high' ? 'winter' : 'summer';
        } else if (undertone === 'warm') {
            return intensity === 'light' ? 'spring' : 'autumn';
        }
        
        // For neutral undertones, consider intensity and contrast
        return {
            season: 'neutral',
            leanings: this.determineSeasonalLeanings(intensity, contrast)
        };
    }

    determineSeasonalLeanings(intensity, contrast) {
        return {
            winter: contrast === 'high' ? 0.7 : 0.3,
            summer: contrast === 'low' ? 0.6 : 0.4,
            spring: intensity === 'light' ? 0.7 : 0.3,
            autumn: intensity === 'deep' ? 0.7 : 0.3
        };
    }

    getClothingRecommendations() {
        if (!this.skinToneData) return null;

        const { undertone, intensity, seasonalAnalysis } = this.skinToneData;
        
        return {
            colors: this.skinToneData.colorPalette,
            patterns: this.getRecommendedPatterns(intensity, undertone),
            fabrics: this.getRecommendedFabrics(seasonalAnalysis),
            styling: {
                daytime: this.getDaytimeRecommendations(),
                evening: this.getEveningRecommendations(),
                accessories: this.getAccessoryRecommendations()
            }
        };
    }

    getRecommendedPatterns(intensity, undertone) {
        // Return pattern recommendations based on skin characteristics
        const patterns = {
            light: ['small prints', 'delicate patterns', 'soft stripes'],
            medium: ['medium-sized prints', 'geometric patterns', 'classic stripes'],
            deep: ['bold prints', 'large patterns', 'color blocking']
        };
        return patterns[intensity];
    }

    getRecommendedFabrics(seasonalAnalysis) {
        // Return fabric recommendations based on season
        const fabrics = {
            winter: ['silk', 'crisp cotton', 'wool', 'leather'],
            summer: ['linen', 'light cotton', 'chambray', 'jersey'],
            spring: ['cotton blends', 'light wool', 'chiffon'],
            autumn: ['tweed', 'suede', 'corduroy', 'knits']
        };
        return fabrics[seasonalAnalysis.season];
    }
}

export const skinToneAnalyzer = new SkinToneAnalyzer(); 