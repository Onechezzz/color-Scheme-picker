const colsContainer = document.querySelector('.cols-container');
const modeSelector = document.getElementById('mode-selector');
let currentMode = 'random';

modeSelector.addEventListener('click', (event) => {
	if (event.target.dataset.mode) {
		currentMode = event.target.dataset.mode;
		setRandomColours(false);
		 updateModeSelectorOpacity();
	}
});

document.addEventListener('keydown', (event) => {
	event.preventDefault();
	if (event.code.toLowerCase() === 'space') {
		setRandomColours(false);
	}
});

document.addEventListener('click', (event) => {
	const type = event.target.dataset.type;

	if (type === 'screen') {
		setRandomColours(false);
	} else if (type === 'lock') {
		const node = event.target.tagName.toLowerCase() === 'i'
			? event.target
			: event.target.children[0];
		node.classList.toggle('fa-lock-open');
		node.classList.toggle('fa-lock');
	} else if (type === 'copy') {
		copyToClipboard(event.target.textContent);
	}
});

function copyToClipboard(text) {
	return navigator.clipboard.writeText(text);
}

function setRandomColours(isInitial) {
	const colors = isInitial ? getColorsFromHash() : [];
	const colorCount = getColorCountForMode(currentMode);

	adjustColorDivs(colorCount);

	const cols = document.querySelectorAll('.col');

	cols.forEach((col, index) => {
		const isLocked = col.querySelector('i').classList.contains('fa-lock');
		const text = col.querySelector('h2');
		const lockButton = col.querySelector('button');

		if (isLocked) {
			colors.push(text.textContent);
			return;
		}

		let color;
		if (isInitial) {
			color = colors[index] ? colors[index] : chroma.random();
		} else {
			const baseColor = colors[0] || chroma.random();
			color = generateColor(baseColor, index, colorCount);
			colors.push(color);
		}

		text.textContent = color;
		col.style.background = color;

		setTextColor(text, color);
		setTextColor(lockButton, color);
	});

	updateColorsHash(colors);
}

function generateColor(baseColor, index, colorCount) {
	switch (currentMode) {
		case 'analogous':
            // Генерация аналогичных цветов
            const angle = 30; // Угол смещения для аналогичных цветов (обычно 30 градусов)
            const startAngle = chroma(baseColor).get('hsl.h');
            const analogousColors = [];

            for (let i = 0; i < colorCount; i++) {
                const colorAngle = (startAngle + i * angle) % 360;
                analogousColors.push(chroma.hsl(colorAngle, chroma(baseColor).get('hsl.s'), chroma(baseColor).get('hsl.l')));
            }

            return analogousColors[index];
		case 'complementary':
			return chroma(baseColor).set('hsl.h', '+180');
		case 'triad':
			return chroma(baseColor).set('hsl.h', `+${index * 120}`);
		case 'split-complementary':
			return index % 2 === 0 ? chroma(baseColor).set('hsl.h', '+150') : chroma(baseColor).set('hsl.h', '+210');
		case 'tetrad':
			return chroma(baseColor).set('hsl.h', `+${index * 90}`);
		case 'monochromatic':
			return chroma(baseColor).set('hsl.l', `${index * 0.2 + 0.2}`);
		default:
			return chroma.random();
	}
}

function getColorCountForMode(mode) {
	switch (mode) {
		case 'analogous':
			return 5;
		case 'complementary':
			return 2;
		case 'triad':
			return 3;
		case 'split-complementary':
			return 3;
		case 'tetrad':
			return 4;
		case 'monochromatic':
			return 5;
		default:
			return 5;
	}
}

function adjustColorDivs(count) {
	const currentCols = document.querySelectorAll('.col').length;
	const diff = count - currentCols;

	if (diff > 0) {
		for (let i = 0; i < diff; i++) {
			const newCol = document.createElement('div');
			newCol.className = 'col';
			newCol.dataset.type = 'screen';
			newCol.innerHTML = `
				<h2 data-type="copy"></h2>
				<button data-type="lock">
					<i class="fa-solid fa-lock-open" data-type="lock"></i>
				</button>`;
			colsContainer.appendChild(newCol);
		}
	} else if (diff < 0) {
		for (let i = 0; i < Math.abs(diff); i++) {
			colsContainer.removeChild(colsContainer.lastChild);
		}
	}
}

function setTextColor(text, color) {
	const luminance = chroma(color).luminance();
	text.style.color = luminance > 0.5 ? 'black' : 'white';
}

function updateColorsHash(colors = []) {
	const modeHash = `mode=${currentMode}`;
	const colorHash = colors.map(col => col.toString().substring(1)).join('-');
	document.location.hash = `${modeHash}&colors=${colorHash}`;
}

function getColorsFromHash() {
	const hash = document.location.hash;
	const modeMatch = hash.match(/mode=([^&]+)/);
	const colorMatch = hash.match(/colors=([^&]+)/);

	if (modeMatch) {
		currentMode = modeMatch[1];
	}

	if (colorMatch) {
		return colorMatch[1].split('-').map(color => `#${color}`);
	}

	return [];
}


document.querySelector('.faq-button').addEventListener('mouseover', () => {
    document.getElementById('faq').style.display = 'block';
});

document.querySelector('.faq-button').addEventListener('mouseout', () => {
    document.getElementById('faq').style.display = 'none';
});

document.querySelector('.faq-button').addEventListener('touchstart', () => {
    document.getElementById('faq').style.display = 'block';
});

document.querySelector('.faq-button').addEventListener('touchend', () => {
    setTimeout(() => {
        document.getElementById('faq').style.display = 'none';
    }, 2000);
});

function updateModeSelectorOpacity() {
    const buttons = document.querySelectorAll('#mode-selector button');
    
    buttons.forEach(button => {
        const mode = button.dataset.mode;
        if (mode === currentMode) {
            button.style.opacity = '1'; // активный режим - полная непрозрачность
        } else {
            button.style.opacity = '0.5'; // неактивные режимы - полупрозрачность
        }
    });
}

updateModeSelectorOpacity();
setRandomColours(true);
