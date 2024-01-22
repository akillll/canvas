
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');
        let textArray = [];
        let history = [];
        let redoHistory = [];
        let selectedWordIndex = -1;
        let isDragging = false;
        let dragStartX, dragStartY;
        let selectedFont = 'Arial';
        let selectedFontSize = '14';

        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        function handleMouseDown(e) {
            const clickX = e.clientX - canvas.getBoundingClientRect().left;
            const clickY = e.clientY - canvas.getBoundingClientRect().top;

            
            const clickedWordIndex = textArray.findIndex(({ text, xPos, yPos }) => {
                const textWidth = ctx.measureText(text).width;
                const textHeight = parseInt(ctx.font);
                return (
                    clickX >= xPos &&
                    clickX <= xPos + textWidth &&
                    clickY >= yPos - textHeight &&
                    clickY <= yPos
                );
            });

            
            selectedWordIndex = clickedWordIndex;

            
            if (selectedWordIndex !== -1) {
                isDragging = true;
                dragStartX = clickX;
                dragStartY = clickY;
            }

            
            if (selectedWordIndex === -1) {
                const text = prompt('Enter text:');
                if (text) {
                    const xPos = clickX;
                    const yPos = clickY;
                    const fontColor = '#000000';  
                    textArray.push({ text, xPos, yPos, font: `${selectedFontSize}px ${selectedFont}`, fontColor });
                    addToHistory();
                    drawText();
                }
            }
        }

        function handleKeyDown(e) {
            if (e.key === 'Backspace' && selectedWordIndex !== -1) {
                const selectedWord = textArray[selectedWordIndex];
                if (selectedWord.text.length > 0) {
                    selectedWord.text = selectedWord.text.substring(0, selectedWord.text.length - 1);
                    addToHistory();
                } else {
                    textArray.splice(selectedWordIndex, 1);
                    selectedWordIndex = -1;
                    addToHistory();
                }
                drawText();
            }
        }

        function handleMouseMove(e) {
            if (isDragging && selectedWordIndex !== -1) {
                const newX = e.clientX - canvas.getBoundingClientRect().left;
                const newY = e.clientY - canvas.getBoundingClientRect().top;

                const deltaX = newX - dragStartX;
                const deltaY = newY - dragStartY;

                const selectedWord = textArray[selectedWordIndex];
                selectedWord.xPos += deltaX;
                selectedWord.yPos += deltaY;

                addToHistory();
                drawText();

                dragStartX = newX;
                dragStartY = newY;
            }
        }

        function handleMouseUp() {
            isDragging = false;
        }

        function changeFont() {
            const newFont = document.getElementById('fontDropdown').value;
            if (selectedWordIndex !== -1) {
                const selectedWord = textArray[selectedWordIndex];
                selectedWord.font = `${selectedFontSize}px ${newFont}`;
                addToHistory();
                drawText();
            }
        }

        function changeFontSize() {
            selectedFontSize = document.getElementById('fontSizeDropdown').value;
            if (selectedWordIndex !== -1) {
                const selectedWord = textArray[selectedWordIndex];
                selectedWord.font = `${selectedFontSize}px ${selectedFont}`;
                addToHistory();
                drawText();
            }
        }

        function changeFontColor(color) {
            if (selectedWordIndex !== -1) {
                const selectedWord = textArray[selectedWordIndex];
                selectedWord.fontColor = color;
                addToHistory();
                drawText();
            }
        }

        function drawText() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            textArray.forEach(({ text, xPos, yPos, font, fontColor }) => {
                ctx.font = font;
                ctx.fillStyle = fontColor;
                ctx.fillText(text, xPos, yPos);
            });
        }

        function addToHistory() {
            const snapshot = JSON.stringify(textArray);
            history.push(snapshot);
        }

        function undo() {
            if (history.length > 1) {
                history.pop(); 
                const previousState = JSON.parse(history[history.length - 1]);
                textArray = previousState;
                drawText();
            }
        }

        function redo() {
            if (redoHistory.length > 0) {
                history.push(redoHistory);
                const nextState = JSON.parse(history[history.length - 1]);
                textArray = nextState;
                drawText();
            }
        }
