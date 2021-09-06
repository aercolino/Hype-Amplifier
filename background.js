// Hyped News Amplifier - (C) Andrea Ercolino, http://andowebsit.es

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    if (!(request.getLocalStorage && request.getLocalStorage == 'points_weight')) {
        sendResponse({});
        return;
    }
    if (!localStorage['points_weight']) {
        localStorage['points_weight'] = 50;
    }
    sendResponse({ points_weight: localStorage['points_weight'] });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.action.disable();
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostEquals: 'news.ycombinator.com', schemes: ['https'] },
                }),
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostEquals: 'www.reddit.com', schemes: ['https'] },
                })
            ],
            actions: [new chrome.declarativeContent.ShowAction()],
        }]);
    });
});
