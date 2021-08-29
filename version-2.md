# Version 2


## about the functionalities

1. keep the spread based on points and comments
2. replace the slider with two controls:
    1. points: an input box, accepting any positive integer between 0 and 100 (defaulted to 30)
    2. comments: a computed label, always set to the difference between 100 and the input value above
3. allow the user to re-spread after ignoring an entry
    1. the user will tick off an entry and the app will apply the new spread
    2. the ticked off entry will keep the position it had just before ticking it off
4. allow the user to navigate the current spread
    1. the user will click a couple of prev / next buttons per entry
    2. the app will scroll to and highlight the prev / next entry


## about Hacker News


## about Reddit

+ it will only work when "Global content view" is set to CLASSIC, or COMPACT
    + otherwise there is not enough space to spread
+ there will be an additional option to set the number of entries to limit the spread to
    + this is to cope with the infinite scroll
    + each time the page expands to display newly downloaded entries, the app applies a new spread
    + when set to 1, the spread will be applied to all currently available entries
    + when set to anything else (greater than 1), the spread will be applied to the last block of that many entries
        + in this case the blocks will be separated by some pixels (for example applying a margin-top to the first entry)

