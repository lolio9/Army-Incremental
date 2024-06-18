// Utility functions
function getElement(id) {
    return document.getElementById(id);
}

function querySelectorAll(selector) {
    return document.querySelectorAll(selector);
}

// Function to show the appropriate section
function showSection(sectionId) {
    querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    getElement(sectionId).classList.add('active');

    querySelectorAll('nav ul li a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('onclick').includes(sectionId));
    });
}

// Resource management variables
let money = 0, xp = 0, soldiers = 0, tanks = 0, helicopters = 0, resourceGeneration = 0;
let artillery = 0, drones = 0, navalShips = 0, submarines = 0, jetFighters = 0;
let missileLaunchers = 0, sniperTeams = 0, medicUnits = 0, heavyTanks = 0, stealthBombers = 0;
let achievements = [];
let activeMissions = {};

const unitPowers = {
    'Soldier': 10, 'Tank': 50, 'Helicopter': 100, 'Artillery': 500, 'Drone': 800,
    'Naval Ship': 1200, 'Submarine': 1500, 'Jet Fighter': 2000, 'Missile Launcher': 2500,
    'Sniper Team': 3000, 'Medic Unit': 3500, 'Heavy Tank': 4000, 'Stealth Bomber': 4500
};

const upgradeCosts = {
    'Soldier': 10, 'Tank': 30, 'Helicopter': 50, 'Artillery': 250, 'Drone': 400,
    'Naval Ship': 600, 'Submarine': 750, 'Jet Fighter': 1000, 'Missile Launcher': 1250,
    'Sniper Team': 1500, 'Medic Unit': 1750, 'Heavy Tank': 2000, 'Stealth Bomber': 2250
};

// Resource update function
function updateResources() {
    const elementsToUpdate = {
        money, xp, soldiers, tanks, helicopters, artillery, drones, navalShips,
        submarines, jetFighters, missileLaunchers, sniperTeams, medicUnits,
        heavyTanks, stealthBombers, resourceGeneration
    };

    Object.keys(elementsToUpdate).forEach(key => {
        getElement(key).innerText = elementsToUpdate[key];
    });

    getElement('totalMoney').innerText = money;
    getElement('totalXP').innerText = xp;

    // Update barracks power and cost
    Object.keys(unitPowers).forEach(unit => {
        getElement(`${unit.toLowerCase()}Power`).innerText = unitPowers[unit];
        getElement(`${unit.toLowerCase()}UpgradeCost`).innerText = upgradeCosts[unit];
    });
}

// Game starter
function startGame() {
    setInterval(() => {
        money += resourceGeneration;
        updateResources();
    }, 1000);
}

// Mission handling
function startMission(missionName, moneyReward, xpReward, duration) {
    showModal('missionModal');
    getElement('missionTitle').innerText = missionName;
    getElement('missionDescription').innerText = `Duration: ${duration} minutes`;
    getElement('missionRewards').innerText = `Rewards: ${moneyReward} Money, ${xpReward} XP`;

    let timeRemaining = duration * 60;
    const countdown = setInterval(() => {
        timeRemaining--;
        getElement('missionCountdown').innerText = `Time remaining: ${Math.floor(timeRemaining / 60)}m ${timeRemaining % 60}s`;
        if (timeRemaining <= 0) {
            clearInterval(countdown);
            closeModal('missionModal');
            addMoney(moneyReward);
            addXP(xpReward);
            alert(`Mission "${missionName}" completed! You received ${moneyReward} Money and ${xpReward} XP.`);
        }
    }, 1000);
}

// Function to update the countdown
function updateCountdown(name, endTime) {
    const now = new Date().getTime();
    const distance = endTime - now;

    if (distance < 0) {
        getElement('missionCountdown').innerText = 'Mission completed!';
        return;
    }

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    getElement('missionCountdown').innerText = `Time remaining: ${minutes}m ${seconds}s`;
}

// Function to complete a mission
function completeMission(name) {
    const mission = activeMissions[name];
    if (!mission) return;

    showCompletionModal(name, mission.rewardMoney, mission.rewardXP);
    delete activeMissions[name];
    updateResources();
}

// Function to show the completion modal
function showCompletionModal(name, rewardMoney, rewardXP) {
    showModal('completionModal');
    getElement('completionTitle').innerText = `Mission ${name} Completed!`;
    getElement('completionMessage').innerText = `You have completed the mission. Claim your reward of ${rewardMoney} Money and ${rewardXP} XP.`;

    const claimButton = getElement('claimRewardButton');
    claimButton.setAttribute('data-reward-money', rewardMoney);
    claimButton.setAttribute('data-reward-xp', rewardXP);
}

// Function to claim mission rewards
function claimMissionReward() {
    const claimButton = getElement('claimRewardButton');
    const rewardMoney = parseInt(claimButton.getAttribute('data-reward-money'));
    const rewardXP = parseInt(claimButton.getAttribute('data-reward-xp'));

    money += rewardMoney;
    xp += rewardXP;
    closeModal('completionModal');
    updateResources();
}

// Function to close modals
function closeModal(modalId) {
    getElement(modalId).style.display = 'none';
}

// Function to update mission list
function updateMissionList() {
    const missionList = getElement('missionList');
    missionList.innerHTML = '';

    Object.entries(activeMissions).forEach(([name, mission]) => {
        const now = new Date().getTime();
        const distance = mission.endTime - now;

        if (distance > 0) {
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const listItem = document.createElement('li');
            listItem.innerText = `${name} - Time remaining: ${minutes}m ${seconds}s`;
            missionList.appendChild(listItem);
        }
    });
}

// Function to show error popups
function showErrorPopup(message) {
    getElement('errorMessage').innerText = message;
    showModal('errorPopup');
}

// Function to craft items
function craftItem(item, cost) {
    if (money >= cost) {
        money -= cost;
        switch (item) {
            case 'Soldier': soldiers++; break;
            case 'Tank': tanks++; break;
            case 'Helicopter': helicopters++; break;
            case 'Artillery': artillery++; break;
            case 'Drone': drones++; break;
            case 'Naval Ship': navalShips++; break;
            case 'Submarine': submarines++; break;
            case 'Jet Fighter': jetFighters++; break;
            case 'Missile Launcher': missileLaunchers++; break;
            case 'Sniper Team': sniperTeams++; break;
            case 'Medic Unit': medicUnits++; break;
            case 'Heavy Tank': heavyTanks++; break;
            case 'Stealth Bomber': stealthBombers++; break;
            default: alert('Unknown item'); return;
        }
        alert(`Crafted: ${item}`);
        updateResources();
    } else {
        alert('Not enough money to craft this item.');
    }
}

// Function to start research
function researchItem(itemName, cost) {
    if (xp >= cost) {
        xp -= cost;
        alert(`You researched ${itemName} for ${cost} XP.`);
        updateResources();
    } else {
        alert('Not enough XP!');
    }
}

// Function to engage in combat
function engageCombat(unit, power, reward) {
    showModal('combatPopup');

    let playerLife = 100;
    let enemyLife = 100;
    const playerLifeBar = getElement('playerLifeBar');
    const enemyLifeBar = getElement('enemyLifeBar');
    const resultMessage = getElement('combatResultMessage');

    playerLifeBar.style.width = `${playerLife}%`;
    enemyLifeBar.style.width = `${enemyLife}%`;

    const combatInterval = setInterval(() => {
        playerLife -= Math.floor(Math.random() * 10);
        enemyLife -= Math.floor(Math.random() * 10 + 5);

        playerLifeBar.style.width = `${Math.max(playerLife, 0)}%`;
        enemyLifeBar.style.width = `${Math.max(enemyLife, 0)}%`;

        if (playerLife <= 0 || enemyLife <= 0) {
            clearInterval(combatInterval);
            if (playerLife > enemyLife) {
                money += reward;
                xp += reward / 2;
                resultMessage.innerHTML = `Victory! You won the combat with ${unit} and earned ${reward} Money and ${reward / 2} XP.`;
            } else {
                resultMessage.innerHTML = `Defeat. You lost the combat with ${unit}. Better luck next time!`;
            }
            updateResources();
        }
    }, 1000);
}

// Function to close combat popup
function closeCombatPopup() {
    getElement('combatPopup').style.display = 'none';
    getElement('combatResultMessage').innerHTML = '';
}

// Function to upgrade units
function upgradeUnit(unit) {
    const cost = upgradeCosts[unit];
    if (xp >= cost) {
        xp -= cost;
        unitPowers[unit] = Math.floor(unitPowers[unit] * 1.25);
        upgradeCosts[unit] = Math.floor(upgradeCosts[unit] * 1.5);
        updateResources();
        showPopup('successPopup');
    } else {
        showPopup('failurePopup');
    }
}

// Function to upgrade economy
function upgradeEconomy(type, cost) {
    if (xp >= cost) {
        xp -= cost;
        switch (type) {
            case 'Resource Generation':
                resourceGeneration += 10;
                break;
            case 'Advanced Logistics':
                // Implement Advanced Logistics upgrade
                break;
            case 'Financial Management':
                // Implement Financial Management upgrade
                break;
            default:
                break;
        }
        showPopup('successPopup');
    } else {
        showPopup('failurePopup');
    }
}

// Function to add achievements
function addAchievement(description) {
    achievements.push(description);
    if (achievements.length > 5) {
        achievements.shift();
    }
    updateAchievements();
}

// Function to update achievements
function updateAchievements() {
    const achievementList = getElement('achievementList');
    achievementList.innerHTML = '';

    achievements.forEach(achievement => {
        const listItem = document.createElement('li');
        listItem.innerText = achievement;
        achievementList.appendChild(listItem);
    });
}

// Function to show rank details
function showRankDetails(rankName) {
    const rank = ranks.find(r => r.name === rankName);
    if (!rank) return;

    const rankDetailsElement = getElement('rankInfo');
    const payGradePattern = /\b(E-\d+|O-\d+|E-9S)\b/g;

    let formattedDescription = rank.description.replace(payGradePattern, match => {
        return `<span class="pay-grade" onclick="showPayGradeDetails('${match}')">${match}</span>`;
    });

    rankDetailsElement.innerHTML = `
        <h3>${rank.name}</h3>
        <p>${formattedDescription}</p>
        <p><strong>Number of officers who have attained this rank:</strong> ${rank.achievementCount}</p>
    `;
    rankDetailsElement.style.display = 'block';
}

// Function to show pay grade details in a modal
function showPayGradeDetails(payGrade) {
    const payGradeInfo = payGrades[payGrade];
    if (!payGradeInfo) return;

    const modal = getElement('payGradeModal');
    modal.style.display = 'block';

    getElement('payGradeTitle').innerText = payGrade;
    getElement('payGradeDescription').innerText = payGradeInfo.description;
    getElement('payGradeSalary').innerText = payGradeInfo.salary;
    getElement('payGradeRequirements').innerText = payGradeInfo.requirements;
}

// Function to show a popup
function showPopup(popupId) {
    getElement(popupId).style.display = 'block';
}

// Function to close a popup
function closePopup(popupId) {
    getElement(popupId).style.display = 'none';
}

// Event listener to close modal when clicking outside
window.onclick = function(event) {
    const modal = getElement('payGradeModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Close modals and popups on close button click
querySelectorAll('.popup-modal .close, .modal .close, .popup-modal .close-button').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        const modal = this.closest('.popup-modal, .modal');
        if (modal) {
            modal.style.display = 'none';
        }
    });
});

// Starting the game
updateResources();
startGame();
