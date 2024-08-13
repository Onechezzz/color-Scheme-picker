const cols = document.querySelectorAll('.col')

// function generateRandomColor(){
// 	let color = '';
// 	const hexCodes ='0123456789ABCDEF'
// 	for (let i=0;i<6;i++){
// 		color += hexCodes[Math.floor(Math.random() * hexCodes.length)]
// 	}
// 	return '#' + color
// }

function setRandomColours(){
	cols.forEach(col=> {
		const text = col.querySelector('h2')
		const lockButton = col.querySelector('button')
		const color = chroma.random()
		text.textContent = color
		col.style.background = color
		
		setTextColor(text, color)
		setTextColor(lockButton, color)
	})
}

function setTextColor(text, color){
	const luminance = chroma(color).luminance()
	text.style.color = luminance > 0.5 ? 'black' : 'white';
}

setRandomColours()
