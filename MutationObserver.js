// CLASSIC view
const targetNode = document.querySelector('button[data-click-id="upvote"][id]')
    .parentElement.parentElement.parentElement.parentElement
    .parentElement.parentElement.parentElement.parentElement;
const config = { childList: true };
const callback = function(mutationsList, observer) {
    for(const mutation of mutationsList) {
        console.log('A child node has been added or removed.', mutation);
    }
};
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);

// COMPACT view
// item: document.querySelector('button[data-click-id="upvote"][id]').parentElement.parentElement.parentElement.parentElement
// list: document.querySelector('button[data-click-id="upvote"][id]').parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement

// CLASSIC view
// item: document.querySelector('button[data-click-id="upvote"][id]').parentElement.parentElement.parentElement.parentElement
// list: document.querySelector('button[data-click-id="upvote"][id]').parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
