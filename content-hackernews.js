// Hyped News Amplifier - (C) Andrea Ercolino, http://andowebsit.es

const MESSAGES_ON_THE_FIRST_PAGE = 30; // units

class HackerNewsAmplifier extends Amplifier {
    constructor(rows, pointsCountList, commentsCountList, maxAmplitude, pointsRatio) {
        super(pointsCountList, commentsCountList, maxAmplitude, pointsRatio);
        this.rows = rows;
    }

    amplifyItem(index, amplitude) {
        const title = this.rows[index];
        const byline = title.parentElement.nextElementSibling.querySelector('.subtext');
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

function firstMessageElement() {
    const messages = document.querySelectorAll('td:nth-child(3).title');
    const firstPageCompleted = messages.length >= MESSAGES_ON_THE_FIRST_PAGE;
    if (firstPageCompleted) {
        return messages[0];
    }
    return undefined;
}

function amplifiableElements() {
    return document.querySelectorAll('.votelinks~.title');
}


chrome.extension.sendRequest({getLocalStorage: "points_weight"}, function(response) {

    let newsWidth;

    function amplification() {
        const rows = amplifiableElements();
        if (rows.length === 0) return;

        const pointsCountList = Amplifier.countList(pointsElements());
        const commentsCountList = Amplifier.countList(commentsElements());
        const amp = new HackerNewsAmplifier(rows, pointsCountList, commentsCountList, newsWidth, response && response.points_weight);
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

    Amplifier.waitForElement(firstMessageElement)
        .then((firstMessage) => {
            newsWidth = firstMessage.clientWidth;
            amplify();
        });
});

