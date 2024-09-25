// Gather Hat
fetch('a0/hat.html') .then(response => response.text()) .then(html => {document.getElementById('hat').innerHTML = html;})
.then(() => {const script = document.createElement('script');script.src = 'a0/sombrero.js';document.body.appendChild(script);
});


        const grid = document.getElementById('grid');
        const colorPicker = document.getElementById('colorPicker');
        const clearGridButton = document.getElementById('clearGrid');
        const undoButton = document.getElementById('undo');
        const redoButton = document.getElementById('redo');
        const newProjectButton = document.getElementById('newProject');
        const saveImageButton = document.getElementById('saveImage');
        const borderPicker = document.getElementById('borderPicker');
        const uploadImageButton = document.getElementById('uploadImage');
        const imageInput = document.getElementById('imageInput');
        const modal = document.getElementById('newProjectModal');
        const modalOverlay = document.getElementById('modalOverlay');
        const gridSizeInput = document.getElementById('gridSize');
        const confirmNewProjectButton = document.getElementById('confirmNewProject');
        
        let selectedColor = colorPicker.value;
        let selectedBorderColor = borderPicker.value;
        let isDragging = false;
        let history = [];
        let redoStack = [];
        let currentStep = -1;
        let gridSize = 15; // Default grid size

        function saveState() {
            if (history.length >= 10) history.shift(); // Keep track of last 10 changes
            history.push(grid.innerHTML);
            currentStep = history.length - 1;
            redoStack = []; // Clear redo history when a new change is made
        }

        function undo() {
            if (currentStep > 0) {
                currentStep--;
                grid.innerHTML = history[currentStep];
                attachEventListeners();
            }
        }

        function redo() {
            if (currentStep < history.length - 1) {
                currentStep++;
                grid.innerHTML = history[currentStep];
                attachEventListeners();
            }
        }

function createGrid(size) {
    grid.innerHTML = ''; // Clear the grid
    grid.style.display = 'grid'; // Ensure grid display
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`; // Responsive columns
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`; // Responsive rows

    for (let i = 0; i < size * size; i++) {
        const block = document.createElement('div');
        block.classList.add('grid-block');
        block.style.aspectRatio = '1'; // Ensure each block is a square

        // Border handling
        if (selectedBorderColor === 'gray') {
            block.style.borderColor = 'rgba(128, 128, 128, 0.4)';
        } else {
            block.style.borderColor = selectedBorderColor;
        }
        block.style.borderWidth = selectedBorderColor === 'none' ? '0' : '1px';
        block.style.borderStyle = selectedBorderColor === 'none' ? 'none' : 'solid';

        // Dragging functionality
        block.addEventListener('mousedown', () => {
            isDragging = true;
            block.style.backgroundColor = selectedColor;
            saveState();
        });

        block.addEventListener('mouseover', () => {
            if (isDragging) {
                block.style.backgroundColor = selectedColor;
            }
        });

        block.addEventListener('mouseup', () => {
            isDragging = false;
        });

        grid.appendChild(block);
    }
}



        function attachEventListeners() {
            const blocks = document.querySelectorAll('.grid-block');
            blocks.forEach(block => {
                block.addEventListener('mousedown', () => {
                    isDragging = true;
                    block.style.backgroundColor = selectedColor;
                    saveState();
                });

                block.addEventListener('mouseover', () => {
                    if (isDragging) {
                        block.style.backgroundColor = selectedColor;
                    }
                });

                block.addEventListener('mouseup', () => {
                    isDragging = false;
                });
            });
        }


    
// Function to update the selected color and the color picker fill
function updateSelectedColor(color) {
    selectedColor = color;
    document.getElementById('colorPicker').value = color;  // Update the color picker to reflect the selected color
}

// Add event listeners for each color block
const colorMap = {
    black: '#000000',
    white: '#FFFFFF',
    gray: '#808080',
    blue: '#0000FF',
    red: '#FF0000',
    green: '#008000',
    yellow: '#FFFF00',
    purple: '#800080',
    aqua: '#00FFFF',
    orange: '#FFA500',
    violet: '#EE82EE',
    tan: '#D2B48C',
    brown: '#A52A2A',
    limegreen: '#32CD32',
    lightblue: '#ADD8E6',
    gold: 'gold',
    navy: 'navy',
    darkcyan: 'darkcyan'
};

Object.keys(colorMap).forEach(colorId => {
    document.getElementById(colorId).addEventListener('click', () => {
        updateSelectedColor(colorMap[colorId]);
    });
});

// Update selected color when the color picker is used
document.getElementById('colorPicker').addEventListener('input', (event) => {
    selectedColor = event.target.value;
});






// Function to update the borders based on selection
function updateBorders(selectedBorderColor) {
    const blocks = document.querySelectorAll('.grid-block');
    blocks.forEach(block => {
        if (selectedBorderColor === 'gray') {
            block.style.borderColor = 'rgba(128, 128, 128, 0.4)'; // Set gray with 0.4 opacity
        } else if (selectedBorderColor === 'none') {
            block.style.borderWidth = '0';
            block.style.borderStyle = 'none';
        } else {
            block.style.borderColor = selectedBorderColor; // Use the selected color
            block.style.borderWidth = '1px';
            block.style.borderStyle = 'solid';
        }
    });
}

// Event listeners for each border option
document.getElementById('grayborder').addEventListener('click', (event) => {
    event.preventDefault();
    updateBorders('gray');
});

document.getElementById('whiteborder').addEventListener('click', (event) => {
    event.preventDefault();
    updateBorders('white');
});

document.getElementById('noborders').addEventListener('click', (event) => {
    event.preventDefault();
    updateBorders('none');
});



        // Undo/Redo functionality
        undoButton.addEventListener('click', undo);
        redoButton.addEventListener('click', redo);

        // Clear the grid
        clearGridButton.addEventListener('click', () => {
            const blocks = document.querySelectorAll('.grid-block');
            blocks.forEach(block => {
                block.style.backgroundColor = 'white';
            });
            saveState();
        });

        // Save the grid as an image
        saveImageButton.addEventListener('click', () => {
            html2canvas(grid).then(canvas => {
                const link = document.createElement('a');
                link.download = 'grid-image.png';
                link.href = canvas.toDataURL();
                link.click();
            });
        });

        // Open the New Project modal
        newProjectButton.addEventListener('click', () => {
            modal.style.display = 'block';
            modalOverlay.style.display = 'block';
        });

        // Confirm new project and create new grid
        confirmNewProjectButton.addEventListener('click', () => {
            gridSize = parseInt(gridSizeInput.value);
            createGrid(gridSize);
            saveState();
            modal.style.display = 'none';
            modalOverlay.style.display = 'none';
        });

        // Close modal on clicking the overlay
        modalOverlay.addEventListener('click', () => {
            modal.style.display = 'none';
            modalOverlay.style.display = 'none';
        });

        // Initialize grid
        createGrid(gridSize);
        saveState();

        // Stop dragging when mouse is released anywhere
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });



        //Upload Picture

        // Upload image and apply it to the grid
        uploadImageButton.addEventListener('click', () => {
            imageInput.click();
        });

        imageInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.src = e.target.result;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = gridSize;
                        canvas.height = gridSize;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, gridSize, gridSize);

                        const blocks = document.querySelectorAll('.grid-block');
                        blocks.forEach((block, index) => {
                            const x = index % gridSize;
                            const y = Math.floor(index / gridSize);
                            const imgData = ctx.getImageData(x, y, 1, 1);
                            const [r, g, b, a] = imgData.data;
                            block.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
                        });
                    };
                };
                reader.readAsDataURL(file);
            }
        });



        document.getElementById('savecode').addEventListener('click', () => {
    const gridItems = document.querySelectorAll('.grid-block');
    const gridData = { gridSize: gridSize, colors: [] };

    // Loop through grid items and store each color
    gridItems.forEach(item => gridData.colors.push(item.style.backgroundColor || 'white'));

    // Display the popup
    document.getElementById('savecode-popup').style.display = 'block';

    // Display the JSON data in one line in the textarea
    document.getElementById('codeinput').value = JSON.stringify(gridData);
});


// Copy Code functionality
document.getElementById('copycode').addEventListener('click', () => {
    const codeInput = document.getElementById('codeinput');
    codeInput.select();
    document.execCommand('copy');
    alert('Code copied to clipboard!');
});

// Close Save Code popup
document.getElementById('close-save-popup').addEventListener('click', () => {
    document.getElementById('savecode-popup').style.display = 'none';
});

// Open Code functionality with popup
document.getElementById('opencode').addEventListener('click', () => {
    document.getElementById('opencode-popup').style.display = 'block';
});

// Upload Code functionality
document.getElementById('uploadcode').addEventListener('click', () => {
    const codeInput = document.getElementById('opencodeinput').value;

    try {
        // Parse the uploaded JSON data
        const gridData = JSON.parse(codeInput);

        // Restore the grid size
        gridSize = gridData.gridSize;
        createGrid(gridSize);  // Assuming this function recreates the grid with the new size

        // Restore the colors for each grid item
        const gridItems = document.querySelectorAll('.grid-block');
        gridItems.forEach((item, index) => {
            item.style.backgroundColor = gridData.colors[index] || 'white';
        });

        alert('Grid uploaded successfully!');
    } catch (error) {
        alert('Invalid code. Please try again.');
    }

    // Close the popup after upload
    document.getElementById('opencode-popup').style.display = 'none';
});

// Close Open Code popup
document.getElementById('close-open-popup').addEventListener('click', () => {
    document.getElementById('opencode-popup').style.display = 'none';
});

// Hide popups when clicking outside of them
document.addEventListener('click', function (event) {
    const savePopup = document.getElementById('savecode-popup');
    const openPopup = document.getElementById('opencode-popup');

    if (savePopup.style.display === 'block' && !savePopup.contains(event.target) && event.target.id !== 'savecode') {
        savePopup.style.display = 'none';
    }

    if (openPopup.style.display === 'block' && !openPopup.contains(event.target) && event.target.id !== 'opencode') {
        openPopup.style.display = 'none';
    }
});




var duck = 
{"gridSize":15,"colors":["rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(242, 183, 24)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(0, 0, 0)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(242, 183, 24)","rgb(242, 183, 24)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(242, 183, 24)","rgb(242, 183, 24)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(252, 239, 72)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(252, 239, 72)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(252, 239, 72)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(252, 239, 72)","rgb(252, 239, 72)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(252, 239, 72)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(252, 239, 72)","rgb(252, 239, 72)","rgb(252, 239, 72)","rgb(252, 239, 72)","rgb(173, 209, 255)","rgb(173, 209, 255)","rgb(252, 239, 72)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(252, 239, 72)","rgb(252, 239, 72)","rgb(253, 238, 73)","rgb(252, 239, 72)","rgb(252, 239, 72)","rgb(252, 239, 72)","rgb(0, 0, 0)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(173, 209, 255)","rgb(81, 140, 220)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(252, 239, 72)","rgb(252, 239, 72)","rgb(0, 0, 0)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(81, 140, 220)","rgb(81, 140, 220)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(80, 141, 220)","rgb(80, 141, 220)","rgb(80, 141, 220)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(253, 238, 73)","rgb(80, 141, 220)","rgb(80, 141, 220)","rgb(80, 141, 220)","rgb(80, 141, 220)","rgb(80, 141, 220)","rgb(80, 141, 220)","rgb(80, 141, 220)","rgb(80, 141, 220)","rgb(80, 141, 220)","rgb(80, 141, 220)","rgb(80, 141, 220)","rgb(80, 141, 220)","rgb(80, 141, 220)","rgb(80, 141, 220)","rgb(80, 141, 220)","rgb(80, 141, 220)","rgb(80, 141, 220)"]}

var heart = 

{"gridSize":15,"colors":["rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 0, 0)","rgb(255, 0, 0)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 0, 0)","rgb(255, 0, 0)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 0, 0)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(255, 0, 0)","rgb(255, 204, 222)","rgb(255, 0, 0)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(255, 0, 0)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 0, 0)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(255, 0, 0)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(255, 0, 0)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 0, 0)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(255, 0, 0)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 0, 0)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(255, 0, 0)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 0, 0)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(255, 0, 0)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 0, 0)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(255, 0, 0)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 0, 0)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(255, 0, 0)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 0, 0)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(237, 102, 255)","rgb(255, 0, 0)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 0, 0)","rgb(237, 102, 255)","rgb(255, 0, 0)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 0, 0)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)","rgb(255, 204, 222)"]}

var penguin = 

{"gridSize":19,"colors":["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","white","white","white","white","white","white","white","white","white","white","white","rgb(0, 0, 0)","rgb(0, 0, 0)","white","white","white","white","white","rgb(0, 0, 0)","rgb(0, 0, 0)","white","white","white","white","white","white","white","white","white","white","rgb(0, 0, 0)","white","rgb(0, 0, 0)","white","white","white","rgb(0, 0, 0)","white","rgb(0, 0, 0)","white","white","white","white","white","white","white","white","white","white","rgb(0, 0, 0)","white","rgb(0, 0, 0)","white","white","white","rgb(0, 0, 0)","white","rgb(0, 0, 0)","white","white","white","white","white","white","white","white","white","white","rgb(0, 0, 0)","white","white","rgb(216, 116, 34)","rgb(216, 116, 34)","rgb(216, 116, 34)","white","white","rgb(0, 0, 0)","white","white","white","white","white","white","white","white","white","white","rgb(0, 0, 0)","rgb(0, 0, 0)","white","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(216, 116, 35)","white","rgb(0, 0, 0)","rgb(0, 0, 0)","white","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(255, 255, 255)","white","white","rgb(0, 0, 0)","rgb(255, 255, 255)","white","white","white","rgb(255, 255, 255)","rgb(0, 0, 0)","white","white","white","white","white","white","white","white","white","white","white","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","white","rgb(255, 255, 255)","white","white","white","white","white","white","white","rgb(0, 0, 0)","rgb(0, 0, 0)","white","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","white","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(0, 0, 0)","white","white","white","white","white","white","white","white","rgb(0, 0, 0)","white","white","rgb(255, 255, 255)","white","white","white","white","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","white","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(216, 116, 35)","rgb(216, 116, 35)","white","white","white","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(255, 255, 255)","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(216, 116, 35)","white","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(0, 0, 0)","rgb(255, 255, 255)","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(216, 116, 35)","white","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(0, 0, 0)","rgb(255, 255, 255)","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(0, 0, 0)","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(0, 0, 0)","rgb(255, 255, 255)","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(0, 0, 0)","white","rgb(0, 0, 0)","rgb(216, 116, 35)","rgb(216, 116, 35)","rgb(255, 255, 255)","white","rgb(255, 255, 255)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white"]}

var flower = 
{"gridSize":25,"colors":["white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(255, 255, 255)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(214, 46, 208)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(214, 46, 208)","rgb(214, 46, 208)","rgb(214, 46, 208)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(214, 45, 208)","rgb(214, 45, 208)","white","rgb(214, 46, 208)","rgb(214, 46, 208)","rgb(214, 46, 208)","white","rgb(214, 45, 208)","rgb(214, 45, 208)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(214, 46, 208)","rgb(207, 149, 208)","rgb(214, 46, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(214, 45, 208)","rgb(18, 189, 186)","rgb(18, 189, 186)","rgb(20, 189, 186)","rgb(18, 189, 186)","rgb(18, 189, 186)","rgb(214, 45, 208)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(18, 189, 186)","rgb(132, 241, 239)","rgb(132, 241, 239)","rgb(132, 241, 239)","rgb(18, 189, 186)","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(207, 149, 208)","rgb(20, 189, 186)","rgb(132, 241, 239)","rgb(20, 189, 186)","rgb(132, 241, 239)","rgb(20, 189, 186)","rgb(207, 149, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(18, 189, 186)","rgb(132, 241, 239)","rgb(132, 241, 239)","rgb(132, 241, 239)","rgb(18, 189, 186)","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(214, 45, 208)","rgb(18, 189, 186)","rgb(18, 189, 186)","rgb(20, 189, 186)","rgb(18, 189, 186)","rgb(18, 189, 186)","rgb(214, 45, 208)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(207, 149, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","white","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","white","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(214, 45, 208)","rgb(214, 45, 208)","rgb(214, 45, 208)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(255, 255, 255)","white","white","white","white","white","rgb(214, 45, 208)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(60, 215, 63)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(60, 215, 63)","rgb(60, 215, 63)","rgb(60, 215, 63)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(255, 255, 255)","white","rgb(60, 215, 63)","rgb(60, 215, 63)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(60, 215, 63)","rgb(60, 215, 63)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(60, 215, 63)","rgb(60, 215, 63)","rgb(60, 215, 63)","rgb(60, 215, 63)","rgb(61, 215, 63)","rgb(61, 215, 63)","rgb(255, 255, 255)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(60, 215, 63)","rgb(60, 215, 63)","rgb(60, 215, 63)","rgb(255, 255, 255)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(61, 215, 63)","rgb(60, 215, 63)","white","rgb(255, 255, 255)","rgb(255, 255, 255)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(60, 215, 63)","rgb(60, 215, 63)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(60, 215, 63)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(60, 215, 63)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(255, 255, 255)","white","white","white","white","white","white","white","white","white","white","white","white"]}

var dog = 
{"gridSize":25,"colors":["rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(247, 247, 247)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(253, 253, 253)","rgb(247, 247, 247)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(253, 253, 253)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(41, 26, 24)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(252, 252, 252)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(25, 15, 7)","rgb(75, 42, 11)","rgb(73, 42, 8)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(79, 46, 34)","rgb(72, 43, 7)","rgb(49, 30, 5)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(31, 21, 11)","rgb(83, 51, 12)","rgb(85, 49, 14)","rgb(175, 95, 4)","rgb(8, 7, 10)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(175, 95, 4)","rgb(83, 53, 38)","rgb(86, 47, 14)","rgb(60, 35, 10)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(31, 21, 8)","rgb(87, 52, 7)","rgb(87, 51, 6)","rgb(175, 95, 4)","rgb(26, 26, 26)","rgb(216, 216, 216)","rgb(0, 0, 0)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(175, 95, 4)","rgb(84, 49, 33)","rgb(89, 50, 5)","rgb(63, 36, 5)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(27, 17, 3)","rgb(27, 16, 3)","rgb(175, 95, 4)","rgb(8, 8, 8)","rgb(74, 43, 11)","rgb(0, 0, 0)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(74, 43, 11)","rgb(0, 0, 0)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(175, 95, 4)","rgb(1, 1, 1)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(2, 2, 2)","rgb(24, 24, 24)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(85, 49, 15)","rgb(23, 23, 23)","rgb(1, 1, 1)","rgb(8, 8, 8)","rgb(85, 49, 15)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(78, 48, 6)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(175, 95, 4)","rgb(85, 49, 15)","rgb(85, 49, 15)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(85, 49, 15)","rgb(85, 49, 15)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(78, 48, 6)","rgb(78, 48, 6)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(25, 25, 25)","rgb(175, 95, 4)","rgb(85, 49, 15)","rgb(85, 49, 15)","rgb(85, 49, 15)","rgb(85, 49, 15)","rgb(85, 49, 15)","rgb(85, 49, 15)","rgb(85, 49, 15)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(78, 48, 6)","rgb(175, 95, 4)","rgb(78, 48, 6)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(85, 49, 15)","rgb(85, 49, 15)","rgb(85, 49, 15)","rgb(85, 49, 15)","rgb(85, 49, 15)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(78, 48, 6)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(78, 48, 6)","rgb(78, 48, 6)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(2, 1, 1)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(78, 48, 6)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(78, 48, 6)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(11, 8, 5)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(248, 248, 248)","rgb(0, 0, 0)","rgb(78, 48, 6)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(72, 43, 7)","rgb(72, 43, 7)","rgb(72, 43, 7)","rgb(72, 43, 7)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(250, 250, 250)","rgb(0, 0, 0)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(85, 49, 15)","rgb(85, 49, 15)","rgb(85, 49, 15)","rgb(85, 49, 15)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(0, 0, 0)","rgb(175, 95, 4)","rgb(174, 95, 5)","rgb(78, 48, 6)","rgb(78, 48, 6)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(85, 49, 15)","rgb(85, 49, 15)","rgb(85, 49, 15)","rgb(85, 49, 15)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(253, 253, 253)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(175, 95, 4)","rgb(74, 43, 11)","rgb(78, 48, 6)","rgb(72, 43, 7)","rgb(78, 48, 6)","rgb(78, 48, 6)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(85, 49, 15)","rgb(78, 48, 6)","rgb(175, 95, 4)","rgb(85, 49, 15)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(0, 0, 0)","rgb(175, 95, 4)","rgb(78, 48, 6)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(78, 48, 6)","rgb(85, 49, 15)","rgb(72, 43, 7)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(85, 49, 15)","rgb(78, 48, 6)","rgb(175, 95, 4)","rgb(85, 49, 15)","rgb(175, 95, 4)","rgb(175, 95, 4)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(78, 48, 6)","rgb(78, 48, 6)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(64, 39, 8)","rgb(85, 50, 12)","rgb(72, 43, 7)","rgb(87, 52, 7)","rgb(78, 48, 6)","rgb(72, 43, 7)","rgb(78, 48, 6)","rgb(175, 95, 4)","rgb(78, 48, 6)","rgb(72, 43, 7)","rgb(78, 48, 6)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(250, 250, 250)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(253, 253, 253)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(254, 254, 254)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)"]}

var pizza = 
{"gridSize":25,"colors":["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","white","white","white","white","white","white","white","white","white","white","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(255, 255, 255)","white","white","white","white","white","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","white","white","white","rgb(0, 0, 0)","rgb(0, 0, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(0, 0, 0)","rgb(0, 0, 0)","white","white","rgb(0, 0, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(0, 0, 0)","white","white","rgb(0, 0, 0)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(240, 0, 0)","rgb(240, 0, 0)","rgb(240, 0, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(138, 78, 0)","rgb(138, 78, 0)","rgb(0, 0, 0)","white","white","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(240, 0, 0)","rgb(240, 0, 0)","rgb(240, 0, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(0, 0, 0)","rgb(255, 255, 255)","white","white","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(240, 0, 0)","rgb(240, 0, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(0, 0, 0)","rgb(255, 255, 255)","white","white","white","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(0, 0, 0)","rgb(255, 255, 255)","white","white","white","white","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(0, 0, 0)","rgb(255, 255, 255)","white","white","white","white","white","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(0, 0, 0)","rgb(255, 255, 255)","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(0, 0, 0)","rgb(255, 255, 255)","white","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","white","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","white","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","white","white","white","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","white","white","white","white","white","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","white","white","white","white","white","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","white","white","white","white","white","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(255, 199, 46)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(240, 0, 1)","rgb(255, 199, 46)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(255, 199, 46)","rgb(0, 0, 0)","rgb(255, 255, 255)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(255, 199, 46)","rgb(0, 0, 0)","rgb(255, 255, 255)","rgb(255, 255, 255)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(255, 255, 255)","white","rgb(255, 255, 255)","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white"]}


// Function to handle the upload process for each grid type
function uploadGrid(gridData) {
    const codeInput = JSON.stringify(gridData);  // Convert the grid data to JSON
    const parsedData = JSON.parse(codeInput);    // Parse the grid data

    // Restore the grid size
    gridSize = parsedData.gridSize;
    createGrid(gridSize);  // Assuming this function recreates the grid

    // Restore the colors for each grid item
    const gridItems = document.querySelectorAll('.grid-block');
    gridItems.forEach((item, index) => {
        item.style.backgroundColor = parsedData.colors[index] || 'white';
    });

    
}

// Function to handle the confirmation popup
function handleConfirmation(gridType) {
    const confirmExit = confirm(`Are you sure you want to exit and upload the ${gridType} grid?`);

    if (confirmExit) {
        // Upload the corresponding grid based on the button clicked
        if (gridType === 'duck') {
            uploadGrid(duck);
        } else if (gridType === 'heart') {
            uploadGrid(heart);
        } else if (gridType === 'penguin') {
            uploadGrid(penguin);
        } else if (gridType === 'flower') {
            uploadGrid(flower);
        } else if (gridType === 'dog') {
            uploadGrid(dog);
        } else if (gridType === 'pizza') {
            uploadGrid(pizza);
        }
    } else {
        alert('Operation canceled.');
    }
}

// Event listeners for each button
document.getElementById('duck').addEventListener('click', () => handleConfirmation('duck'));
document.getElementById('heart').addEventListener('click', () => handleConfirmation('heart'));
document.getElementById('penguin').addEventListener('click', () => handleConfirmation('penguin'));
document.getElementById('flower').addEventListener('click', () => handleConfirmation('flower'));
document.getElementById('dog').addEventListener('click', () => handleConfirmation('dog'));
document.getElementById('pizza').addEventListener('click', () => handleConfirmation('pizza'));
