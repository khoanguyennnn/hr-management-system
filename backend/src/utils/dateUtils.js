function parseAndNormalizeDate(dateInput) {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
        const error = new Error('Invalid date format.');
        error.statusCode = 400;
        throw error;
    }
    date.setHours(0, 0, 0, 0);
    return date;
}

function validateDateRange(start, end) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start.getTime() < today.getTime()) {
        const error = new Error('Start date must be today or in the future.');
        error.statusCode = 400;
        throw error;
    }

    if (start > end) {
        const error = new Error('Start date cannot be after end date.');
        error.statusCode = 400;
        throw error;
    }
}

function calculateRequestedDays(start, end) {
    const diff = end - start;
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
}

function isDateRangeOverlapping(start1, end1, start2, end2) {
    return start1 <= end2 && end1 >= start2;
}

module.exports = {
    parseAndNormalizeDate,
    validateDateRange,
    calculateRequestedDays,
    isDateRangeOverlapping
};