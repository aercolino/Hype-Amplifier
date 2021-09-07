# Version 2


## About functionalities

1. done - Make it work both on Hacker News and Reddit, while keeping the spread based on points and comments
2. done - Replace the slider with two controls
    1. points: an input box, accepting any positive integer between 0 and 100 (defaulted to 50)
    2. comments: a computed label, always set to the difference between 100 and the input value above
3. done - Use a manifest of version 3
4. Allow the user to re-spread after ignoring an entry
    1. the user will tick off an entry and the app will apply the new spread
    2. the ticked off entry will keep the position it had just before ticking it off
5. Allow the user to replace the usual spread with a progress bar, whose length equals the spread

    ```html
    <progress value="15" max="100" style="width: 600px;"></progress>
    ```

6. Allow the user to navigate the current spread
    1. the user will click a couple of prev / next buttons per entry
    2. the app will scroll to and highlight the prev / next entry
7. Allow to see the reverse spread, i.e. with the least hyped news on the leftmost positions
