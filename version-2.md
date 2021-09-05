# Version 2


## About the functionalities

1. Keep the spread based on points and comments
2. Replace the slider with two controls
    1. points: an input box, accepting any positive integer between 0 and 100 (defaulted to 30)
    2. comments: a computed label, always set to the difference between 100 and the input value above
3. Allow the user to re-spread after ignoring an entry
    1. the user will tick off an entry and the app will apply the new spread
    2. the ticked off entry will keep the position it had just before ticking it off
4. Allow the user to navigate the current spread
    1. the user will click a couple of prev / next buttons per entry
    2. the app will scroll to and highlight the prev / next entry
5. Allow to see the reverse spread, i.e. with the least hyped news on the leftmost positions


## About Hacker News


## About Reddit

+ The app will only work when "Global content view" is set to CLASSIC, or COMPACT
    + otherwise there is not enough space to spread
+ There will be an additional option (MAX_ENTRIES) to set the number of entries to limit the spread to
    + this is to cope with the infinite scroll
    + each time the page downloads more entries, the app applies a new spread
    + MAX_ENTRIES === 1, the spread will be applied to all currently available entries
    + MAX_ENTRIES > 1, the spread will be applied to the last block of that many entries
        + in this case the blocks will be separated by some pixels (for example applying a `margin-top` to the first entry of the block)

### Mutation Observer

+ See the [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) file for an example of how to watch changes to the list of entries
+ However, that is just a roof of concept. The final implementation should throttle that detection
    + send a "ENTRIES_ADDED" event when
        + either a new block of MAX_ENTRIES has been added
        + or there are additional entries since the last send but no more entries have been added in the last MAX_WAIT milliseconds (this is to treat the last few N entries, with N < MAX_ENTRIES)
+ This throttled detection is needed also to apply the spread, it's our "dom ready" event

### Alternative to spread

+ The spread doesn't work well with the current reddit page, because the text of the row does not adjust after changing `margin-left`
+ I'm thinking about alternatives

--

1. we could add to each row a progress bar, with a length equal to the spread

```html
<progress value="15" max="100" style="width: 600px;"></progress>
```
