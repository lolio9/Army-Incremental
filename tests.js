describe('Army Incremental', function() {
    beforeEach(function() {
        money = 0;
        xp = 0;
        soldiers = 0;
        tanks = 0;
        helicopters = 0;
        drones = 0;
        cyberUnits = 0;
        resourceGeneration = 10;
        activeMissions = {};
        achievements = [];
    });

    it('should start with 0 money and xp', function() {
        expect(money).toBe(0);
        expect(xp).toBe(0);
    });

    it('should increase money and xp over time', function(done) {
        startGame();
        setTimeout(function() {
            expect(money).toBeGreaterThan(0);
            expect(xp).toBeGreaterThan(0);
            done();
        }, 1500);
    });

    it('should start and complete a mission', function(done) {
        spyOn(window, 'alert');
        startMission('Test Mission', 10, 5, 0.1); // Short duration for testing
        setTimeout(function() {
            expect(money).toBe(10);
            expect(xp).toBe(5);
            done();
        }, 150);
    });

    it('should craft a soldier', function() {
        money = 10;
        craftItem('Soldier', 10);
        expect(soldiers).toBe(1);
        expect(money).toBe(0);
    });

    it('should not craft a tank if not enough money', function() {
        money = 10;
        craftItem('Tank', 50);
        expect(tanks).toBe(0);
        expect(money).toBe(10);
    });

    it('should research an item', function() {
        xp = 20;
        researchItem('Infantry Training', 20);
        expect(xp).toBe(0);
    });

    it('should not research an item if not enough xp', function() {
        xp = 10;
        researchItem('Infantry Training', 20);
        expect(xp).toBe(10);
    });

    it('should engage in combat and win', function(done) {
        spyOn(window, 'alert');
        engageCombat('Test Unit', 20, 10);
        setTimeout(function() {
            expect(money).toBeGreaterThanOrEqual(10);
            done();
        }, 3500);
    });

    it('should upgrade a unit', function() {
        xp = 10;
        upgradeUnit('Soldier', 10);
        expect(xp).toBe(0);
    });

    it('should not upgrade a unit if not enough xp', function() {
        xp = 5;
        upgradeUnit('Soldier', 10);
        expect(xp).toBe(5);
    });

    it('should upgrade economy', function() {
        xp = 100;
        upgradeEconomy('Resource Generation', 100);
        expect(resourceGeneration).toBe(20);
        expect(xp).toBe(0);
    });

    it('should add and update achievements', function() {
        addAchievement('Test Achievement');
        expect(achievements.length).toBe(1);
        expect(achievements[0]).toBe('Test Achievement');
    });
});
