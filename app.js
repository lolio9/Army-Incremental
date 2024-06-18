// Function to show the appropriate section
function showSection(sectionId) {
    // Select all sections and remove the 'active' class from each
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Add the 'active' class to the selected section
    document.getElementById(sectionId).classList.add('active');

    // Highlight the active navigation link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        if (link.getAttribute('onclick').includes(sectionId)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

let money = 0;
let xp = 0;
let soldiers = 0;
let tanks = 0;
let helicopters = 0;
let resourceGeneration = 0;
let activeMissions = {};
let achievements = [];

let artillery = 0;
let drones = 0;
let navalShips = 0;
let submarines = 0;
let jetFighters = 0;
let missileLaunchers = 0;
let sniperTeams = 0;
let medicUnits = 0;
let heavyTanks = 0;
let stealthBombers = 0;

let unitPowers = {
    'Soldier': 10,
    'Tank': 50,
    'Helicopter': 100,
    'Artillery': 500,
    'Drone': 800,
    'Naval Ship': 1200,
    'Submarine': 1500,
    'Jet Fighter': 2000,
    'Missile Launcher': 2500,
    'Sniper Team': 3000,
    'Medic Unit': 3500,
    'Heavy Tank': 4000,
    'Stealth Bomber': 4500
};

let upgradeCosts = {
    'Soldier': 10,
    'Tank': 30,
    'Helicopter': 50,
    'Artillery': 250,
    'Drone': 400,
    'Naval Ship': 600,
    'Submarine': 750,
    'Jet Fighter': 1000,
    'Missile Launcher': 1250,
    'Sniper Team': 1500,
    'Medic Unit': 1750,
    'Heavy Tank': 2000,
    'Stealth Bomber': 2250
};

function updateResources() {
    document.getElementById('money').innerText = money;
    document.getElementById('xp').innerText = xp;
    document.getElementById('soldierCount').innerText = soldiers;
    document.getElementById('tankCount').innerText = tanks;
    document.getElementById('helicopterCount').innerText = helicopters;
    document.getElementById('artilleryCount').innerText = artillery;
    document.getElementById('droneCount').innerText = drones;
    document.getElementById('navalShipCount').innerText = navalShips;
    document.getElementById('submarineCount').innerText = submarines;
    document.getElementById('jetFighterCount').innerText = jetFighters;
    document.getElementById('missileLauncherCount').innerText = missileLaunchers;
    document.getElementById('sniperTeamCount').innerText = sniperTeams;
    document.getElementById('medicUnitCount').innerText = medicUnits;
    document.getElementById('heavyTankCount').innerText = heavyTanks;
    document.getElementById('stealthBomberCount').innerText = stealthBombers;

    document.getElementById('totalMoney').innerText = money;
    document.getElementById('totalXP').innerText = xp;
    document.getElementById('resourceGeneration').innerText = resourceGeneration;

    // Update barracks power and cost
    for (const unit in unitPowers) {
        document.getElementById(`${unit.toLowerCase()}Power`).innerText = unitPowers[unit];
        document.getElementById(`${unit.toLowerCase()}UpgradeCost`).innerText = upgradeCosts[unit];
    }
}

function startGame() {
    setInterval(() => {
        money += resourceGeneration;
        updateResources();
    }, 1000);
}

// Mission handling
function startMission(missionName, moneyReward, xpReward, duration) {
    const missionModal = document.getElementById('missionModal');
    missionModal.style.display = 'block';
    document.getElementById('missionTitle').innerText = missionName;
    document.getElementById('missionDescription').innerText = `Duration: ${duration} minutes`;
    document.getElementById('missionRewards').innerText = `Rewards: ${moneyReward} Money, ${xpReward} XP`;
    let timeRemaining = duration * 60;
    const countdown = setInterval(() => {
        timeRemaining--;
        document.getElementById('missionCountdown').innerText = `Time remaining: ${Math.floor(timeRemaining / 60)}m ${timeRemaining % 60}s`;
        if (timeRemaining <= 0) {
            clearInterval(countdown);
            closeModal('missionModal');
            addMoney(moneyReward);
            addXP(xpReward);
            alert(`Mission "${missionName}" completed! You received ${moneyReward} Money and ${xpReward} XP.`);
        }
    }, 1000);
}

function completeMission(name) {
    const mission = activeMissions[name];
    if (!mission) return;

    showCompletionModal(name, mission.rewardMoney, mission.rewardXP);
    delete activeMissions[name];
    updateResources();
}

function showCompletionModal(name, rewardMoney, rewardXP) {
    const modal = document.getElementById('completionModal');
    modal.style.display = 'block';
    document.getElementById('completionTitle').innerText = `Mission ${name} Completed!`;
    document.getElementById('completionMessage').innerText = `You have completed the mission. Claim your reward of ${rewardMoney} Money and ${rewardXP} XP.`;
    const claimButton = document.getElementById('claimRewardButton');
    claimButton.setAttribute('data-reward-money', rewardMoney);
    claimButton.setAttribute('data-reward-xp', rewardXP);
}

function claimMissionReward() {
    const rewardMoney = parseInt(claimButton.getAttribute('data-reward-money'));
    const rewardXP = parseInt(claimButton.getAttribute('data-reward-xp'));
    money += rewardMoney;
    xp += rewardXP;
    closeModal('completionModal');
    updateResources();
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

function updateMissionList() {
    const missionList = document.getElementById('missionList');
    missionList.innerHTML = '';

    for (const [name, mission] of Object.entries(activeMissions)) {
        const now = new Date().getTime();
        const distance = mission.endTime - now;

        if (distance > 0) {
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const listItem = document.createElement('li');
            listItem.innerText = `${name} - Time remaining: ${minutes}m ${seconds}s`;
            missionList.appendChild(listItem);
        }
    }
}

// Function to show a custom error popup
function showErrorPopup(message) {
    const errorPopup = document.getElementById('errorPopup');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerText = message;
    errorPopup.style.display = 'block';
}

// Function to close the popup by ID
function closePopupById(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'none';
    }
}

// Crafting
function craftItem(item, cost) {
    if (money >= cost) {
        money -= cost;
        switch (item) {
            case 'Soldier':
                soldiers++;
                break;
            case 'Tank':
                tanks++;
                break;
            case 'Helicopter':
                helicopters++;
                break;
            case 'Artillery':
                artillery++;
                break;
            case 'Drone':
                drones++;
                break;
            case 'Naval Ship':
                navalShips++;
                break;
            case 'Submarine':
                submarines++;
                break;
            case 'Jet Fighter':
                jetFighters++;
                break;
            case 'Missile Launcher':
                missileLaunchers++;
                break;
            case 'Sniper Team':
                sniperTeams++;
                break;
            case 'Medic Unit':
                medicUnits++;
                break;
            case 'Heavy Tank':
                heavyTanks++;
                break;
            case 'Stealth Bomber':
                stealthBombers++;
                break;
            default:
                alert('Unknown item');
        }
        alert(`Crafted: ${item}`);
        updateResources();
    } else {
        alert('Not enough money to craft this item.');
    }
}

// Research management
function researchItem(itemName, cost) {
    if (xp >= cost) {
        xp -= cost;
        document.getElementById('xp').innerText = xp;
        document.getElementById('totalXP').innerText = xp;
        alert(`You researched ${itemName} for ${cost} XP.`);
    } else {
        alert('Not enough XP!');
    }
}

// Combat handling
function engageCombat(unit, power, reward) {
    alert(`Engaging in combat with: ${unit} (Power: ${power})`);
    const result = calculateCombatOutcome(power);
    setTimeout(() => {
        if (result) {
            money += reward;
            xp += reward / 2;
            alert(`Won combat with: ${unit} (Power: ${power})`);
        } else {
            alert(`Lost combat with: ${unit} (Power: ${power})`);
        }
        updateResources();
    }, 3000);
}

function calculateCombatOutcome(power) {
    const enemyPower = Math.floor(Math.random() * (power * 1.5));
    return power > enemyPower;
}

// Functions to handle popups
function showPopup(popupId) {
    document.getElementById(popupId).style.display = 'block';
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

// Upgrade Unit
function upgradeUnit(unit) {
    let cost = upgradeCosts[unit];
    if (xp >= cost) {
        xp -= cost;
        unitPowers[unit] = Math.floor(unitPowers[unit] * 1.25);
        upgradeCosts[unit] = Math.floor(upgradeCosts[unit] * 1.5);
        updateResources();
        showPopup('successPopup'); // Show success popup
    } else {
        showPopup('failurePopup'); // Show failure popup
    }
}

// Economy Upgrade
function upgradeEconomy(type, cost) {
    let currentXP = parseInt(document.getElementById('xp').innerText);
    if (currentXP >= cost) {
        document.getElementById('xp').innerText = currentXP - cost;

        // Specific upgrade logic
        switch (type) {
            case 'Resource Generation':
                resourceGeneration += 10;
                break;
            case 'Advanced Logistics':
                resourceGeneration += 20;
                break;
            case 'Financial Management':
                resourceGeneration += 30;
                break;
            default:
                break;
        }

        showPopup('successPopup');
    } else {
        showPopup('failurePopup');
    }
}

// Achievements
function addAchievement(description) {
    achievements.push(description);
    if (achievements.length > 5) {
        achievements.shift();
    }
    updateAchievements();
}

function updateAchievements() {
    const achievementList = document.getElementById('achievementList');
    achievementList.innerHTML = '';

    achievements.forEach(achievement => {
        const listItem = document.createElement('li');
        listItem.innerText = achievement;
        achievementList.appendChild(listItem);
    });
}

// Rank Details
function showRankDetails(rankName) {
    const rank = ranks.find(r => r.name === rankName);
    if (!rank) return;

    const rankDetailsElement = document.getElementById('rankInfo');
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

// Pay Grade Details
function showPayGradeDetails(payGrade) {
    const payGradeInfo = payGrades[payGrade];
    if (!payGradeInfo) return;

    showModal('payGradeModal');
    document.getElementById('payGradeTitle').innerText = payGrade;
    document.getElementById('payGradeDescription').innerText = payGradeInfo.description;
    document.getElementById('payGradeSalary').innerText = payGradeInfo.salary;
    document.getElementById('payGradeRequirements').innerText = payGradeInfo.requirements;
}

// Show modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('payGradeModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Array containing rank details
const ranks = [
    {
        name: "Private",
        description: "Private (E-1) is the entry-level position for enlisted soldiers in the United States Army. Privates are primarily focused on learning the basic skills and disciplines of military life, including following orders and maintaining equipment. This rank is essential for the Army's operations, forming the backbone of many units and carrying out fundamental tasks. Privates are closely supervised and mentored by higher-ranking soldiers to ensure they develop the necessary competencies for future advancement.",
        achievementCount: "Approximately 15 million soldiers have held this rank since its inception."
    },
    {
        name: "Private Second Class",
        description: "Private Second Class (E-2), often referred to simply as PV2, is the next step for soldiers in their initial career progression. At this rank, soldiers begin to take on more responsibilities and start to specialize in their chosen Military Occupational Specialty (MOS). They continue to receive guidance from NCOs and are expected to perform their duties with increasing proficiency. The promotion to PV2 is typically based on time in service and demonstrating basic military skills.",
        achievementCount: "An estimated 10 million soldiers have progressed to this rank since it was established."
    },
    {
        name: "Private First Class",
        description: "Private First Class (E-3) represents a significant milestone as soldiers gain more experience and competence. PFCs are expected to take on additional duties and start to demonstrate leadership potential among their peers. They play a crucial role in executing daily operations and supporting the overall mission of their units. This rank indicates that a soldier is well-versed in their MOS and is preparing for future advancement into NCO ranks.",
        achievementCount: "About 8 million soldiers have achieved this rank."
    },
    {
        name: "Specialist",
        description: "Specialists (E-4) are seasoned soldiers who have developed a high level of expertise in their specific fields or MOS. While they do not have the same leadership responsibilities as Corporals, Specialists are crucial to the technical and operational functions within their units. They often work closely with higher-ranking NCOs and officers to ensure mission success. This rank recognizes a soldier's proficiency and dedication to their role within the Army.",
        achievementCount: "Roughly 5 million soldiers have held this rank at some point."
    },
    {
        name: "Corporal",
        description: "Corporal (E-4) is a junior Non-Commissioned Officer (NCO) rank that marks the first step into leadership roles within the United States Army. Corporals are typically responsible for leading small teams or squads, guiding and training junior enlisted soldiers under their command. This rank is a testament to a soldier's experience and ability to manage others effectively. Corporals play a crucial role in maintaining discipline and operational readiness in their units.",
        achievementCount: "Around 2 million soldiers have been promoted to this rank historically."
    },
    {
        name: "Sergeant",
        description: "Sergeant (E-5) is a key Non-Commissioned Officer (NCO) rank in the United States Army, where soldiers take on significant leadership responsibilities. Sergeants oversee daily operations, training, and welfare of a larger group of soldiers, often at the squad level. They are critical to mission planning and execution, ensuring their teams perform efficiently and effectively. The rank of Sergeant signifies a high level of trust and capability in managing personnel and resources.",
        achievementCount: "Approximately 4 million soldiers have attained this rank."
    },
    {
        name: "Staff Sergeant",
        description: "Staff Sergeant (E-6) is a senior Non-Commissioned Officer (NCO) rank that involves managing a squad or section and playing a vital role in training and operational planning. Staff Sergeants are responsible for developing and mentoring their subordinate NCOs and enlisted soldiers. They are heavily involved in mission planning and execution, ensuring that their units are prepared and capable. This rank reflects a deep commitment to leadership and the Army's values and standards.",
        achievementCount: "Over 2 million soldiers have held this rank."
    },
    {
        name: "Sergeant First Class",
        description: "Sergeant First Class (E-7) is a senior NCO rank, often referred to as a 'platoon sergeant' due to their role in assisting the platoon leader in leading a platoon. SFCs have extensive experience and are responsible for the welfare, training, and operational readiness of their soldiers. They serve as key advisors to their platoon leaders and are instrumental in maintaining unit cohesion and discipline. The rank of SFC signifies a high degree of professionalism and leadership within the Army.",
        achievementCount: "Over 1 million soldiers have been promoted to this rank."
    },
    {
        name: "Master Sergeant",
        description: "Master Sergeant (E-8) is a senior NCO rank with a focus on managing larger units and overseeing complex operations. They are often assigned as the principal NCO at the battalion or higher levels, providing critical support to officers and ensuring the effective administration of their units. Master Sergeants are experienced leaders who play a pivotal role in planning, coordinating, and executing missions.",
        achievementCount: "Approximately 500,000 soldiers have reached this rank."
    },
    {
        name: "First Sergeant",
        description: "First Sergeant (E-8) is a senior NCO rank typically assigned as the senior enlisted advisor in a company, battery, or troop. They are responsible for the welfare, training, and discipline of all enlisted soldiers within their unit and serve as a key liaison between the unit's officers and enlisted personnel. First Sergeants are known for their leadership and administrative skills, playing a crucial role in maintaining the unit's readiness and morale.",
        achievementCount: "Around 300,000 soldiers have held this prestigious rank."
    },
    {
        name: "Sergeant Major",
        description: "Sergeant Major (E-9) is a senior NCO rank that involves significant leadership responsibilities at the battalion level or higher. They serve as the senior enlisted advisor to the unit commander and are responsible for the welfare, training, and professional development of all enlisted soldiers in their unit. Sergeant Majors are experts in their fields and play a vital role in shaping policy and strategy within their units.",
        achievementCount: "Approximately 200,000 soldiers have held this rank."
    },
    {
        name: "Command Sergeant Major",
        description: "Command Sergeant Major (E-9) is a unique and prestigious rank, serving as the senior enlisted advisor to the commander of a battalion, brigade, or higher-level organization. They provide leadership and guidance to the unit's NCOs and enlisted soldiers and are instrumental in maintaining unit discipline and operational effectiveness. CSMs are deeply involved in planning and executing missions, ensuring that their units meet the highest standards of performance.",
        achievementCount: "Over 100,000 soldiers have been promoted to this rank."
    },
    {
        name: "Sergeant Major of the Army",
        description: "The Sergeant Major of the Army (E-9S) is the highest NCO rank in the United States Army, serving as the senior enlisted advisor to the Army Chief of Staff. This role involves representing the interests of enlisted soldiers at the highest levels of Army leadership and influencing policy and decision-making. The SMA is responsible for ensuring that the concerns and welfare of enlisted personnel are addressed and plays a key role in maintaining the Army's morale and readiness.",
        achievementCount: "Only 16 individuals have ever held this rank."
    },
    {
        name: "Second Lieutenant",
        description: "Second Lieutenant (O-1) is the entry-level rank for commissioned officers in the United States Army, often filled by recent graduates of military academies or ROTC programs. They typically lead a platoon of around 30 soldiers, overseeing their training, discipline, and mission execution. Second Lieutenants are responsible for implementing orders from higher-ranking officers and ensuring their platoon operates effectively. This rank marks the beginning of an officer's leadership journey, where they learn to balance tactical responsibilities with leadership duties.",
        achievementCount: "Approximately 1.5 million officers have started their careers at this rank."
    },
    {
        name: "First Lieutenant",
        description: "First Lieutenant (O-2) is a junior officer rank in the United States Army, often held by individuals who have demonstrated their competence and leadership potential. They may command a platoon or serve as the executive officer in a larger unit, such as a company. First Lieutenants are involved in both the operational and administrative aspects of their units, ensuring that missions are executed smoothly and effectively.",
        achievementCount: "About 1.2 million officers have been promoted to this rank."
    },
    {
        name: "Captain",
        description: "Captain (O-3) is a mid-level commissioned officer rank in the United States Army, usually commanding a company-sized unit of 100 to 200 soldiers. Captains are responsible for the training, administration, and operational effectiveness of their company, as well as the welfare of their soldiers. They play a vital role in planning and executing missions, often acting as the primary leader in various operational scenarios. The rank of Captain signifies a high level of competence in both leadership and tactical skills, making it a critical role in the Army's structure.",
        achievementCount: "Approximately 1 million officers have held this rank."
    },
    {
        name: "Major",
        description: "Major (O-4) is a field-grade officer rank in the United States Army, often serving as the primary staff officer for a brigade or battalion. Majors are responsible for coordinating and overseeing complex operations, providing strategic advice to higher-ranking officers, and ensuring the efficient execution of missions. They often specialize in areas such as operations, intelligence, or logistics, bringing their expertise to bear on the unit's overall effectiveness.",
        achievementCount: "Roughly 700,000 officers have attained this rank."
    },
    {
        name: "Lieutenant Colonel",
        description: "Lieutenant Colonel (O-5) is a senior field-grade officer rank in the United States Army, typically commanding a battalion-sized unit of 300 to 1,000 soldiers. Lieutenant Colonels are responsible for the overall readiness and operational effectiveness of their battalion, overseeing training, administration, and mission execution. They serve as key advisors to higher-level commanders and play a crucial role in planning and leading major operations.",
        achievementCount: "Around 500,000 officers have been promoted to this rank."
    },
    {
        name: "Colonel",
        description: "Colonel (O-6) is a senior officer rank in the United States Army, usually commanding a brigade-sized unit of 3,000 to 5,000 soldiers or serving in senior staff roles at higher headquarters. Colonels are responsible for the strategic planning, coordination, and execution of operations at the brigade level, ensuring that their units achieve mission objectives efficiently and effectively. They work closely with other senior officers and NCOs to maintain unit readiness and operational capability.",
        achievementCount: "Approximately 300,000 officers have held this rank."
    },
    {
        name: "Brigadier General",
        description: "Brigadier General (O-7) is the first of the general officer ranks in the United States Army, typically serving as the commander of a brigade or in senior staff positions. Brigadier Generals are responsible for the strategic oversight and direction of large military units, ensuring that operations are executed in line with overall mission objectives. They provide critical leadership and mentorship to both officers and enlisted personnel, guiding them in complex operational environments.",
        achievementCount: "About 100,000 officers have reached this rank."
    },
    {
        name: "Major General",
        description: "Major General (O-8) is a senior general officer rank in the United States Army, often commanding a division of 10,000 to 15,000 soldiers or serving in high-level staff roles. Major Generals are responsible for the overall strategic direction and operational effectiveness of their divisions, coordinating large-scale missions and managing substantial military resources. They play a pivotal role in shaping military policy and strategy at the highest levels of command.",
        achievementCount: "Approximately 50,000 officers have held this rank."
    },
    {
        name: "Lieutenant General",
        description: "Lieutenant General (O-9) is a high-ranking general officer position in the United States Army, usually commanding a corps or serving in senior positions at Army headquarters. Lieutenant Generals oversee extensive military operations, providing strategic direction and guidance to large, complex units comprising tens of thousands of soldiers. They are involved in planning and executing national defense strategies and often interact with the highest levels of military and civilian leadership.",
        achievementCount: "Around 20,000 officers have attained this rank."
    },
    {
        name: "General",
        description: "General (O-10) is one of the highest ranks in the United States Army, often leading an entire Army command or serving as the chief of staff or in other top-level military positions. Generals have overarching responsibility for large-scale strategic operations, military planning, and international defense policies. They provide guidance and direction to all levels of the Army and are key figures in national security discussions and decisions.",
        achievementCount: "Approximately 10,000 officers have achieved this rank."
    },
    {
        name: "General of the Army",
        description: "General of the Army (O-11) is a five-star general rank, awarded only in times of major war. This rank signifies the highest level of military leadership, often overseeing large-scale military operations or acting as a supreme commander in a significant conflict. Generals of the Army play a critical role in strategic planning and decision-making at the highest levels of government and military command.",
        achievementCount: "Only 5 officers have held this rank."
    }
];

// Array containing pay grade details
const payGrades = {
    "E-1": { title: "E-1", description: "E-1 is the 1st enlisted paygrade in the United States military.", salary: "Monthly Salary: $1,733", requirements: "No prior experience required. Basic training completion is needed." },
    "E-2": { title: "E-2", description: "Rank for soldiers after initial training.", salary: "Monthly Salary: $1,943", requirements: "Completion of basic training and several months of service." },
    "E-3": { title: "E-3", description: "Private First Class (E-3) and Seaman rank, focuses on gaining experience.", salary: "Monthly Salary: $2,043", requirements: "Generally 6 months to a year of service." },
    "E-4": { title: "E-4", description: "Encompasses Specialist and Corporal ranks.", salary: "Monthly Salary: $2,330", requirements: "2 to 4 years of service and a strong performance in their roles." },
    "E-5": { title: "E-5", description: "Sergeant rank, first level of non-commissioned officer (NCO).", salary: "Monthly Salary: $2,610", requirements: "4 to 6 years of service and leadership experience." },
    "E-6": { title: "E-6", description: "Staff Sergeant rank, responsible for training and guiding junior soldiers.", salary: "Monthly Salary: $2,849", requirements: "6 to 8 years of service with advanced leadership skills." },
    "E-7": { title: "E-7", description: "Sergeant First Class, mid-level NCO with significant leadership duties.", salary: "Monthly Salary: $3,245", requirements: "8 to 12 years of service and proven leadership abilities." },
    "E-8": { title: "E-8", description: "Master Sergeant/First Sergeant, senior NCO roles with high responsibilities.", salary: "Monthly Salary: $4,136", requirements: "12 to 18 years of service and extensive leadership experience." },
    "E-9": { title: "E-9", description: "Sergeant Major, the highest NCO rank with vast command responsibilities.", salary: "Monthly Salary: $5,173", requirements: "Over 18 years of service and exceptional leadership." },
    "O-1": { title: "O-1", description: "Second Lieutenant, the entry-level rank for commissioned officers.", salary: "Monthly Salary: $3,287", requirements: "Completion of officer training and commissioning." },
    "O-2": { title: "O-2", description: "First Lieutenant, a junior officer rank with increased responsibilities.", salary: "Monthly Salary: $3,787", requirements: "1 to 2 years of service and completion of initial officer training." },
    "O-3": { title: "O-3", description: "Captain, mid-level officer with command responsibilities.", salary: "Monthly Salary: $4,383", requirements: "2 to 4 years of service and leadership roles." },
    "O-4": { title: "O-4", description: "Major, senior officer with significant command and staff roles.", salary: "Monthly Salary: $5,273", requirements: "4 to 8 years of service with advanced responsibilities." },
    "O-5": { title: "O-5", description: "Lieutenant Colonel, senior officer rank with major command duties.", salary: "Monthly Salary: $6,137", requirements: "8 to 12 years of service with extensive leadership roles." },
    "O-6": { title: "O-6", description: "Colonel, high-ranking officer with significant command responsibilities.", salary: "Monthly Salary: $7,173", requirements: "12 to 18 years of service with top-level command experience." },
    "O-7": { title: "O-7", description: "Brigadier General, the first of the general officer ranks.", salary: "Monthly Salary: $9,137", requirements: "Over 18 years of service with exceptional command and leadership." },
    "O-8": { title: "O-8", description: "Major General, senior general officer with large command duties.", salary: "Monthly Salary: $10,243", requirements: "Extensive service and proven high-level command skills." },
    "O-9": { title: "O-9", description: "Lieutenant General, very high-ranking general officer.", salary: "Monthly Salary: $11,183", requirements: "Outstanding service record and significant command experience." },
    "O-10": { title: "O-10", description: "General, the highest rank in the military.", salary: "Monthly Salary: $12,173", requirements: "Exceptional leadership and over 30 years of service." }
};

function engageCombat(unit, power, reward) {
    const resultElement = document.getElementById('combatResult');
    resultElement.innerHTML = `Engaging in combat with: ${unit} (Power: ${power})...`;
    
    const isVictory = calculateCombatOutcome(power);
    setTimeout(() => {
        if (isVictory) {
            money += reward;
            xp += reward / 2;
            resultElement.innerHTML = `Victory! You won the combat with ${unit} and earned ${reward} Money and ${reward / 2} XP.`;
        } else {
            resultElement.innerHTML = `Defeat. You lost the combat with ${unit}. Better luck next time!`;
        }
        updateResources();
    }, 3000);
}

// Combat popup and animation handling
function engageCombat(unit, power, reward) {
    document.getElementById('combatPopup').style.display = 'block';

    let playerLife = 100;
    let enemyLife = 100;
    const playerLifeBar = document.getElementById('playerLifeBar');
    const enemyLifeBar = document.getElementById('enemyLifeBar');
    const resultMessage = document.getElementById('combatResultMessage');

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

function closeCombatPopup() {
    document.getElementById('combatPopup').style.display = 'none';
    document.getElementById('combatResultMessage').innerHTML = '';
}

function updateCombatOverview() {
    document.getElementById('combatSoldiers').innerText = soldiers;
    document.getElementById('combatTanks').innerText = tanks;
    document.getElementById('combatHelicopters').innerText = helicopters;
    document.getElementById('totalPower').innerText = calculateTotalPower();
}

function calculateTotalPower() {
    return (soldiers * unitPowers['Soldier']) + (tanks * unitPowers['Tank']) + (helicopters * unitPowers['Helicopter']);
}

// Close modals and popups
function closeModalById(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function closePopupById(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'none';
    }
}

document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', function() {
        const modalId = this.getAttribute('data-modal');
        document.getElementById(modalId).style.display = 'none';
    });
});

// Troop loss handling
function handleTroopLoss(playerLife, enemyLife, enemyPower) {
    const playerInitialLife = 100;
    const lifeLost = playerInitialLife - playerLife;
    const powerRatio = lifeLost / playerInitialLife;

    const initialTroops = {
        'Soldiers': soldiers,
        'Tanks': tanks,
        'Helicopters': helicopters
    };

    soldiers -= Math.floor(initialTroops['Soldiers'] * powerRatio);
    tanks -= Math.floor(initialTroops['Tanks'] * powerRatio);
    helicopters -= Math.floor(initialTroops['Helicopters'] * powerRatio);

    soldiers = Math.max(soldiers, 0);
    tanks = Math.max(tanks, 0);
    helicopters = Math.max(helicopters, 0);

    alert(`Troops lost in combat: 
    Soldiers: ${initialTroops['Soldiers'] - soldiers}
    Tanks: ${initialTroops['Tanks'] - tanks}
    Helicopters: ${initialTroops['Helicopters'] - helicopters}`);

    updateResources();
}

function showPayGradeDetails(payGrade) {
    const payGradeDetails = {
        "E-1": { title: "E-1", description: "E-1 is the 1st enlisted paygrade in the United States military.", salary: "Monthly Salary: $1,733", requirements: "No prior experience required. Basic training completion is needed." },
        "E-2": { title: "E-2", description: "Rank for soldiers after initial training.", salary: "Monthly Salary: $1,943", requirements: "Completion of basic training and several months of service." },
        "E-3": { title: "E-3", description: "Private First Class (E-3) and Seaman rank, focuses on gaining experience.", salary: "Monthly Salary: $2,043", requirements: "Generally 6 months to a year of service." },
        "E-4": { title: "E-4", description: "Encompasses Specialist and Corporal ranks.", salary: "Monthly Salary: $2,330", requirements: "2 to 4 years of service and a strong performance in their roles." },
        "E-5": { title: "E-5", description: "Sergeant rank, first level of non-commissioned officer (NCO).", salary: "Monthly Salary: $2,610", requirements: "4 to 6 years of service and leadership experience." },
        "E-6": { title: "E-6", description: "Staff Sergeant rank, responsible for training and guiding junior soldiers.", salary: "Monthly Salary: $2,849", requirements: "6 to 8 years of service with advanced leadership skills." },
        "E-7": { title: "E-7", description: "Sergeant First Class, mid-level NCO with significant leadership duties.", salary: "Monthly Salary: $3,245", requirements: "8 to 12 years of service and proven leadership abilities." },
        "E-8": { title: "E-8", description: "Master Sergeant/First Sergeant, senior NCO roles with high responsibilities.", salary: "Monthly Salary: $4,136", requirements: "12 to 18 years of service and extensive leadership experience." },
        "E-9": { title: "E-9", description: "Sergeant Major, the highest NCO rank with vast command responsibilities.", salary: "Monthly Salary: $5,173", requirements: "Over 18 years of service and exceptional leadership." },
        "O-1": { title: "O-1", description: "Second Lieutenant, the entry-level rank for commissioned officers.", salary: "Monthly Salary: $3,287", requirements: "Completion of officer training and commissioning." },
        "O-2": { title: "O-2", description: "First Lieutenant, a junior officer rank with increased responsibilities.", salary: "Monthly Salary: $3,787", requirements: "1 to 2 years of service and completion of initial officer training." },
        "O-3": { title: "O-3", description: "Captain, mid-level officer with command responsibilities.", salary: "Monthly Salary: $4,383", requirements: "2 to 4 years of service and leadership roles." },
        "O-4": { title: "O-4", description: "Major, senior officer with significant command and staff roles.", salary: "Monthly Salary: $5,273", requirements: "4 to 8 years of service with advanced responsibilities." },
        "O-5": { title: "O-5", description: "Lieutenant Colonel, senior officer rank with major command duties.", salary: "Monthly Salary: $6,137", requirements: "8 to 12 years of service with extensive leadership roles." },
        "O-6": { title: "O-6", description: "Colonel, high-ranking officer with significant command responsibilities.", salary: "Monthly Salary: $7,173", requirements: "12 to 18 years of service with top-level command experience." },
        "O-7": { title: "O-7", description: "Brigadier General, the first of the general officer ranks.", salary: "Monthly Salary: $9,137", requirements: "Over 18 years of service with exceptional command and leadership." },
        "O-8": { title: "O-8", description: "Major General, senior general officer with large command duties.", salary: "Monthly Salary: $10,243", requirements: "Extensive service and proven high-level command skills." },
        "O-9": { title: "O-9", description: "Lieutenant General, very high-ranking general officer.", salary: "Monthly Salary: $11,183", requirements: "Outstanding service record and significant command experience." },
        "O-10": { title: "O-10", description: "General, the highest rank in the military.", salary: "Monthly Salary: $12,173", requirements: "Exceptional leadership and over 30 years of service." }
    };

    const modal = document.getElementById('payGradeModal');
    const title = document.getElementById('payGradeTitle');
    const description = document.getElementById('payGradeDescription');
    const salary = document.getElementById('payGradeSalary');
    const requirements = document.getElementById('payGradeRequirements');

    if (payGradeDetails[payGrade]) {
        title.innerText = payGradeDetails[payGrade].title;
        description.innerText = payGradeDetails[payGrade].description;
        salary.innerText = payGradeDetails[payGrade].salary;
        requirements.innerText = payGradeDetails[payGrade].requirements;
    } else {
        title.innerText = "Pay Grade Details";
        description.innerText = "Details for this pay grade are currently not available.";
        salary.innerText = "";
        requirements.innerText = "";
    }

    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById('payGradeModal');
    modal.style.display = "none";
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('payGradeModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Start the game
updateResources();
startGame();
