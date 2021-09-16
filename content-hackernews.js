// Hyped News Amplifier - (C) Andrea Ercolino, http://andowebsit.es

const MESSAGES_ON_THE_FIRST_PAGE = 30; // units

class HackerNewsAmplifier extends Amplifier {
    constructor(pointsRatio, { rows, maxWidth }) {
        super(pointsRatio);
        this.rows = rows;
        this.maxWidth = maxWidth;
    }

    amplifyItem(index, percentage) {
        const title = this.rows[index];
        // We get to the byline like below because we want to skip Y Combinator announcements
        // and bylines are not siblings to titles but cousins!
        const byline = title.parentElement.nextElementSibling.querySelector(':scope .subtext');
        const amplitude = Amplifier.getAmplitude({ percentage, maxAmplitude: this.maxWidth });
        title.style.paddingLeft = `${amplitude}px`;
        byline.style.paddingLeft = `${amplitude}px`;
    }

    static pointsElements() {
        return document.querySelectorAll('.score');
    }
    
    static commentsElements() {
        return document.querySelectorAll('.subtext :nth-child(6)');
    }
    
    static firstPageIsAvailable() {
        const messages = document.querySelectorAll('td:nth-child(3).title');
        return messages.length >= MESSAGES_ON_THE_FIRST_PAGE;
    }
    
    static amplifiableElements() {
        // We get to the title like below because we want to skip Y Combinator announcements
        return document.querySelectorAll('.votelinks~.title');
    }
}


chrome.storage.local.get(['points_weight'], function(response) {
    let newsWidth;

    function amplification() {
        const rows = HackerNewsAmplifier.amplifiableElements();
        if (rows.length === 0) return;

        const pointsCountList = Amplifier.countList(HackerNewsAmplifier.pointsElements());
        const commentsCountList = Amplifier.countList(HackerNewsAmplifier.commentsElements());
        const amp = new HackerNewsAmplifier(response.points_weight, { rows, maxWidth: newsWidth });
        amp.amplifyList({ pointsCountList, commentsCountList });
    }

    function amplify() {
        try {
            amplification();
        }
        catch (e) {
            console.log('ERROR', e);
        }
    }

    Amplifier.waitForCondition(document.location.pathname, HackerNewsAmplifier.firstPageIsAvailable)
        .then(() => {
            const tableWidth = document.getElementById('pagespace').clientWidth;
            const firstMessage = document.querySelector('td:nth-child(3).title').parentElement;
            const messageNumberWidth = firstMessage.querySelector(':scope .title').clientWidth;
            const upButtonWidth = firstMessage.querySelector(':scope .votelinks').clientWidth;
            newsWidth = tableWidth - upButtonWidth - messageNumberWidth;
            amplify();
        });
});

