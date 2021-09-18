// Hyped News Amplifier - (C) Andrea Ercolino, http://andowebsit.es

const MESSAGES_ON_THE_PAGE = 30; // units

class HackerNewsAmplifier extends Amplifier {
    amplifyList({ pointsCountList, commentsCountList, rows, maxWidth }) {
        this.rows = rows;
        this.maxWidth = maxWidth;
        super.amplifyList({ pointsCountList, commentsCountList });
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
    
    static amplifiableElements() {
        // We get to the title like below because we want to skip Y Combinator announcements
        return document.querySelectorAll('.votelinks~.title');
    }

    static waitForPage(pathname) {
        function pageIsAvailable() {
            const messages = document.querySelectorAll('td:nth-child(3).title');
            return messages.length >= MESSAGES_ON_THE_PAGE;
        }
        return Amplifier.waitForCondition(pathname, pageIsAvailable);
    }
}


chrome.storage.local.get(['points_weight'], function doTheMagic({ points_weight: pointsWeight }) {
    let messagesWidth;

    function amplification() {
        const rows = HackerNewsAmplifier.amplifiableElements();
        if (rows.length === 0) return;

        const pointsCountList = Amplifier.countList(HackerNewsAmplifier.pointsElements());
        const commentsCountList = Amplifier.countList(HackerNewsAmplifier.commentsElements());
        const amp = new HackerNewsAmplifier(pointsWeight);
        amp.amplifyList({ pointsCountList, commentsCountList, rows, maxWidth: messagesWidth });
    }

    function amplify() {
        try {
            amplification();
        }
        catch (e) {
            console.log('ERROR', e);
        }
    }

    function start() {
        const pathname = document.location.pathname;
        HackerNewsAmplifier.waitForPage(pathname)
            .then(() => {
                const tableWidth = document.getElementById('pagespace').clientWidth;
                const firstMessage = document.querySelector('td:nth-child(3).title').parentElement;
                const messageNumberWidth = firstMessage.querySelector(':scope .title').clientWidth;
                const upButtonWidth = firstMessage.querySelector(':scope .votelinks').clientWidth;
                messagesWidth = tableWidth - upButtonWidth - messageNumberWidth;
                amplify();
            })
            .catch((reason) => {
                console.log(`Failed start for ${pathname} because`, reason.message ?? reason);
            });
    }

    start();
});

