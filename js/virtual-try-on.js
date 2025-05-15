class VirtualTryOn {
    constructor() {
        this.webcamStream = null;
        this.userMeasurements = null;
        this.skinToneAnalyzed = false;
        this.skinTone = null;
    }

    async initialize() {
        const userData = await profileSystem.getUserProfile();
        if (!this.canAccessFeature(userData.tier)) {
            throw new Error('This feature is only available for Premium and Platinum members');
        }

        this.userMeasurements = userData.measurements;
        await this.setupWebcam();
        if (!this.skinToneAnalyzed) {
            await this.analyzeSkinTone();
        }
    }

    canAccessFeature(tier) {
        const tierChances = {
            'PLATINUM': Infinity,
            'GOLD': 3,
            'SILVER': 1,
            'BRONZE': 0
        };
        
        const usageCount = parseInt(localStorage.getItem('tryOnUsageCount') || '0');
        return usageCount < tierChances[tier];
    }

    async setupWebcam() {
        try {
            this.webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
            const videoElement = document.getElementById('tryOnVideo');
            videoElement.srcObject = this.webcamStream;
        } catch (error) {
            throw new Error('Unable to access camera');
        }
    }

    async analyzeSkinTone() {
        const videoElement = document.getElementById('tryOnVideo');
        this.skinTone = await skinToneAnalyzer.analyzeSkinTone(videoElement);
        this.skinToneAnalyzed = true;
        
        // Update UI with skin tone analysis
        this.updateSkinToneDisplay();
        return this.skinTone;
    }

    updateSkinToneDisplay() {
        const analysisContainer = document.querySelector('.skin-analysis');
        if (!analysisContainer) return;

        const recommendations = skinToneAnalyzer.getClothingRecommendations();
        
        analysisContainer.innerHTML = `
            <div class="analysis-section">
                <h3>Your Skin Tone Analysis</h3>
                <div class="skin-characteristics">
                    <p><strong>Undertone:</strong> ${this.skinTone.undertone}</p>
                    <p><strong>Intensity:</strong> ${this.skinTone.intensity}</p>
                    <p><strong>Season:</strong> ${this.skinTone.seasonalAnalysis.season}</p>
                </div>
            </div>
            
            <div class="analysis-section">
                <h3>Best Colors for You</h3>
                <div class="color-palette">
                    ${recommendations.colors.bestColors.map(color => `
                        <div class="color-swatch" style="background-color: ${color}">
                            <span>${color}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="analysis-section">
                <h3>Style Recommendations</h3>
                <div class="style-tips">
                    <h4>Patterns</h4>
                    <ul>
                        ${recommendations.patterns.map(pattern => `
                            <li>${pattern}</li>
                        `).join('')}
                    </ul>
                    
                    <h4>Fabrics</h4>
                    <ul>
                        ${recommendations.fabrics.map(fabric => `
                            <li>${fabric}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    async tryOnClothing(clothingItem) {
        // Increment usage count
        const usageCount = parseInt(localStorage.getItem('tryOnUsageCount') || '0');
        localStorage.setItem('tryOnUsageCount', usageCount + 1);

        // Virtual try-on logic here
        return {
            fit: this.calculateFit(clothingItem),
            colorMatch: this.analyzeColorMatch(clothingItem),
            styleMatch: this.analyzeStyleMatch(clothingItem)
        };
    }

    calculateFit(item) {
        const measurements = this.userMeasurements;
        // Compare item measurements with user measurements
        return {
            shoulderFit: 'good',
            chestFit: 'slightly loose',
            lengthFit: 'perfect'
        };
    }

    analyzeColorMatch(item) {
        // Compare item color with user's skin tone
        return {
            match: 'excellent',
            recommendation: 'This color complements your skin tone perfectly'
        };
    }

    analyzeStyleMatch(item) {
        // Analyze if the style matches user's preferences and body type
        return {
            match: 'good',
            suggestion: 'Consider styling this with slim-fit pants for a balanced look'
        };
    }

    cleanup() {
        if (this.webcamStream) {
            this.webcamStream.getTracks().forEach(track => track.stop());
        }
    }
}

export const virtualTryOn = new VirtualTryOn(); 