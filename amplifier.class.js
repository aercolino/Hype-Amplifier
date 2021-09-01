// Hyped News Amplifier - (C) Andrea Ercolino, http://andowebsit.es

 const goldenRatio = 0.618;

function getRatios(pointsRatio) {
    var result = {points: (pointsRatio || 50) / 100};
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

export default class Amplifier {
    constructor(pointsCountList, commentsCountList, maxAmplitude, pointsRatio) {
        this.pointsCountList = pointsCountList;
        this.commentsCountList = commentsCountList;
        this.maxAmplitude = maxAmplitude * goldenRatio;

        this.ratios = getRatios(pointsRatio);
        this.pointsCountMax = Math.max(...this.pointsCountList);
        this.commentsCountMax = Math.max(...this.commentsCountList);
        this.factor = this.maxAmplitude / (this.pointsCountMax * this.ratios.points + this.commentsCountMax * this.ratios.comments);
    }

    getAmplitude({ pointsCount, commentsCount }) {
        var delta = {
            points: this.pointsCountMax - pointsCount,
            comments: this.commentsCountMax - commentsCount,
        };
        var result = Math.floor(this.factor * (delta.points * this.ratios.points + delta.comments * this.ratios.comments));
        return result;
    }

    amplifyItem(index, amplitude) {
        throw new Error('Expected some implementation of this method');
    }

    amplifyList() {
        this.pointsCountList.forEach((pointsCount, index) => {
            const commentsCount = this.comments[index];
            var amplitude = this.getAmplitude({ pointsCount, commentsCount });
            this.amplifyItem(index, amplitude);
        });
    }

    static parseCount(scrapedText) {
        return parseCount(scrapedText);
    }
}
