import { create } from 'zustand'
import { syntaxExercises } from '../data/syntaxExercises'
import { truthExercises } from '../data/truthExercises'
import { finderLevels } from '../data/finderLevels'

const useGameStore = create((set, get) => ({
    currentModule: null,
    score: 0,
    currentExerciseIndex: 0,
    exercises: [],
    timeLeft: 60,
    totalExercises: 0,
    gameFinished: false,

    startGame: (module) => {
        let exercises
        if (module === 'syntax') exercises = [...syntaxExercises]
        else if (module === 'finder') exercises = [...finderLevels]
        else exercises = [...truthExercises]
        set({
            currentModule: module,
            score: 0,
            currentExerciseIndex: 0,
            exercises,
            totalExercises: exercises.length,
            timeLeft: 60,
            gameFinished: false,
        })
    },

    submitAnswer: (isCorrect, points) => {
        if (isCorrect) {
            set((state) => ({ score: state.score + points }))
        }
    },

    nextExercise: () => {
        const { currentExerciseIndex, totalExercises } = get()
        if (currentExerciseIndex + 1 >= totalExercises) {
            set({ gameFinished: true })
        } else {
            set({
                currentExerciseIndex: currentExerciseIndex + 1,
                timeLeft: 60,
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
            timeLeft: 60,
            gameFinished: false,
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
