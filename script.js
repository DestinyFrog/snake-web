
const points = {
	n: 0,

	reset() {
		this.n = 0
		points_log.textContent = this.n.toString()
	},

	increment() {
		this.n++
		points_log.textContent = this.n.toString()
	},

	get points() {
		return this.n
	}
}

const DELAY = 160

const COLS = 10
const ROWS = 10
const UNIT = 24
const WIDTH = COLS * UNIT
const HEIGHT = ROWS * UNIT

const BLACK = '#000'
const WHITE = '#fff'
const GREEN = '#0f0'
const BLUE = '#00f'
const RED = '#f00'

const points_log = document.createElement('p')
points_log.className = 'points-log'
document.body.appendChild(points_log)
points.reset()

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d')
canvas.width = WIDTH
canvas.height = HEIGHT

const controls = document.createElement('div')
controls.id = 'controls'
document.body.appendChild(controls)

const fruit = {
	x: 0,
	y: 0,

	repos() {
		this.x = Math.floor( Math.random() * COLS )
		this.y = Math.floor( Math.random() * ROWS )
	},

	draw(ctx) {
		ctx.fillStyle = RED
		ctx.fillRect( this.x*UNIT+1, this.y*UNIT+1, UNIT-2, UNIT-2 )
	}
}

const snake = {
	direction: { x: 1, y: 0 },
	lost: false,
	color: GREEN,

	body: [
		{
			x: Math.floor(COLS/2),
			y: Math.floor(ROWS/2)
		}
	],

	get head() {
		return this.body[0]
	},

	grow() {
		this.body.push( { x: -1, y: -1 } )
		fruit.repos()
		points.increment()
	},

	update() {
		if (this.lost) {
			this.body.pop()
			this.color = BLUE
			if (this.body.length == 1) {
				this.lost = false
				this.color = GREEN
			}
		}

		for (let i = this.body.length-1; i > 0; i--) {
			this.body[i].x = this.body[i-1].x
			this.body[i].y = this.body[i-1].y
		}

		this.head.x += this.direction.x
		this.head.y += this.direction.y

		if (this.head.x < 0)
			this.head.x = COLS-1

		if (this.head.y < 0)
			this.head.y = ROWS-1

		if (this.head.x > COLS-1)
			this.head.x = 0

		if (this.head.y > ROWS-1)
			this.head.y = 0

		if (this.head.x == fruit.x && this.head.y == fruit.y)
			this.grow()

		for (let i = 1; i < this.body.length; i++) {
			if (this.head.x == this.body[i].x && this.head.y == this.body[i].y ) {
				this.lost = true
				points.reset()
			}
		}
	},

	draw(ctx) {
		for (let { x, y } of this.body) {
			ctx.fillStyle = this.color
			ctx.fillRect( UNIT*x+1, UNIT*y+1, UNIT-2, UNIT-2 )
		}
	}
}

document.addEventListener('keydown', (ev) => {
	switch (ev.keyCode) {
		case 38: // UP
			snake.direction.x = 0
			snake.direction.y = -1
		break

		case 40: // DOWN
			snake.direction.x = 0
			snake.direction.y = 1
		break

		case 37: // LEFT
			snake.direction.x = -1
			snake.direction.y = 0
		break

		case 39: // RIGHT
			snake.direction.x = 1
			snake.direction.y = 0
		break
	}
})

const but_up = document.createElement('button')
controls.appendChild(but_up)
but_up.className = 'up'
but_up.textContent = '⬆️'
but_up.addEventListener('click', () => {
	snake.direction.x = 0
	snake.direction.y = -1
})

const but_left = document.createElement('button')
controls.appendChild(but_left)
but_left.className = 'left'
but_left.textContent = '⬅️'
but_left.addEventListener('click', () => {
	snake.direction.x = -1
	snake.direction.y = 0
})

const but_right = document.createElement('button')
controls.appendChild(but_right)
but_right.className = 'right'
but_right.textContent = '➡️'
but_right.addEventListener('click', () => {
	snake.direction.x = 1
	snake.direction.y = 0
})

const but_down = document.createElement('button')
controls.appendChild(but_down)
but_down.className = 'down'
but_down.textContent = '⬇️'
but_down.addEventListener('click', () => {
	snake.direction.x = 0
	snake.direction.y = 1
})

function update() {
	snake.update()
}

function draw() {
	ctx.fillStyle = BLACK
	ctx.clearRect(0,0,WIDTH,HEIGHT)
	ctx.fillRect(0,0,WIDTH,HEIGHT)

	ctx.strokeStyle = WHITE
	for (let i = 1; i < COLS; i++) {
		ctx.beginPath()
		ctx.moveTo(UNIT*i, 0)
		ctx.lineTo(UNIT*i, HEIGHT)
		ctx.stroke()
	}
	for (let  i = 1; i < ROWS; i++) {
		ctx.beginPath()
		ctx.moveTo(0, UNIT*i)
		ctx.lineTo(WIDTH, UNIT*i)
		ctx.stroke()
	}

	snake.draw(ctx)
	fruit.draw(ctx)
}

function loop() {
	update()
	draw()

	setTimeout(() => requestAnimationFrame(loop), DELAY)
}
requestAnimationFrame(loop)