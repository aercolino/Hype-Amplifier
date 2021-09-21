# Hyped News Amplifier - Release Notes


## Version 1.9.0

+ Previous Version was **1.8.2** (published on 2014-07-11)


Welcome to version 1.9.0 of Hyped News Amplifier.

This is a minor update, coming to you more than seven years after the previous version.

Among the bazillion things that happened since then, the most important was that Reddit abandoned HTTP connections entirely, in favor of HTTPS. That made this extension stop working for them, six years ago.

+ I fixed the Reddit support
+ I introduced the STARS mode, a new method to spot hyped news at a glance on Reddit
+ I kept the SPREAD mode, the old method to spot hyped news at a glance on Hacker News


### Modes

Up to version 1.8.2, Hyped News Amplifier only used the SPREAD mode. Since version 1.9.0, Hyped News Amplifier uses the SPREAD and the STARS modes.


#### Spread Mode

+ It applies to all of Hacker News, plus the _COMPACT_ view of Reddit.

In Spread Mode, Hyped News Amplifier spreads messages over the available horizontal space, according to the number of points and comments. This way, news with fewer points and comments shift to the right, so that the most voted and commented news _pop out_ on the left.

This mode, the hallmark of Hyped News Amplifier, is particularly well suited for lists of text only messages, where the available horizontal space is a big part of the screen estate.


#### Stars Mode

+ It applies to all of Reddit, minus its _COMPACT_ view.

In Stars Mode, Hyped News Amplifier assigns up to 5 stars to messages, according to the number of points and comments. This way, news with fewer points and comments get less stars, so that the most voted and commented news _pop out_ with 5 stars.

This mode is particularly well suited for lists of text and media messages, where the available horizontal space is a small part of the screen estate.


### Differences with respect to version 1.8.2

#### UX

+ Fixed Reddit support
+ Introduced the _Stars_ mode
+ Simplified the _Options_ page


#### Code

+ Rewritten all the code
+ Migrated extension manifest to version 3
+ Removed jQuery and jQuery UI dependencies
