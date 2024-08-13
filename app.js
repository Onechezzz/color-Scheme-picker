const cols = document.querySelectorAll('.col')

function generateRandomColor(){
	let color = '';
	const hexCodes ='0123456789ABCDEF'
	for (let i=0;i<6;i++){
		color += hexCodes[Math.floor(Math.random() * hexCodes.length)]
	}
	return '#' + color
}

function setRandomColours(){
	cols.forEach(col=> {
		col.style.background = generateRandomColor()
	})
}

setRandomColours()
