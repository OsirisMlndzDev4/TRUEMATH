import { create } from 'zustand'
import { syntaxExercises } from '../data/syntaxExercises'
import { finderLevels } from '../data/finderLevels'

const DIFF_MAP = { facil: 'easy', medio: 'medium', dificil: 'hard' }

const SYNTAX_TIME = { easy: 45, medium: 60, hard: 90 }
const DEFAULT_TIME = 60

function getInitialTime(difficulty) {
    const mapped = DIFF_MAP[difficulty] || difficulty
    return SYNTAX_TIME[mapped] || DEFAULT_TIME
}

const shuffle = (arr) => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

const useGameStore = create((set, get) => ({
    currentModule: null,
    score: 0,
    currentExerciseIndex: 0,
    exercises: [],
    timeLeft: DEFAULT_TIME,
    totalExercises: 0,
    gameFinished: false,
    selectedDifficulty: null,

    startGame: (module, difficulty = null) => {
        let exercises
        if (module === 'syntax') {
            let all = [...syntaxExercises]
            if (difficulty && DIFF_MAP[difficulty]) {
                all = all.filter(e => e.difficulty === DIFF_MAP[difficulty])
            }
            exercises = shuffle(all)
        } else {
            exercises = shuffle([...finderLevels])
        }

        const initialTime = module === 'syntax' && difficulty
            ? getInitialTime(difficulty)
            : DEFAULT_TIME

        set({
            currentModule: module,
            score: 0,
            currentExerciseIndex: 0,
            exercises,
            totalExercises: exercises.length,
            timeLeft: initialTime,
            gameFinished: false,
            selectedDifficulty: difficulty,
        })
    },

    submitAnswer: (isCorrect, points) => {
        if (isCorrect) {
            set((state) => ({ score: state.score + points }))
        }
    },

    nextExercise: () => {
        const { currentExerciseIndex, totalExercises, exercises, currentModule, selectedDifficulty } = get()
        if (currentExerciseIndex + 1 >= totalExercises) {
            set({ gameFinished: true })
        } else {
            const nextIdx = currentExerciseIndex + 1
            const nextExercise = exercises[nextIdx]
            const nextTime = currentModule === 'syntax' && nextExercise
                ? (SYNTAX_TIME[nextExercise.difficulty] || DEFAULT_TIME)
                : DEFAULT_TIME

            set({
                currentExerciseIndex: nextIdx,
                timeLeft: nextTime,
            })
        }
    },

    endGame: () => {
        set({ gameFinished: true })
    },

    resetGame: () => {
        set({
            currentModule: null,
            score: 0,
            currentExerciseIndex: 0,
            exercises: [],
            totalExercises: 0,
            timeLeft: DEFAULT_TIME,
            gameFinished: false,
            selectedDifficulty: null,
        })
    },

    setTimeLeft: (time) => {
        set({ timeLeft: time })
    },

    tickTimer: () => {
        const { timeLeft } = get()
        if (timeLeft > 0) {
            set({ timeLeft: timeLeft - 1 })
        }
    },
}))

export default useGameStore
