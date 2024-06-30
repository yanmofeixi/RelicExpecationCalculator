const equipmentSlots = ["Feet", "Hands", "Head", "Body", "Link Rope", "Planar Sphere"];
const setTypes = ['Regular', 'Planar']
const stats = [
    "SPD", "CRIT Rate_", "Effect Hit Rate_", "Break Effect_",
    "CRIT DMG_", "ATK_", "ATK", "HP_", "HP", "DEF_", "DEF", "Effect RES_",
    "Energy Regeneration Rate_", "Fire DMG Boost_", "Lightning DMG Boost_", "Quantum DMG Boost_", "Imaginary DMG Boost_",
    "Ice DMG Boost_", "Physical DMG Boost_", "Wind DMG Boost_", "Outgoing Healing Boost_"
];
let jsonData;
let currentCharacterLowerCase;
let currentWeights = {};
let currentRelics =
{
    "Head": {
        "mainstat": "None",
        "substats": [
            {
                "key": "None",
                "value": -1
            },
            {
                "key": "None",
                "value": -1
            },
            {
                "key": "None",
                "value": -1
            },
            {
                "key": "None",
                "value": -1
            }
        ],
    },
    "Hands": {
        "mainstat": "None",
        "substats": [
            {
                "key": "None",
                "value": -1
            },
            {
                "key": "None",
                "value": -1
            },
            {
                "key": "None",
                "value": -1
            },
            {
                "key": "None",
                "value": -1
            }
        ],
    },
    "Feet": {
        "mainstat": "None",
        "substats": [
            {
                "key": "None",
                "value": -1
            },
            {
                "key": "None",
                "value": -1
            },
            {
                "key": "None",
                "value": -1
            },
            {
                "key": "None",
                "value": -1
            }
        ],
    },
    "Body": {
        "mainstat": "None",
        "substats": [
            {
                "key": "None",
                "value": -1
            },
            {
                "key": "None",
                "value": -1
            },
            {
                "key": "None",
                "value": -1
            },
            {
                "key": "None",
                "value": -1
            }
        ],
    },
    "Link Rope": {
        "mainstat": "None",
        "substats": [
            {
                "key": "None",
                "value": -1
            },
            {
                "key": "None",
                "value": -1
            },
            {
                "key": "None",
                "value": -1
            },
            {
                "key": "None",
                "value": -1
            }
        ],
    },
    "Planar Sphere": {
        "mainstat": "None",
        "substats": [
            {
                "key": "None",
                "value": -1
            },
            {
                "key": "None",
                "value": -1
            },
            {
                "key": "None",
                "value": -1
            },
            {
                "key": "None",
                "value": -1
            }
        ],
    }
}

document.getElementById('json-file-input').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                jsonData = JSON.parse(e.target.result);
                updateCharacterSelect();
            } catch (error) {
                alert('Error parsing JSON file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
});

const characterPresets = {
    "firefly": {
        "ATK": 0.15,
        "ATK_": 0.75,
        "SPD": 1,
        "Break Effect_": 1
    }
};

const mainStatMaxFixedValues = {
    "Head": 705,
    "Hands": 352
}

const mainStatMaxValues = {
    "HP": 43.2,
    "ATK": 43.2,
    "DEF": 54,
    "Break Effect": 64.8,
    "Outgoing Healing Boost": 34.5,
    "Effect Hit Rate": 43.2,
    "SPD": 25,
    "Energy Regeneration Rate": 19.4,
    "CRIT DMG": 64.8,
    "CRIT Rate": 32.4,
    "Fire DMG Boost": 38.8,
    "Lightning DMG Boost": 38.8,
    "Ice DMG Boost": 38.8,
    "Wind DMG Boost": 38.8,
    "Quantum DMG Boost": 38.8,
    "Imaginary DMG Boost": 38.8,
    "Physical DMG Boost": 38.8,
}

const regularPieceChances = {
    "Head": 0.25,
    "Hands": 0.25,
    "Feet": 0.25,
    "Body": 0.25,
}

const planarPieceChances = {
    "Link Rope": 0.5,
    "Planar Sphere": 0.5
}

const initialStatCount = {
    3: 0.8,
    4: 0.2
}

const mainStatChances = {
    "Head": {
        "HP": 1
    },
    "Hands": {
        "ATK": 1
    },
    "Feet": {
        "HP": 0.3,
        "ATK": 0.3,
        "DEF": 0.3,
        "SPD": 0.1
    },
    "Body": {
        "HP": 0.2,
        "ATK": 0.2,
        "DEF": 0.2,
        "CRIT DMG": 0.1,
        "CRIT Rate": 0.1,
        "Effect Hit Rate": 0.1,
        "Outgoing Healing Boost": 0.1
    },
    "Link Rope": {
        "HP": 0.2667,
        "ATK": 0.2667,
        "DEF": 0.2667,
        "Break Effect": 0.15,
        "Energy Regeneration Rate": 0.05
    },
    "Planar Sphere": {
        "HP": 0.1233,
        "ATK": 0.1233,
        "DEF": 0.1233,
        "Fire DMG Boost": 0.09,
        "Lightning DMG Boost": 0.09,
        "Ice DMG Boost": 0.09,
        "Wind DMG Boost": 0.09,
        "Quantum DMG Boost": 0.09,
        "Imaginary DMG Boost": 0.09,
        "Physical DMG Boost": 0.09
    }
}

const substatTypeChances = {
    "HP": 0.1,
    "ATK": 0.1,
    "DEF": 0.1,
    "HP_": 0.1,
    "ATK_": 0.1,
    "DEF_": 0.1,
    "Break Effect_": 0.08,
    "Effect RES_": 0.08,
    "Effect Hit Rate_": 0.08,
    "CRIT DMG_": 0.06,
    "CRIT Rate_": 0.06,
    "SPD": 0.04
}

const substatValueChances = {
    "HP": {
        34: 0.33,
        38: 0.33,
        42: 0.33
    },
    "ATK": {
        17: 0.33,
        19: 0.33,
        21: 0.33
    },
    "DEF": {
        17: 0.33,
        19: 0.33,
        21: 0.33
    },
    "HP_": {
        3.46: 0.33,
        3.89: 0.33,
        4.32: 0.33
    },
    "ATK_": {
        3.46: 0.33,
        3.89: 0.33,
        4.32: 0.33
    },
    "DEF_": {
        4.32: 0.33,
        4.86: 0.33,
        5.4: 0.33
    },
    "Break Effect_": {
        5.18: 0.33,
        5.83: 0.33,
        6.48: 0.33
    },
    "Effect RES_": {
        3.46: 0.33,
        3.89: 0.33,
        4.32: 0.33
    },
    "Effect Hit Rate_": {
        3.46: 0.33,
        3.89: 0.33,
        4.32: 0.33
    },
    "CRIT DMG_": {
        5.18: 0.33,
        5.83: 0.33,
        6.48: 0.33
    },
    "CRIT Rate_": {
        2.59: 0.33,
        2.92: 0.33,
        3.24: 0.33
    },
    "SPD": {
        2: 0.33,
        2.3: 0.33,
        2.6: 0.33
    },
}


function createEquipmentInputs() {
    const container = document.getElementById('equipment-container');
    container.innerHTML = '';  // Clear existing equipment inputs
    equipmentSlots.forEach(slot => {
        const equipment = document.createElement('div');
        equipment.className = 'equipment';
        equipment.innerHTML = `<h3>${slot}</h3>`;

        for (let i = 1; i <= 4; i++) {
            const statRow = document.createElement('div');
            statRow.className = 'stat-row';
            statRow.innerHTML = `
                <select id="${slot}-stat${i}">
                    <option value="None">None</option>
                    ${stats.map(stat => `<option value="${stat}">${formatStatName(stat)}</option>`).join('')}
                </select>
                <input type="number" id="${slot}-value${i}" placeholder="Value" step="0.1">
            `;
            equipment.appendChild(statRow);
        }

        container.appendChild(equipment);
    });
}

function displayPresetWeights() {
    const presetWeightsDiv = document.getElementById('preset-weights');
    const weightsContent = Object.entries(currentWeights)
        .filter(([_, weight]) => weight > 0)
        .sort(([, a], [, b]) => b - a)
        .map(([stat, weight]) => `<div>${formatStatName(stat)}: ${weight}</div>`)
        .join('');

    presetWeightsDiv.innerHTML = `<div style="display: flex; gap: 10px;">${weightsContent}</div>`;
}

function findSlotElement(slot) {
    const h3Elements = document.querySelectorAll('.equipment h3');
    for (let h3 of h3Elements) {
        if (h3.textContent.includes(slot)) {
            return h3;
        }
    }
    return null;
}

function formatStatName(stat) {
    return stat.endsWith('_') ? stat.slice(0, -1) + '%' : stat;
}

function generateRelic(setTypeInput = 'None', farmCountInput = 0) {
    const farmCount = farmCountInput === 0 ? parseInt(document.getElementById('farm-count').value) : farmCountInput;
    const setType = setTypeInput === 'None' ? document.getElementById('setType-select').value : setTypeInput;
    const fixedSlot = document.getElementById('fixedSlot-select').value;
    const fixedMainStat = document.getElementById('fixedMainStat-select').value;
    let mainStat;
    let slot;
    let substats;
    for (let j = 0; j < farmCount; j++) {
        mainStat = 'None';
        slot = 'None';
        substats = [
            { "key": "None", value: -1.1 },
            { "key": "None", value: -1.1 },
            { "key": "None", value: -1.1 },
            { "key": "None", value: -1.1 }
        ];
        if (fixedSlot === 'None') {
            if (setType === 'Regular') {
                slot = getRandom(regularPieceChances);
            }
            else {
                slot = getRandom(planarPieceChances);
            }
        }
        else {
            slot = fixedSlot;
        }
        if (fixedMainStat === 'None') {
            mainStat = getRandom(mainStatChances[slot]);
        }
        else {
            mainStat = fixedMainStat;
        }
        let remainUpgradeCount = parseInt(getRandom(initialStatCount)) + 1;
        let keysToExclude = [];
        if (slot === 'Head') {
            keysToExclude.push('HP');
        }
        else if (slot === 'Hands') {
            keysToExclude.push('ATK');
        }
        else if (slot === 'Feet' && mainStat === 'SPD') {
            keysToExclude.push('SPD');
        }
        else {
            keysToExclude.push(mainStat + '_');
        }
        for (let i = 0; i < 4; i++) {
            const statType = getRandom(substatTypeChances, keysToExclude);
            const statValue = getRandom(substatValueChances[statType]);
            substats[i].key = statType;
            substats[i].value = parseFloat(statValue);
            keysToExclude.push(statType);
        }
        for (let i = 0; i < remainUpgradeCount; i++) {
            const statIdx = Math.floor(Math.random() / 0.25);
            const statType = substats[statIdx].key;
            substats[statIdx].value += parseFloat(getRandom(substatValueChances[statType]));
        }
    }
    return {
        "slot": slot,
        "mainstat": mainStat,
        "substats": substats
    };
}

function getCurrentRelicsScore() {
    if (currentCharacterLowerCase === "none") {
        alert('Please select a character first');
        return;
    }
    let totalScore = 0;
    let totalHit = 0.0;
    if (currentRelics["Head"].location.toLowerCase() === currentCharacterLowerCase) {
        for (let slot in currentRelics) {
            const relic = currentRelics[slot];
            const [relicScore, relicHit] = getRelicScore(relic);
            totalHit += relicHit;
            totalScore += relicScore;
        }
    }
    return [totalScore, totalHit];
}

function getExpectations() {
    let [totalScore, totalHit] = getCurrentRelicsScore();
    const currentBestRelics = JSON.parse(JSON.stringify(currentRelics));
    const setType = document.getElementById('setType-select').value;
    const targetScore = parseFloat(document.getElementById('target-score').value);
    const targetHits = parseFloat(document.getElementById('target-hits').value);
    const rainbow = document.getElementById('is-rainbow').checked;
    const max = 100000;
    let resultFarmCount = 0;
    if (targetScore < 1 && targetHits < 1) {
        alert('Please set target score or target hits');
        return;
    }
    document.getElementById('start-calculating').disabled = true;
    document.getElementById('calculate-result').innerHTML = `<h2>Running Simulations...</h2>`;
    for (let currentCount = 1; currentCount <= max; currentCount++) {
        const generated = generateRelic(setType, 1);
        const currentBest = currentBestRelics[generated.slot];
        const [bestScore, bestHit] = getRelicScore(currentBest);
        const [generatedScore, generatedHit] = getRelicScore(generated);
        if (bestScore > generatedScore) {
            continue;
        }
        totalScore += (generatedScore - bestScore);
        totalHit += (generatedHit - bestHit);
        currentBestRelics[generated.slot] = generated;
        if ((targetScore > 1 && totalScore >= targetScore)
            || (targetHits > 1 && totalHit >= targetHits)) {
            resultFarmCount = currentCount;
            break;
        }
        if (Math.random() < 0.05) {
            currentCount -= 1;
        }
    }
    if (resultFarmCount === 0) {
        resultFarmCount = max;
    }
    // mutiply by 2 (wrong set)
    // 2 per 40 stamina the (10% chance to get extra is included above)
    const farmCount = rainbow ? resultFarmCount : resultFarmCount * 2;
    const stamina = farmCount * 40;
    const days = stamina / 240;
    document.getElementById('calculate-result').innerHTML =
        `<h2>Spent: ${days.toFixed(2)} days, ${stamina.toFixed(2)} stamina to reach ${totalScore.toFixed(2)} Score ${totalHit.toFixed(2)} Hits</h2>`;
    document.getElementById('start-calculating').disabled = false;
}

function getRandom(chances, keysToExclude = []) {
    let result = 'None';
    while (true) {
        let sum = 0;
        const r = Math.random();
        for (let key in chances) {
            sum += chances[key];
            if (r <= sum) {
                result = key;
                break;
            }
        }
        if (keysToExclude.includes(result) || result === 'None') {
            continue;
        }
        break;
    }
    return result;
}

function getRelicScore(relic) {
    let relicScore = 0;
    let relicHit = 0;
    const mainStat = relic.mainstat;
    if (mainStatMaxFixedValues[relic.slot]) {
        relicScore = (currentWeights[mainStat] || 0) * mainStatMaxFixedValues[relic.slot];
    }
    else {
        relicScore = (currentWeights[mainStat + "_"] || currentWeights[mainStat] || 0)
            * mainStatMaxValues[mainStat];
    }
    for (let i = 0; i < relic.substats.length; i++) {
        const weight = relic.substats[i].key === "None" ? 0 : (currentWeights[relic.substats[i].key] || 0);
        relicScore += relic.substats[i].value * weight;
        if (weight > 0) {
            const keys = Object.keys(substatValueChances[relic.substats[i].key]);
            const avgValue = keys[1];
            const hit = relic.substats[i].value / avgValue;
            relicHit += hit * weight;
        }
    }
    return [relicScore, relicHit];
}

function showCharacterEquipment() {
    if (!jsonData.relics) {
        console.error('No relics data found in the JSON file');
        return;
    }

    createEquipmentInputs();  // Clear all equipment inputs
    jsonData.relics.forEach(relic => {
        if (relic.location.toLowerCase() === currentCharacterLowerCase) {
            const slotElement = findSlotElement(relic.slot);
            currentRelics[relic.slot] = relic;
            if (slotElement) {
                const equipmentDiv = slotElement.closest('.equipment');
                const mainStat = relic.mainstat;
                if (equipmentDiv) {
                    for (let i = 0; i < relic.substats.length; i++) {
                        const statSelect = equipmentDiv.querySelector(`select[id$="-stat${i + 1}"]`);
                        const valueInput = equipmentDiv.querySelector(`input[id$="-value${i + 1}"]`);
                        if (statSelect && valueInput) {
                            statSelect.value = relic.substats[i].key;
                            valueInput.value = relic.substats[i].value;
                        }
                    }
                }
                let [relicScore, relicHit] = getRelicScore(relic);
                slotElement.innerHTML = relic.slot.split(" ").slice(-1) + ' ' + mainStat + ' ' + relicScore.toFixed(2);
            }
        }
    });

    const [totalScore, totalHit] = getCurrentRelicsScore();

    results.innerHTML = `<h3>Total Score: ${totalScore.toFixed(2)} Total Hit: ${totalHit.toFixed(2)}</h3>`;
}

function updateCharacterSelect() {
    const characterSelect = document.getElementById('character-select');
    characterSelect.innerHTML = '<option value="None">Select a character</option>';

    const locations = new Set();
    if (jsonData.relics) {
        jsonData.relics.forEach(relic => {
            if (relic.location && characterPresets.hasOwnProperty(relic.location.toLowerCase())) {
                locations.add(relic.location);
            }
        });
    }

    const sortedLocations = Array.from(locations).sort();
    sortedLocations.forEach(location => {
        const option = document.createElement('option');
        option.value = location.toLowerCase();
        option.textContent = location;
        characterSelect.appendChild(option);
    });

    characterSelect.addEventListener('change', updateCurrentCharacter);
}

function updateCurrentCharacter() {
    currentCharacterLowerCase = document.getElementById('character-select').value.toLowerCase();
    currentWeights = characterPresets[currentCharacterLowerCase] || {};
    displayPresetWeights();
    showCharacterEquipment();
}

createEquipmentInputs();