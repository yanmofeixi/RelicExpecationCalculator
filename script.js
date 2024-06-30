const equipmentSlots = ["Feet", "Hands", "Head", "Body", "Link Rope", "Planar Sphere"];
const stats = [
    "SPD", "CRIT Rate_", "Effect Hit Rate_", "Break Effect_",
    "CRIT DMG_", "ATK_", "ATK", "HP_", "HP", "DEF_", "DEF", "Effect RES_"
];
let jsonData;

document.getElementById('json-file-input').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                jsonData = JSON.parse(e.target.result);
                updateCharacterSelect();
                alert('JSON file loaded successfully!');
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

let currentWeights = {};

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

function showCharacterEquipment(character) {
    if (!jsonData.relics) {
        console.error('No relics data found in the JSON file');
        return;
    }

    createEquipmentInputs();  // Clear all equipment inputs

    let totalScore = 0;
    jsonData.relics.forEach(relic => {
        if (relic.location.toLowerCase() === character) {
            const slotElement = findSlotElement(relic.slot);
            if (slotElement) {
                let equipmentScore = 0;
                const equipmentDiv = slotElement.closest('.equipment');
                if (equipmentDiv) {
                    for (let i = 0; i < relic.substats.length; i++) {
                        const statSelect = equipmentDiv.querySelector(`select[id$="-stat${i + 1}"]`);
                        const valueInput = equipmentDiv.querySelector(`input[id$="-value${i + 1}"]`);

                        if (statSelect && valueInput) {
                            statSelect.value = relic.substats[i].key;
                            valueInput.value = relic.substats[i].value;
                            const weight = relic.substats[i].key === "None" ? 0 : (currentWeights[relic.substats[i].key] || 0);
                            equipmentScore += relic.substats[i].value * weight;
                        }
                    }
                }
                slotElement.innerHTML = relic.slot + ' Score: ' + equipmentScore.toFixed(2);
                totalScore += equipmentScore;
            }
        }
    });
    results.innerHTML = `<h3>Total Score: ${totalScore.toFixed(2)}</h3>`;
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

    characterSelect.addEventListener('change', updateWeights);

    console.log('Character select updated with options:', sortedLocations);
}

function updateWeights() {
    const character = document.getElementById('character-select').value.toLowerCase();
    currentWeights = characterPresets[character] || {};
    displayPresetWeights();
    showCharacterEquipment(character);
}

createEquipmentInputs();