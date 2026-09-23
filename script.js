const canvas = document.getElementById("game")
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d")

const hitlineY = 850
const hitzone = 50

const PERFECT_WINDOW = 20
const GOOD_WINDOW = hitzone
const MISS_WINDOW = 80

// vars
let score = 0
let misses = 0
let combo = 0
let highestCombo = 0
let accuracyReal = 100
let accuracy = 100
let grade = "?"


let hitNotes = 0 // perfect: 1, good: 0.75
let missedNotes = 0
let totalNotes = 0

stopped = false

// colors
const circleColor = "rgba(166, 47, 182, 0.55)"
const circleColorPressed = "rgba(214, 111, 228, 0.81)"
const outlineColor = "rgb(80, 8, 76)"

// settings
let noteSpeed = 10
let noteSpeedQuery = 10
let noteAmount = 100
let doubleNotes = true

const ASKL = [
    { x: 100, y: 850, radius: 45, color: circleColor},
    { x: 200, y: 850, radius: 45, color: circleColor},
    { x: 300, y: 850, radius: 45, color: circleColor},
    { x: 400, y: 850, radius: 45, color: circleColor}
]

function drawASKL() {
    for (let circle of ASKL) {
        ctx.beginPath()
        ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI)
        ctx.fillStyle = circle.color
        ctx.strokeStyle = outlineColor
        ctx.lineWidth = 3
        ctx.fill()
        ctx.stroke()
    }
}

function updateAccuracy() {
    accuracyReal = (hitNotes/(totalNotes)) * 100
    accuracy = accuracyReal.toFixed(2)

    // grades
    if (accuracy == 100) {
        grade = "SS"
    } else if (accuracy >= 95) {
        grade = "S"
    } else if (accuracy >= 90) {
        grade = "A"
    } else if (accuracy >= 80) {
        grade = "B"
    } else if (accuracy >= 70) {
        grade = "C"
    } else if (accuracy >= 50) {
        grade = "D"
    } else {
        grade = "F"
    }
}

function checkHit(key) {
    const map = { a: 0, s: 1, k: 2, l: 3 }
    const col = map[key]
    if (col === undefined) return

    let nearestI = -1
    let nearestDist = Infinity
    for (let i = 0; i < noteMap.length; i++) {
        const n = noteMap[i]

        if (n.key !== key) continue

        const dist = Math.abs(n.y - hitlineY)

        if (dist < nearestDist) {
            nearestDist = dist
            nearestI = i
        }
    }

    if (nearestI === -1) return

    if (nearestDist <= PERFECT_WINDOW) { // perfect hit
        noteMap.splice(nearestI, 1)

        score += 200
        combo += 1

        totalNotes += 1
        hitNotes += 1

        if (combo >= highestCombo) highestCombo = combo
        updateAccuracy()
    } else if (nearestDist <= GOOD_WINDOW) { // good hit
        noteMap.splice(nearestI, 1)

        score += 100
        combo += 1

        totalNotes += 1
        hitNotes += 0.75

        if (combo >= highestCombo) highestCombo = combo
        updateAccuracy()
    } else if (nearestDist <= MISS_WINDOW) { // miss
        noteMap.splice(nearestI, 1)

        score -= 50
        combo = 0

        misses += 1
        missedNotes += 1
        totalNotes += 1

        updateAccuracy()
    }

    updateStats()
}

document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase()
    switch (key) {
        case "a":
            ASKL[0].color = circleColorPressed
            break
        case "s":
            ASKL[1].color = circleColorPressed
            break
        case "k":
            ASKL[2].color = circleColorPressed
            break
        case "l":
            ASKL[3].color = circleColorPressed
            break
    }
    checkHit(key)
})

document.addEventListener("keyup", (event) => {
    switch (event.key.toLowerCase()) {
        case "a":
            ASKL[0].color = circleColor
            break
        case "s":
            ASKL[1].color = circleColor
            break
        case "k":
            ASKL[2].color = circleColor
            break
        case "l":
            ASKL[3].color = circleColor
            break
    }
})

document.getElementById("generate").addEventListener("click", () => {
    noteMap = []
    noteSpeed = noteSpeedQuery
    generateMap(noteAmount, doubleNotes)

    score = 0
    misses = 0
    combo = 0
    highestCombo = 0
    accuracyReal = 100
    accuracy = 100
    grade = "?"
    hitNotes = 0
    missedNotes = 0
    totalNotes = 0
    updateStats()
})

document.getElementById("pause").addEventListener("click", () => {
    document.getElementById("pause").textContent = stopped ? "Pause" : "Play"
    stopped = !stopped
    animate()
})

const noteSpeedInput = document.getElementById("noteSpeed")
noteSpeedInput.addEventListener("input", () => {
    let value = Number(noteSpeedInput.value)
    if (!isNaN(value) && value >= 1) {
        noteSpeedQuery = value
    }
})

const noteAmountInput = document.getElementById("noteAmount")
noteAmountInput.addEventListener("input", () => {
    let value = Number(noteAmountInput.value)
    if (!isNaN(value) && value >= 0) {
        noteAmount = value
    }
})

const doubleNotesInput = document.getElementById("doubleNotes")
doubleNotesInput.addEventListener("change", () => {
    doubleNotes = doubleNotesInput.checked
})

// NOTES

let noteMap = [
    // { x: 100, y: 0, radius: 45, color: circleColor, key: "a"},
    // { x: 300, y: -100, radius: 45, color: circleColor, key: "k"},
    // { x: 200, y: -200, radius: 45, color: circleColor, key: "s"},
    // { x: 400, y: -300, radius: 45, color: circleColor, key: "l"},
    // { x: 400, y: -400, radius: 45, color: circleColor, key: "l"},
]

function generateMap(amount, doubleNotes) {
    let lastKeys = []
    const keyArr = ["a", "s", "k", "l"]
    for (let i = 0; i < amount; i++) {
        let x = Math.floor(Math.random() * 4) * 100 + 100
        let y = (-i*100) + (50 ? Math.random() < 0.25 : 0)
        let key = keyArr[(x/100)-1]

        if (lastKeys.length > 2 && doubleNotes) { // this makes it so you cant get 3 notes in a row in the same column
            if (lastKeys[i-1] === key && lastKeys[i-2] === key) {
                let lastX = x
                do {
                    x = Math.floor(Math.random() * 4) * 100 + 100
                } while (x === lastX)
                key = keyArr[(x/100)-1]
            }
        } else if (lastKeys.length > 1) { // no double notes
            if (lastKeys[i-1] === key) {
                let lastX = x
                do {
                    x = Math.floor(Math.random() * 4) * 100 + 100
                } while (x === lastX)
                key = keyArr[(x/100)-1]
            }
        }

        lastKeys.push(key)
        noteMap.push({ x: x, y: y, radius: 45, color: circleColor, key: key})
    }
}

generateMap(noteAmount, true) // generates random map with n notes, you can map notes manually but good luck with that buddy

function drawNotes() {
    for (let note of noteMap) {
        ctx.beginPath()
        ctx.arc(note.x, note.y, note.radius, 0, 2 * Math.PI)
        ctx.fillStyle = note.color
        ctx.strokeStyle = outlineColor
        ctx.lineWidth = 3
        ctx.fill()
        ctx.stroke()
    }
}

function updateNotes() {
    for (let i = noteMap.length - 1; i >= 0; i--) {
        const note = noteMap[i]
        note.y += noteSpeed
        if (note.y > canvas.height || note.y > hitlineY + MISS_WINDOW) { // miss
            noteMap.splice(i, 1)

            score -= 50
            combo = 0

            misses += 1
            missedNotes += 1
            totalNotes += 1

            updateAccuracy()
            updateStats()
        }
    }
}

function updateStats() {
    document.getElementById("score").textContent = `Score: ${score}`
    document.getElementById("combo").textContent = `${combo}`
    document.getElementById("misses").textContent = `Misses: ${misses}`
    document.getElementById("highestcombo").textContent = `Highest combo: ${highestCombo}`
    document.getElementById("accuracy").textContent = `Accuracy: ${accuracy}%`
    document.getElementById("grade").textContent = `Grade: ${grade}`
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    updateNotes()
    drawASKL()
    drawNotes()

    if (!stopped) {
        requestAnimationFrame(animate)
    }
}

// canvas width: 500, height: 900
animate()