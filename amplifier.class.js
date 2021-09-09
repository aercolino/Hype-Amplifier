// Hyped News Amplifier - (C) Andrea Ercolino, http://andowebsit.es

const goldenRatio = 0.618;

function getRatios(pointsRatio) {
    var result = { points: (pointsRatio || 50) / 100 };
    result.comments = 1 - result.points;
    return result;
}

function parseCount(scrapedText) {
    let floatValue = parseFloat(scrapedText);
    if (isNaN(floatValue)) {
        floatValue = 0;
    }
    if (/k$/i.test(scrapedText)) { // kilo points
        floatValue *= 1000;
    }
    if (/m$/i.test(scrapedText)) { // mega points
        floatValue *= 1000 * 1000;
    }
    const result = Math.floor(floatValue, 10);
    return result;
}

function waitForElement(selectorFn, { delay } = { delay: 100 }) {
    return new Promise((resolve) => {
        let element = selectorFn();
        if (element) {
            return resolve(element);
        }
        const intervalId = setInterval(() => {
            element = selectorFn();
            if (element) {
                clearInterval(intervalId);
                resolve(element);
            }
        }, delay);
    });
}

function countList(list) {
    const result = [];
    const elements = list;
    if (elements.length === 0) return result;

    for (let element of elements) {
        const value = Amplifier.parseCount(element.textContent.split(' ')[0]);
        result.push(value);
    }
    return result;
}


class Amplifier {
    constructor(pointsCountList, commentsCountList, maxAmplitude, pointsRatio) {
        this.pointsCountList = pointsCountList;
        this.commentsCountList = commentsCountList;
        this.maxAmplitude = maxAmplitude * goldenRatio;

        this.ratios = getRatios(pointsRatio);
        this.pointsCountMax = Math.max(...this.pointsCountList);
        this.commentsCountMax = Math.max(...this.commentsCountList);
        this.weightedWhole = this.pointsCountMax * this.ratios.points + this.commentsCountMax * this.ratios.comments;
    }

    getPercentage({ pointsCount, commentsCount }) {
        const weightedPartial = pointsCount * this.ratios.points + commentsCount * this.ratios.comments;
        const result = weightedPartial / this.weightedWhole * 100;
        return result;
    }

    getAmplitude({ pointsCount, commentsCount }) {
        // A reverse fraction is needed because we want to move to the right the least hyped messages
        const reverseFraction = 1 - this.getPercentage({ pointsCount, commentsCount }) / 100;
        var result = reverseFraction * this.maxAmplitude;
        return result;
    }

    amplifyItem(index, { pointsCount, commentsCount }) {
        throw new Error('Expected some implementation of this method');
    }

    amplifyList() {
        this.pointsCountList.forEach((pointsCount, index) => {
            const commentsCount = this.commentsCountList[index];
            this.amplifyItem(index, { pointsCount, commentsCount });
        });
    }

    static parseCount(...args) {
        return parseCount(...args);
    }

    static waitForElement(...args) {
        return waitForElement(...args);
    }

    static countList(...args) {
        return countList(...args);
    }
}
