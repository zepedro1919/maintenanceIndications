let data = {}; // Will store the JSON data

// DOM elements
const machineSelect = document.getElementById("machine-select");
const maintenanceSelect = document.getElementById("maintenance-select");
const machineName = document.getElementById("machine-name");
const maintenanceName = document.getElementById("maintenance-name");
const maintenancePeriodicity = document.getElementById("maintenance-periodicity");
const maintenanceDescription = document.getElementById("maintenance-description");
const machineImage = document.getElementById("machine-image");
const procedureList = document.getElementById("procedure-list");

// Fetch data from dataset.json
fetch('dataset.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData; // Store the fetched data
        populateMachineDropdown();
        checkUrlParameters();
    })
    .catch(error => console.error('Error fetching dataset:', error));

// Populate machine dropdown
function populateMachineDropdown() {
    Object.keys(data.machines).forEach(machine => {
        const option = document.createElement("option");
        option.value = machine;
        option.textContent = machine;
        machineSelect.appendChild(option);
    });
}

// Populate maintenance dropdown based on selected machine
function populateMaintenanceDropdown(machine) {
    maintenanceSelect.innerHTML = '<option value="">Selecione uma manutenção</option>';
    maintenanceSelect.disabled = !machine;
    if (machine && data.machines[machine]) {
        Object.keys(data.machines[machine]).forEach(maintenance => {
            if (maintenance !== "image") {
                const option = document.createElement("option");
                option.value = maintenance;
                option.textContent = maintenance;
                maintenanceSelect.appendChild(option);
            }  
        });
    }
}

// Display machine image and maintenance details
function displayMachineInfo(machine) {
    const machineData = data.machines[machine];
    if (machineData && machineData.image) {
        machineImage.src = machineData.image;
        machineImage.style.display = "block";
    } else {
        machineImage.style.display = "none";
    }
}

// Display maintenance details
function displayMaintenanceInfo(machine, maintenance) {
    const maintenanceData = data.machines[machine]?.[maintenance];
    if (maintenanceData) {
        maintenanceName.textContent = maintenance;
        maintenancePeriodicity.textContent = maintenanceData.periodicity;

        // Clear previous procedures
        procedureList.innerHTML = "";
        
        // Populate procedures
        if (maintenanceData.procedures) {
            maintenanceData.procedures.forEach(procedure => {
                const procedureItem = document.createElement("div");
                procedureItem.style.marginBottom = "20px";

                const procedureTitle = document.createElement("h4");
                procedureTitle.textContent = `Passo ${procedure.step}: ${procedure.title}`;
                procedureItem.appendChild(procedureTitle);

                const procedureDescription = document.createElement("p");
                procedureDescription.textContent = procedure.description;
                procedureItem.appendChild(procedureDescription);

                const procedureImage = document.createElement("img");
                procedureImage.src = procedure.image;
                procedureImage.alt = procedure.title;
                procedureImage.style.width = "300px";
                procedureImage.style.marginTop = "10px";
                procedureItem.appendChild(procedureImage);

                procedureList.appendChild(procedureItem);
            });
        }
    } else {
        machineName.textContent = '';
        maintenanceName.textContent = '';
        maintenancePeriodicity.textContent = '';
        maintenanceDescription.textContent = '';
        procedureList.innerHTML = '';
    }
}

// Check the URL paramters from the qr-code to auto-select machine and maintenance
function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const initialMachine = urlParams.get('machine');
    const initialMaintenance = urlParams.get('maintenance');

    if (initialMachine) {
        machineSelect.value = initialMachine;
        populateMaintenanceDropdown(initialMachine);
        displayMachineInfo(initialMachine);

        if (initialMaintenance) {
            maintenanceSelect.value = initialMaintenance;
            displayMaintenanceInfo(initialMachine, initialMaintenance);
        }
    }
}

// Update the URL dynamically when mahine or maintenance is selected
function updateURL(machine, maintenance) {
    const url = new URL(window.location.href);
    url.searchParams.set('machine', machine);
    url.searchParams.set('maintenance', maintenance);
    window.history.replaceState(null, '', url);
}

// Event listeners for dropdown changes
machineSelect.addEventListener('change', () => {
    const selectedMachine = machineSelect.value;

    populateMaintenanceDropdown(selectedMachine);
    displayMachineInfo(selectedMachine);
    displayMaintenanceInfo(selectedMachine, maintenanceSelect.value);

    updateURL(selectedMachine, selectedMaintenance);
});

maintenanceSelect.addEventListener('change', () => {
    const selectedMachine = machineSelect.value;
    const selectedMaintenance = maintenanceSelect.value;

    displayMaintenanceInfo(selectedMachine, selectedMaintenance);

    updateURL(selectedMachine, selectedMaintenance);
});