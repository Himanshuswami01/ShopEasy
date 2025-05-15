// User Profile and Points System
const profileSystem = {
    // Points calculation rules
    pointsRules: {
        purchase: 0.1, // 10% of purchase amount in points
        review: 50,    // Points for writing a review
        signup: 100,   // Welcome points
        referral: 200, // Points for referring a friend
        birthday: 150  // Birthday bonus points
    },

    // Get user profile data
    async getUserProfile() {
        // In a real app, this would be an API call
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        return {
            ...userData,
            points: userData.points || 0,
            pointsHistory: userData.pointsHistory || [],
            tier: this.calculateTier(userData.points || 0)
        };
    },

    // Calculate user tier based on points
    calculateTier(points) {
        if (points >= 5000) return 'PLATINUM';
        if (points >= 2000) return 'GOLD';
        if (points >= 500) return 'SILVER';
        return 'BRONZE';
    },

    // Add points to user account
    async addPoints(amount, reason) {
        const userData = await this.getUserProfile();
        const newPoints = userData.points + amount;
        
        const pointsTransaction = {
            date: new Date().toISOString(),
            amount: amount,
            reason: reason,
            balance: newPoints
        };

        userData.points = newPoints;
        userData.pointsHistory = [pointsTransaction, ...(userData.pointsHistory || [])];
        userData.tier = this.calculateTier(newPoints);

        // Save updated user data
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Update UI
        this.updatePointsDisplay();
        return pointsTransaction;
    },

    // Update points display in UI
    updatePointsDisplay() {
        const pointsElements = document.querySelectorAll('.points-balance');
        const tierElements = document.querySelectorAll('.user-tier');
        
        this.getUserProfile().then(profile => {
            pointsElements.forEach(el => el.textContent = profile.points);
            tierElements.forEach(el => el.textContent = profile.tier);
        });
    },

    // Get points history
    async getPointsHistory() {
        const userData = await this.getUserProfile();
        return userData.pointsHistory || [];
    },

    // Calculate points for purchase
    calculatePurchasePoints(amount) {
        return Math.floor(amount * this.pointsRules.purchase);
    }
};

// Initialize profile system
document.addEventListener('DOMContentLoaded', function() {
    profileSystem.updatePointsDisplay();
    
    // Load points history if on the relevant page
    const pointsHistoryContainer = document.querySelector('.points-history');
    if (pointsHistoryContainer) {
        profileSystem.getPointsHistory().then(history => {
            pointsHistoryContainer.innerHTML = history.map(transaction => `
                <div class="points-transaction">
                    <div class="transaction-info">
                        <span class="transaction-reason">${transaction.reason}</span>
                        <span class="transaction-date">${new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                    <div class="transaction-points ${transaction.amount > 0 ? 'earned' : 'spent'}">
                        ${transaction.amount > 0 ? '+' : ''}${transaction.amount}
                    </div>
                </div>
            `).join('');
        });
    }
});

export default profileSystem; 