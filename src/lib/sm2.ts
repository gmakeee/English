export interface SM2Input {
    interval: number;
    easeFactor: number;
    grade: number; // 0-5 rating
}

export interface SM2Output {
    interval: number;
    easeFactor: number;
    nextReview: Date;
}

export const calculateSM2 = ({ interval, easeFactor, grade }: SM2Input): SM2Output => {
    let newInterval: number;
    let newEaseFactor: number;

    if (grade >= 3) {
        if (interval === 0) {
            newInterval = 1;
        } else if (interval === 1) {
            newInterval = 6;
        } else {
            newInterval = Math.round(interval * easeFactor);
        }

        newEaseFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
        if (newEaseFactor < 1.3) newEaseFactor = 1.3;
    } else {
        // If grade is low (<3), reset interval but arguably keep EF or lower it slightly
        // Standard SM-2 resets interval to 1
        newInterval = 1;
        newEaseFactor = easeFactor;
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + newInterval);

    return {
        interval: newInterval,
        easeFactor: newEaseFactor,
        nextReview
    };
};
