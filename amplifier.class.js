// Hyped News Amplifier - (C) Andrea Ercolino, http://andowebsit.es

class Amplifier {
    static goldenRatio = 0.618;
    static ratingStarsFragments = this.createRatingStarsFragments();

    constructor(pointsCountList, commentsCountList, pointsRatio) {
        this.pointsCountList = pointsCountList;
        this.commentsCountList = commentsCountList;

        this.ratios = Amplifier.getRatios(pointsRatio);
        this.pointsCountMax = Math.max(...this.pointsCountList);
        this.commentsCountMax = Math.max(...this.commentsCountList);
        this.weightedWhole = this.pointsCountMax * this.ratios.points + this.commentsCountMax * this.ratios.comments;
    }

    getPercentage({ pointsCount, commentsCount }) {
        const weightedPartial = pointsCount * this.ratios.points + commentsCount * this.ratios.comments;
        const result = weightedPartial / this.weightedWhole * 100;
        return result;
    }

    amplifyItem(index, percentage) {
        throw new Error('Expected some implementation of this method');
    }

    amplifyList() {
        this.pointsCountList.forEach((pointsCount, index) => {
            const commentsCount = this.commentsCountList[index];
            const percentage = this.getPercentage({ pointsCount, commentsCount });
            this.amplifyItem(index, percentage);
        });
    }

    static getRatios(pointsRatio) {
        var result = { points: (pointsRatio || 50) / 100 };
        result.comments = 1 - result.points;
        return result;
    }

    static parseCount(scrapedText) {
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

    static waitForElement(pathname, selectorFn, { delay, maxWait } = { delay: 300, maxWait: 30000 }) {
        return new Promise((resolve, reject) => {
            let element = selectorFn();
            if (element) {
                return resolve(element);
            }
            const name = selectorFn.name ?? '(anonymous)';
            const waitingSince = new Date();
            const intervalId = setInterval(() => {
                if (document.location.pathname !== pathname) {
                    clearInterval(intervalId);
                    reject(new Error('Abort'));
                }
                if (new Date() - waitingSince >= maxWait) {
                    clearInterval(intervalId);
                    reject(new Error('Timeout'));
                }
                element = selectorFn();
                if (element) {
                    clearInterval(intervalId);
                    resolve(element);
                }
            }, delay);
        });
    }

    static countList(list) {
        const result = [];
        const elements = list;
        if (elements.length === 0) return result;
    
        for (let element of elements) {
            const value = this.parseCount(element.textContent.split(' ')[0]);
            result.push(value);
        }
        return result;
    }

    static createRatingStarsFragments() {
        const ratingStarsHtml = {
            null: '<div class="hna-rating null"><span></span><span></span><span></span><span></span><span></span></div>',
            cold: '<div class="hna-rating cold"><span></span><span></span><span></span><span></span><span></span></div>',
            cool: '<div class="hna-rating cool"><span></span><span></span><span></span><span></span><span></span></div>',
            warm: '<div class="hna-rating warm"><span></span><span></span><span></span><span></span><span></span></div>',
            warmer: '<div class="hna-rating warmer"><span></span><span></span><span></span><span></span><span></span></div>',
            hot: '<div class="hna-rating hot"><span></span><span></span><span></span><span></span><span></span></div>',
        };
        const documentRange = document.createRange();
        const entries = Object.entries(ratingStarsHtml).map(([key, value]) => ([key, documentRange.createContextualFragment(value)]));
        const result = Object.fromEntries(entries);
        return result;
    }

    static getAmplitude({percentage, maxAmplitude}) {
        // A reverse fraction is needed because we want to move to the right the least hyped messages
        const reverseFraction = 1 - percentage / 100;
        var result = reverseFraction * maxAmplitude * Amplifier.goldenRatio;
        return result;
    }

    static ratingStarsElement(percentage) {
        let fragment;
        switch (true) {
            case percentage === 0: fragment = this.ratingStarsFragments.null; break;
            case percentage < 20: fragment = this.ratingStarsFragments.cold; break;
            case percentage < 40: fragment = this.ratingStarsFragments.cool; break;
            case percentage < 60: fragment = this.ratingStarsFragments.warm; break;
            case percentage < 80: fragment = this.ratingStarsFragments.warmer; break;
            case percentage >= 80: fragment = this.ratingStarsFragments.hot; break;
        }
        return fragment.cloneNode(true);
    }
}
