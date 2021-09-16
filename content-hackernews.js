// Hyped News Amplifier - (C) Andrea Ercolino, http://andowebsit.es

const MESSAGES_ON_THE_FIRST_PAGE = 30; // units

class HackerNewsAmplifier extends Amplifier {
    constructor(pointsCountList, commentsCountList, pointsRatio, { rows, maxWidth }) {
        super(pointsCountList, commentsCountList, pointsRatio);
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
}

function pointsElements() {
    return document.querySelectorAll('.score');
}

function commentsElements() {
    return document.querySelectorAll('.subtext :nth-child(6)');
}

function firstPage() {
    const messages = document.querySelectorAll('td:nth-child(3).title');
    return messages.length >= MESSAGES_ON_THE_FIRST_PAGE;
}

function amplifiableElements() {
    // We get to the title like below because we want to skip Y Combinator announcements
    return document.querySelectorAll('.votelinks~.title');
}


chrome.storage.local.get(['points_weight'], function(response) {
    let newsWidth;

    function amplification() {
        const rows = amplifiableElements();
        if (rows.length === 0) return;

        const pointsCountList = Amplifier.countList(pointsElements());
        const commentsCountList = Amplifier.countList(commentsElements());
        const amp = new HackerNewsAmplifier(pointsCountList, commentsCountList, response && response.points_weight, { rows, maxWidth: newsWidth });
        amp.amplifyList();
    }

    function amplify() {
        try {
            amplification();
        }
        catch (e) {
            console.log('ERROR', e);
        }
    }

    Amplifier.waitForCondition(document.location.pathname, firstPage)
        .then(() => {
            const firstMessage = document.querySelector('td:nth-child(3).title');
            const tableWidth = document.getElementById('pagespace').clientWidth;
            const messageNumberWidth = firstMessage.querySelector(':scope .title').clientWidth;
            const upButtonWidth = firstMessage.querySelector(':scope .votelinks').clientWidth;
            newsWidth = tableWidth - upButtonWidth - messageNumberWidth;
            amplify();
        });
});

