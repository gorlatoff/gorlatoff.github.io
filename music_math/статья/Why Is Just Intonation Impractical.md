Проанализируй предмет спора



<diskussion>

# [Why Is Just Intonation Impractical?](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical)

[Ask Question](https://music.stackexchange.com/questions/ask)

Asked 12 years ago

Modified [3 years ago](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical?lastactivity)

Viewed 54k times



65



I've read about the debate of ["just intonation"](http://en.wikipedia.org/wiki/Just_intonation) vs [12-tone equal temperament](http://en.wikipedia.org/wiki/Equal_temperament#Twelve-tone_equal_temperament). And nowhere it was clearly stated why just intonation is impractical. Here are my assumptions. Please let me know if I am correct.

Just intonation frequencies are based on the harmonic series. A fundamental tone is picked and then all of its harmonics are transposed within one octave (that is, in the range of the first two harmonics). The first N harmonics account for 12 different notes in that range.

However, if an instrument is tuned with the frequencies obtained in the above manner, the instrument only sounds good in one key. In other keys it sounds out of tune (because the frequency ratios for the intervals are not simple integer fractions like 3/2). For that reason the 12-TET tuning system was developed, so that the same strings can be reused in all keys without sounding out of tune (and without the need to re-tune the instrument when changing the key).

What is not clear is why this is the case. The Harmonic series should produce harmonic sounds. At first it looks they don't and therefore a "hack" is needed.

My guess (please refer me to a source explaining it) is that the harmonic-series-derived tones sound good in the key based on the tone that was chosen for the fundamental frequency for a given series. So if we choose C3 as the fundamental frequency, all intervals will be OK in C-major, but will be out-of-tune in A-major. For them to "work" in A-major, we need to pick A3 as the fundamental frequency and calculate and transpose the harmonics. Thus the 12 (or 24, or whatever) notes will have slightly different frequencies depending on the key. The compromise of 12-TET is made so that an instrument doesn't need hundreds of keys/strings in order to play in multiple keys.

Is that correct?

- [theory](https://music.stackexchange.com/questions/tagged/theory)
- [tuning](https://music.stackexchange.com/questions/tagged/tuning)
- [harmonics](https://music.stackexchange.com/questions/tagged/harmonics)
- [intonation](https://music.stackexchange.com/questions/tagged/intonation)
- [just-intonation](https://music.stackexchange.com/questions/tagged/just-intonation)

[Share](https://music.stackexchange.com/q/7986)

[Improve this question](https://music.stackexchange.com/posts/7986/edit)

Follow

[edited Jul 13, 2014 at 17:17](https://music.stackexchange.com/posts/7986/revisions)

![Dom's user avatar](https://i.sstatic.net/B7uhq.png?s=64)

[Dom](https://music.stackexchange.com/users/7222/dom)**♦**

**48k**2424 gold badges158158 silver badges287287 bronze badges

asked Dec 10, 2012 at 10:33

![Bozho's user avatar](https://i.sstatic.net/07ej2.jpg?s=64)

[Bozho](https://music.stackexchange.com/users/3355/bozho)

**755**11 gold badge66 silver badges99 bronze badges

- 14

  In the context of computer generated music, it can be more practical now than ever. 

  – [Dave](https://music.stackexchange.com/users/2639/dave)

   [CommentedDec 10, 2012 at 22:21](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment11151_7986)

- 15

  @WheatWilliams Speak for yourself, Wheat. I find the math very elucidating. I'm not suggesting the OP shouldn't listen to recordings or experiment as you suggest, but some of us find math to be a powerful tool for understanding these matters. 

  – [Alex Basson](https://music.stackexchange.com/users/36/alex-basson)

   [CommentedDec 11, 2012 at 2:48](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment11155_7986)

- 7

  Note that the definition of what is "A Major" (relative to whatever is your C note) **itself** changes under just intonation. The circle of fifths breaks and you actually have an infinite number of keys. 

  – [Kaz](https://music.stackexchange.com/users/3053/kaz)

   [CommentedSep 1, 2013 at 3:49 ](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment15734_7986)

- 5

  Wendy Carlos had a computer-based synthesis system that allowed rapid updating of the tuning tables. She wrote and recorded many pieces in just intonation. With this system she could start in C major just intonation and suddenly modulate to F major just intonation by adjusting the pitches. She could go around the circle of fifths in just intonation! The results can be heard on her 1986 release "Beauty in the Beast". (Yes, it's really a spiral of fifths; the C you end up on is not quite the C you started on.) 

  – [Mark Lutton](https://music.stackexchange.com/users/113/mark-lutton)

   [CommentedSep 2, 2013 at 1:29](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment15741_7986)

- 3

  In addition to reasons other answers provided, your initial question has made a faulty assumption in the first place which no one addressed. Just intonation scales are based on rational ratios, but not on the harmonic series. They are much more complex than that to achieve more equidistant pitch distribution than the harmonic series. However, even if scales were simply built upon the harmonic series, the same issue of powers of prime numbers never equating to powers of other prime numbers when multiplied out as products of tonal steps would still arise. 

  – [Kristal McKinstry](https://music.stackexchange.com/users/19638/kristal-mckinstry)

   [CommentedApr 8, 2015 at 13:07](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment45411_7986)

[Show **3** more comments](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)



## 20 Answers

Sorted by:

​                              Highest score (default)                                            Date modified (newest first)                                            Date created (oldest first)                    





60







Yes, you're right. As for *why* the harmonic series doesn't produce notes that work in all keys, the simple answer is that the math just doesn't add up.

Let's work out the math for just intonation: Suppose you choose *X* Hz for the fundamental frequency and go from there. Then the octave above the fundamental should have frequency *2X* Hz. Meanwhile, the perfect fifth above *X* will have frequency 3⁄2 *X* Hz. The perfect fifth above that will have frequency 3⁄2 * 3⁄2 *X* = 9⁄4 *X* Hz. Continuing on the cycle of fifths, you can easily see that every pitch generated this way will have frequency (3⁄2)n *X* Hz for some exponent *n*.

If there are twelve tones in the chromatic scale, then (3⁄2)12 *X* should be some whole number of octaves above *X*, i.e. (3⁄2)12 must equal a power of two. But this is impossible because no power of 2 can have 3 in its prime factorization, as all powers of 3⁄2 must have. Indeed, if you don't insist that the chromatic scale have twelve tones, you *still* can't make the math work: (3⁄2)n != 2m for any positive integer values of *n* and *m*.

Is it close, though? Not close enough. (3⁄2)12 = 129.74, and the closest power of 2 is 27 = 128. In practical terms, this means that the A one octave above A440 is 440 * 129.74 / 64 = 892 Hz, which is definitely audibly distinct from the pure 880 Hz you'd expect. The math just doesn't work—just intonation cannot produce a set of pitches that work well in all keys.



[Share](https://music.stackexchange.com/a/7988)

[Improve this answer](https://music.stackexchange.com/posts/7988/edit)

Follow

[edited Jan 10, 2018 at 11:19](https://music.stackexchange.com/posts/7988/revisions)

answered Dec 10, 2012 at 14:03

![Alex Basson's user avatar](https://www.gravatar.com/avatar/3c9b0087c41fd6b4906d1df7c907f9eb?s=64&d=identicon&r=PG)

[Alex Basson](https://music.stackexchange.com/users/36/alex-basson)

**20.9k**22 gold badges6363 silver badges101101 bronze badges

- 1

  thanks. It can't, if you start from one fundamental frequency. But if you start from multiple fundamental frequencies, and end up with hundreds of keys, it will potentially be in tune for e very key. Provided there's someone able to play it :) Right? 

  – [Bozho](https://music.stackexchange.com/users/3355/bozho)

   [CommentedDec 10, 2012 at 14:44 ](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment11143_7988)

- 20

  @Bozho Well, in a sense, this is exactly what string players and vocalists do. Since a violin has no frets, the player can adjust her intonation as needed for each note, taking the context of the harmony into consideration. When a violinist plays an F# in the key of G, she'll play it slightly shaper than if the key is, say, A. But for fixed-pitched instruments like keyboards, this quickly becomes impractical. 

  – [Alex Basson](https://music.stackexchange.com/users/36/alex-basson)

   [CommentedDec 10, 2012 at 14:47 ](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment11144_7988)

- 6

  All wind instruments have the ability to fine-tune individual notes through a combination of techniques, in fact. Orchestral players are always on the lookout for 5th and 3rd chord members to raise or lower, respectively, to their justly-tuned equivalents, even if they're not explicitly marked "-14c". 

  – [NReilingh](https://music.stackexchange.com/users/133/nreilingh)

   [CommentedDec 10, 2012 at 17:36](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment11145_7988)

- 6

  Actually, the real problem behind tempering is not how poorly just perfect fifths (via the third harmonic) line up with octaves (via the second harmonic), but how poorly just major thirds (via the fifth harmonic) lines up with octaves. To see this, note that the equal-tempered fifth is only a few cents short of just while the equal-tempered major third is about 14 cents greater than just. The essence of the reasoning is the same, though. 

  – [oliTUTilo](https://music.stackexchange.com/users/3552/olitutilo)

   [CommentedJan 12, 2014 at 4:38 ](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment19358_7988)

- 1

  This answer is not quite correct. It does not address the question's incorrect premise. In fact, it is not necessary to consider more than one key to show why it's necessary to temper a keyboard. The correct answer is "just intonation cannot produce a set of pitches that work well in any key." 

  – [phoog](https://music.stackexchange.com/users/2257/phoog)

   [CommentedJan 15, 2016 at 14:24 ](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment59682_7988)

[Show **3** more comments](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)





37



I want to make an addition to all these excellent answers.

With just intonation, it's not possible to make all the chords just. **Not even in a single key.**

Let's look at the common just major scale based on I, IV and V just major triads:

C 1:1 D 9:8 E 5:4 F 4:3 G 3:2 A 5:3 B 15:8

In this scale, I, IV, V major triads (4:5:6) and iii and vi minor triads (10:12:15) are just.

But ii minor triad is out of tune: D-F interval is 32:27 instead of 5:6. This is ~294 cents vs 316, which is worse than the equal tempered 300.

Worse yet, D-A interval is 40:27 instead of 3:2; 680 cents vs 702, again way worse than the equal tempered 700.

One way to fix it is to flatten D down to 10:9 but this will break the V major triad. There's simply no way of making them all just without adding more notes. **Not even in a single key.**



[Share](https://music.stackexchange.com/a/22017)

[Improve this answer](https://music.stackexchange.com/posts/22017/edit)

Follow

[edited Jul 14, 2014 at 7:27](https://music.stackexchange.com/posts/22017/revisions)

answered Jul 13, 2014 at 19:16

![cyco130's user avatar](https://www.gravatar.com/avatar/7253240f2df423e34abc0d289ab1a0ee?s=64&d=identicon&r=PG)

[cyco130](https://music.stackexchange.com/users/10708/cyco130)

**5,184**2424 silver badges3030 bronze badges

- 1

  In Pythagorean tuning, you can fix the "wolf" intervals by having separate keys (or frets or holes or whatever) for enharmonic notes. So, for example, the P5 is in 3:2 ratio, but the enharmonic d6 is 262144:177147. But this *doesn't* work in 5-limit JI because "the same" interval needs to have a different frequency ratio depending on context: If the M3 should be in 5:4 ratio, then M2 needs to be 9:8 half the time and 10:9 the other half. 

  – [dan04](https://music.stackexchange.com/users/542/dan04)

   [CommentedJul 15, 2014 at 10:13](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment30404_22017)

- 8

  I was scrolling down to add an answer making this point when I saw this answer and upvoted it instead. It deserves more upvotes, pointing out as it does the incorrect premise that "if an instrument is tuned with the frequencies obtained in the above manner, the instrument ... sounds good in one key." In fact, the instrument sounds good only in certain *chords,* which don't even give you all the chords you need for one key. For example, if you take A as a fifth above D, and F as a fifth below C, then your F-major chord will have a very high (and definitely not just) third. 

  – [phoog](https://music.stackexchange.com/users/2257/phoog)

   [CommentedOct 1, 2015 at 15:38](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment54735_22017)

- Great answer. If you are in the just intonation key of C, you can derive the note A in 2 ways: 4 fifths above C, or a fourth and a fifth above C. And they're out of tune with each other: you'll either have an in tune F major chord or an in tune D minor chord but never both! 

  – [Some_Guy](https://music.stackexchange.com/users/21139/some-guy)

   [CommentedOct 4, 2017 at 20:31](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment95821_22017)

- Ok, but surely if a composer is choosing a just intonation scale for a piece of music they would design it so that all the chords they wish to use sounded good; @phoog in your example why not just add another interval to your scale so that you can have a pure and just F-major chord? Surely thats part of the point of using such scales, breaking free of the limitations of 12 tones. 

  – [Adamski](https://music.stackexchange.com/users/19617/adamski)

   [CommentedFeb 11, 2018 at 5:12](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment103898_22017)

- 1

  @Some_Guy four fifths above X is E, and a fourth and a fifth above C is ... C. The note A is either a fourth and a third above C, or three fifths. With this in mind, your comment is otherwise correct. 

  – [phoog](https://music.stackexchange.com/users/2257/phoog)

   [CommentedMar 18, 2019 at 1:31](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment134848_22017)

[Show **2** more comments](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)





32



Alex Basson has given you a great introduction to the mathematics. Let me approach the answer from a different perspective, that of the performing musician in a historical context.

Setting the mathematics aside, to put it simply, just intonation is what happens when you have a group of singers performing *a capella*, or a string quartet, or any other ensemble of monophonic instruments that can inflect or bend their pitch. But as soon as you insert a conventional piano or guitar (which are tuned to 12-tone equal temperament) into the ensemble, all the other instruments and performers will shift from just intonation into equal temperament so as not to clash with the guitar or piano. Singers and string players don't consciously think about it; it just happens.

There are also instruments in existence that play *only* in pure just intonation. These are instruments that can only play one scale in one key, and no extra notes outside of that. They include the natural trumpet or bugle (which have no keys, no valves, and no vent holes), or certain designs of the recorder, or the bagpipes.

Just intonation is extremely impractical for instruments that play chords (guitar or piano), or any instrument with fixed pitches which cannot bend, such as vibraphone or marimba.

**How many keys do you want in an octave on your keyboard?** In the Baroque period, 12-tone equal temperament had not yet been invented. Although the early harpsichords and organs had 12 notes to the octave, they used various tuning schemes that were based on just intonation. Each instrument could only be played successfully in a few keys with the tuning scheme in use.

To expand on that, innovative designers in the 1500s and 1600s built a few organs and harpsichords with between 14 and 36 different pitches/keys within one octave to be able to play in something closer to just intonation in many keys.

To say that learning to play a keyboard with that many keys in an octave was an added difficulty to the keyboardist is an understatement. It also meant that harpsichords and organs had to have extra strings and extra pipes to play the extra pitches, adding significantly to the cost and the mechanical difficulties of building and maintaining the instrument.

![enter image description here](https://i.sstatic.net/jx8Jy.jpg)

![enter image description here](https://i.sstatic.net/NxX6I.jpg)

This problem was largely resolved when the "Well-Tempered" tuning was invented and subsequently championed by J. S. Bach. Later on, true 12-tone equal temperament was developed. Around this time, most keyboard musicians lost interest in keyboards with extra keys/pitches for approximating just intervals in various keys.

## In the modern era

there have been several designs for a just-intuned keyboard for electronic musical instruments, with many more than 12 keys/notes in an octave.

I know of one electric guitarist, [Jon Catler](http://www.freenotemusic.com/site/index.html), who plays guitars built with extra frets to make 31 equal-tempered notes in an octave. His purpose is to play conventional tonal music that enable a skilled performer to get close to just-intoned intervals in many keys; he's not composing and playing exotic non-Western scales or music. Lately he's been recording on a new guitar he designed with 64 notes in an octave that he says achieves just intonation in all keys.

Below are pictures of two guitar designs which he sells, and below that is a video demonstration, playing a guitar of yet a third design.

![enter image description here](https://i.sstatic.net/lHBCV.jpg)

![enter image description here](https://i.sstatic.net/TjMN4.jpg)



<iframe width="640px" height="395px" src="https://www.youtube.com/embed/8AYlsLNTjrc?start=0" style="margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-family: inherit; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; font-size: 15px; vertical-align: baseline; box-sizing: inherit; --theme-base-primary-color-h: 244.44444444; --theme-base-primary-color-s: 62.79069767%; --theme-base-primary-color-l: 16.8627451%; --theme-primary-custom-100: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + ((100% - var(--theme-base-primary-color-l)) * .9))); --theme-primary-custom-200: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + ((100% - var(--theme-base-primary-color-l)) * .75))); --theme-primary-custom-300: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + ((100% - var(--theme-base-primary-color-l)) * .5))); --theme-primary-custom-400: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), var(--theme-base-primary-color-l)); --theme-primary-custom-500: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + (var(--theme-base-primary-color-l) * -.3))); --theme-primary-custom-600: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + (var(--theme-base-primary-color-l) * -.6))); --theme-primary-custom: var(--theme-primary-custom-400); --theme-button-color: var(--theme-primary); --theme-button-hover-color: var(--theme-primary-400); --theme-button-hover-background-color: var(--theme-primary-100); --theme-button-active-background-color: var(--theme-primary-200); --theme-button-selected-color: var(--theme-primary-600); --theme-button-selected-background-color: var(--theme-primary-300); --theme-button-outlined-border-color: var(--theme-primary-400); --theme-button-outlined-selected-border-color: var(--theme-primary-500); --theme-button-primary-color: var(--white); --theme-button-primary-active-color: var(--white); --theme-button-primary-hover-color: var(--white); --theme-button-primary-selected-color: var(--white); --theme-button-primary-background-color: var(--theme-primary-400); --theme-button-primary-active-background-color: var(--theme-primary-600); --theme-button-primary-hover-background-color: var(--theme-primary-500); --theme-button-primary-selected-background-color: var(--theme-primary-600); --theme-background-color: #eeede7; --theme-background-position: top left; --theme-background-repeat: repeat; --theme-background-size: auto; --theme-background-attachment: auto; --theme-content-background-color: var(--white); --theme-content-border-color: var(--black-225); --theme-header-background-color: #ffd972; --theme-header-background-position: center left; --theme-header-background-repeat: repeat; --theme-header-background-size: auto; --theme-header-background-border-bottom: 0; --theme-header-link-color: var(--theme-primary); --theme-header-sponsored-color: hsla(0,0%,100%,0.4); --theme-header-foreground-color: transparent; --theme-header-foreground-position: center right; --theme-header-foreground-repeat: no-repeat; --theme-header-foreground-size: 475px 70px; --theme-footer-background-color: transparent; --theme-footer-background-position: top left; --theme-footer-background-repeat: no-repeat; --theme-footer-background-size: auto; --theme-footer-background-border-top: 0; --theme-footer-title-color: var(--theme-link-color); --theme-footer-text-color: var(--black-400); --theme-footer-link-color: var(--black-500); --theme-footer-link-color-hover: var(--black-600); --theme-footer-divider-color: var(--black-225); --theme-footer-padding-top: 0; --theme-footer-padding-bottom: 0; --theme-link-color: #4E67E3; --theme-link-color-hover: #7a8dea; --theme-link-color-visited: #1c34af; --theme-body-font-family: var(--ff-sans); --theme-body-font-color: var(--black-600); --theme-post-title-font-family: var(--ff-sans); --theme-post-title-color: var(--theme-link-color); --theme-post-title-color-hover: var(--theme-link-color-hover); --theme-post-title-color-visited: var(--theme-link-color-visited); --theme-post-body-font-family: var(--ff-sans); --theme-post-owner-background-color: var(--theme-primary-100); --theme-post-owner-new-background-color: var(--theme-primary-200); --theme-topbar-bottom-border: none; --darkreader-bg--theme-base-primary-color-h: 244.44444444; --darkreader-text--theme-base-primary-color-h: 244.44444444; --darkreader-border--theme-base-primary-color-h: 244.44444444; --darkreader-bg--theme-base-primary-color-s: 62.79069767%; --darkreader-text--theme-base-primary-color-s: 62.79069767%; --darkreader-border--theme-base-primary-color-s: 62.79069767%; --darkreader-bg--theme-base-primary-color-l: 16.8627451%; --darkreader-text--theme-base-primary-color-l: 16.8627451%; --darkreader-border--theme-base-primary-color-l: 16.8627451%; --darkreader-bg--theme-primary-custom-100: #NaNNaNNaN; --darkreader-text--theme-primary-custom-100: #NaNNaNNaN; --darkreader-border--theme-primary-custom-100: #NaNNaNNaN; --darkreader-bg--theme-primary-custom-200: #NaNNaNNaN; --darkreader-text--theme-primary-custom-200: #NaNNaNNaN; --darkreader-border--theme-primary-custom-200: #NaNNaNNaN; --darkreader-bg--theme-primary-custom-300: #NaNNaNNaN; --darkreader-text--theme-primary-custom-300: #NaNNaNNaN; --darkreader-border--theme-primary-custom-300: #NaNNaNNaN; --darkreader-bg--theme-primary-custom-400: #100d38; --darkreader-text--theme-primary-custom-400: #cdc8c2; --darkreader-border--theme-primary-custom-400: #7e7567; --darkreader-bg--theme-primary-custom-500: #NaNNaNNaN; --darkreader-text--theme-primary-custom-500: #NaNNaNNaN; --darkreader-border--theme-primary-custom-500: #NaNNaNNaN; --darkreader-bg--theme-primary-custom-600: #NaNNaNNaN; --darkreader-text--theme-primary-custom-600: #NaNNaNNaN; --darkreader-border--theme-primary-custom-600: #NaNNaNNaN; --darkreader-bg--theme-primary-custom: var(--darkreader-bg--theme-primary-custom-400); --darkreader-text--theme-primary-custom: var(--darkreader-text--theme-primary-custom-400); --darkreader-border--theme-primary-custom: var(--darkreader-border--theme-primary-custom-400); --darkreader-text--theme-button-color: var(--darkreader-text--theme-primary); --darkreader-text--theme-button-hover-color: var(--darkreader-text--theme-primary-400); --darkreader-bg--theme-button-hover-background-color: var(--darkreader-bg--theme-primary-100); --darkreader-bg--theme-button-active-background-color: var(--darkreader-bg--theme-primary-200); --darkreader-text--theme-button-selected-color: var(--darkreader-text--theme-primary-600); --darkreader-bg--theme-button-selected-background-color: var(--darkreader-bg--theme-primary-300); --darkreader-border--theme-button-outlined-border-color: var(--darkreader-border--theme-primary-400); --darkreader-border--theme-button-outlined-selected-border-color: var(--darkreader-border--theme-primary-500); --darkreader-text--theme-button-primary-color: var(--darkreader-text--white); --darkreader-text--theme-button-primary-hover-color: var(--darkreader-text--white); --darkreader-text--theme-button-primary-selected-color: var(--darkreader-text--white); --darkreader-bg--theme-button-primary-background-color: var(--darkreader-bg--theme-primary-400); --darkreader-bg--theme-button-primary-active-background-color: var(--darkreader-bg--theme-primary-600); --darkreader-bg--theme-button-primary-hover-background-color: var(--darkreader-bg--theme-primary-500); --darkreader-bg--theme-button-primary-selected-background-color: var(--darkreader-bg--theme-primary-600); --darkreader-text--theme-button-primary-selected-background-color: var(--darkreader-text--theme-primary-600); --darkreader-bg--theme-background-color: #212018; --darkreader-bg--theme-content-background-color: var(--darkreader-bg--white); --darkreader-border--theme-content-border-color: var(--darkreader-border--black-225); --darkreader-bg--theme-header-background-color: #664a00; --darkreader-border--theme-header-background-border-bottom: 0; --darkreader-text--theme-header-link-color: var(--darkreader-text--theme-primary); --darkreader-text--theme-header-sponsored-color: rgba(232, 230, 227, 0.4); --darkreader-bg--theme-header-foreground-color: rgba(0, 0, 0, 0); --darkreader-bg--theme-footer-background-color: rgba(0, 0, 0, 0); --darkreader-border--theme-footer-background-border-top: 0; --darkreader-text--theme-footer-title-color: var(--darkreader-text--theme-link-color); --darkreader-text--theme-footer-text-color: var(--darkreader-text--black-400); --darkreader-text--theme-footer-link-color: var(--darkreader-text--black-500); --darkreader-text--theme-footer-link-color-hover: var(--darkreader-text--black-600); --darkreader-border--theme-footer-divider-color: var(--darkreader-border--black-225); --darkreader-bg--theme-link-color: #182d96; --darkreader-text--theme-link-color: #5794e4; --darkreader-border--theme-link-color: #162a8d; --darkreader-text--theme-link-color-hover: #76a7e9; --darkreader-text--theme-link-color-visited: #6a9fe7; --darkreader-text--theme-body-font-color: var(--darkreader-text--black-600); --darkreader-text--theme-post-title-color: var(--darkreader-text--theme-link-color); --darkreader-text--theme-post-title-color-hover: var(--darkreader-text--theme-link-color-hover); --darkreader-text--theme-post-title-color-visited: var(--darkreader-text--theme-link-color-visited); --darkreader-bg--theme-post-owner-background-color: var(--darkreader-bg--theme-primary-100); --darkreader-text--theme-post-owner-background-color: var(--darkreader-text--theme-primary-100); --darkreader-bg--theme-post-owner-new-background-color: var(--darkreader-bg--theme-primary-200); --darkreader-border--theme-topbar-bottom-border: none; height: 360px; width: 640px; color-scheme: dark !important;"></iframe>



Not many guitarists would want to learn to play one of those instruments. Take a close look at those frets on those fingerboards and you will see why just intonation on a guitar is impractical for anybody but a select few avant-garde musicians who want to go to the tremendous trouble to develop a very complicated playing technique in the name of creating more pure intervals.



[Share](https://music.stackexchange.com/a/7991)

[Improve this answer](https://music.stackexchange.com/posts/7991/edit)

Follow

[edited Jun 16, 2015 at 15:29](https://music.stackexchange.com/posts/7991/revisions)

answered Dec 10, 2012 at 17:49

user1044

- A comment re recorder - the pitch is somewhat dependent on breath pressure. More pressure sharpens the note; less flattens. Soft-wood recorders (e.g. pear, maple) are more prone to changing pitch than hardwood instruments (e.g. ebony). In our consort we use breath pressure extensively to tune chords to just tuning. 

  – [kiwiron](https://music.stackexchange.com/users/10991/kiwiron)

   [CommentedJul 13, 2014 at 4:17 ](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment30281_7991)

- 5

  Just one comment from a percussionist: vibraphone pitches actually can be bent. The general technique for it is to strike as usual and then press in on the bar with a rubber mallet, starting from a node (where the string passes through the bar) toward the center. This lowers the pitch, and as you would expect, dampens the sound and cuts off sustain sooner than usual since the vibration is being stopped by contact between the bar and mallet. I am unaware of a technique for bending upward. It is also possible on marimba but the effect is much less noticeable. 

  – [CSmith](https://music.stackexchange.com/users/23185/csmith)

   [CommentedAug 26, 2015 at 9:01](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment51791_7991)

[Add a comment](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)





17



I have come across an even more astonishing system for producing pure intervals on a guitar. A Turkish guitarist, [Tolgahan Çoğulu](http://www.tolgahancogulu.com/en/?page_id=4), has patented a system for building a guitar that has channels under each string position that allows the quick installation or removal of any number of tiny partial frets, each one string-space wide, which can be adjusted up or down to any arbitrary microtonal position by hammering on them with a small "spudger" tool.

The performer would be able to recalibrate all the fret positions and intervals of the entire fingerboard any time the performer wishes to play in a different tuning system.

Apparently it was developed for the Turkish style of music called **maqam**, which uses quarter-tone intervals not found in Western music. But the luthier also demonstrates its use in Western music that uses equal temperament or meantone tuning systems, and mentions that it would be useful for playing Western Renaissance or Baroque pieces.

![enter image description here](https://i.sstatic.net/QaL2y.jpg)

In these two videos, he provides a technical description, narrated in English, and demonstrates the use of his instrument in playing excerpts from several different traditional compositions from different historical periods in Turkish and Western music.



<iframe width="640px" height="395px" src="https://www.youtube.com/embed/MYK_PF9WTRE?start=0" style="margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-family: inherit; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; font-size: 15px; vertical-align: baseline; box-sizing: inherit; --theme-base-primary-color-h: 244.44444444; --theme-base-primary-color-s: 62.79069767%; --theme-base-primary-color-l: 16.8627451%; --theme-primary-custom-100: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + ((100% - var(--theme-base-primary-color-l)) * .9))); --theme-primary-custom-200: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + ((100% - var(--theme-base-primary-color-l)) * .75))); --theme-primary-custom-300: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + ((100% - var(--theme-base-primary-color-l)) * .5))); --theme-primary-custom-400: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), var(--theme-base-primary-color-l)); --theme-primary-custom-500: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + (var(--theme-base-primary-color-l) * -.3))); --theme-primary-custom-600: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + (var(--theme-base-primary-color-l) * -.6))); --theme-primary-custom: var(--theme-primary-custom-400); --theme-button-color: var(--theme-primary); --theme-button-hover-color: var(--theme-primary-400); --theme-button-hover-background-color: var(--theme-primary-100); --theme-button-active-background-color: var(--theme-primary-200); --theme-button-selected-color: var(--theme-primary-600); --theme-button-selected-background-color: var(--theme-primary-300); --theme-button-outlined-border-color: var(--theme-primary-400); --theme-button-outlined-selected-border-color: var(--theme-primary-500); --theme-button-primary-color: var(--white); --theme-button-primary-active-color: var(--white); --theme-button-primary-hover-color: var(--white); --theme-button-primary-selected-color: var(--white); --theme-button-primary-background-color: var(--theme-primary-400); --theme-button-primary-active-background-color: var(--theme-primary-600); --theme-button-primary-hover-background-color: var(--theme-primary-500); --theme-button-primary-selected-background-color: var(--theme-primary-600); --theme-background-color: #eeede7; --theme-background-position: top left; --theme-background-repeat: repeat; --theme-background-size: auto; --theme-background-attachment: auto; --theme-content-background-color: var(--white); --theme-content-border-color: var(--black-225); --theme-header-background-color: #ffd972; --theme-header-background-position: center left; --theme-header-background-repeat: repeat; --theme-header-background-size: auto; --theme-header-background-border-bottom: 0; --theme-header-link-color: var(--theme-primary); --theme-header-sponsored-color: hsla(0,0%,100%,0.4); --theme-header-foreground-color: transparent; --theme-header-foreground-position: center right; --theme-header-foreground-repeat: no-repeat; --theme-header-foreground-size: 475px 70px; --theme-footer-background-color: transparent; --theme-footer-background-position: top left; --theme-footer-background-repeat: no-repeat; --theme-footer-background-size: auto; --theme-footer-background-border-top: 0; --theme-footer-title-color: var(--theme-link-color); --theme-footer-text-color: var(--black-400); --theme-footer-link-color: var(--black-500); --theme-footer-link-color-hover: var(--black-600); --theme-footer-divider-color: var(--black-225); --theme-footer-padding-top: 0; --theme-footer-padding-bottom: 0; --theme-link-color: #4E67E3; --theme-link-color-hover: #7a8dea; --theme-link-color-visited: #1c34af; --theme-body-font-family: var(--ff-sans); --theme-body-font-color: var(--black-600); --theme-post-title-font-family: var(--ff-sans); --theme-post-title-color: var(--theme-link-color); --theme-post-title-color-hover: var(--theme-link-color-hover); --theme-post-title-color-visited: var(--theme-link-color-visited); --theme-post-body-font-family: var(--ff-sans); --theme-post-owner-background-color: var(--theme-primary-100); --theme-post-owner-new-background-color: var(--theme-primary-200); --theme-topbar-bottom-border: none; --darkreader-bg--theme-base-primary-color-h: 244.44444444; --darkreader-text--theme-base-primary-color-h: 244.44444444; --darkreader-border--theme-base-primary-color-h: 244.44444444; --darkreader-bg--theme-base-primary-color-s: 62.79069767%; --darkreader-text--theme-base-primary-color-s: 62.79069767%; --darkreader-border--theme-base-primary-color-s: 62.79069767%; --darkreader-bg--theme-base-primary-color-l: 16.8627451%; --darkreader-text--theme-base-primary-color-l: 16.8627451%; --darkreader-border--theme-base-primary-color-l: 16.8627451%; --darkreader-bg--theme-primary-custom-100: #NaNNaNNaN; --darkreader-text--theme-primary-custom-100: #NaNNaNNaN; --darkreader-border--theme-primary-custom-100: #NaNNaNNaN; --darkreader-bg--theme-primary-custom-200: #NaNNaNNaN; --darkreader-text--theme-primary-custom-200: #NaNNaNNaN; --darkreader-border--theme-primary-custom-200: #NaNNaNNaN; --darkreader-bg--theme-primary-custom-300: #NaNNaNNaN; --darkreader-text--theme-primary-custom-300: #NaNNaNNaN; --darkreader-border--theme-primary-custom-300: #NaNNaNNaN; --darkreader-bg--theme-primary-custom-400: #100d38; --darkreader-text--theme-primary-custom-400: #cdc8c2; --darkreader-border--theme-primary-custom-400: #7e7567; --darkreader-bg--theme-primary-custom-500: #NaNNaNNaN; --darkreader-text--theme-primary-custom-500: #NaNNaNNaN; --darkreader-border--theme-primary-custom-500: #NaNNaNNaN; --darkreader-bg--theme-primary-custom-600: #NaNNaNNaN; --darkreader-text--theme-primary-custom-600: #NaNNaNNaN; --darkreader-border--theme-primary-custom-600: #NaNNaNNaN; --darkreader-bg--theme-primary-custom: var(--darkreader-bg--theme-primary-custom-400); --darkreader-text--theme-primary-custom: var(--darkreader-text--theme-primary-custom-400); --darkreader-border--theme-primary-custom: var(--darkreader-border--theme-primary-custom-400); --darkreader-text--theme-button-color: var(--darkreader-text--theme-primary); --darkreader-text--theme-button-hover-color: var(--darkreader-text--theme-primary-400); --darkreader-bg--theme-button-hover-background-color: var(--darkreader-bg--theme-primary-100); --darkreader-bg--theme-button-active-background-color: var(--darkreader-bg--theme-primary-200); --darkreader-text--theme-button-selected-color: var(--darkreader-text--theme-primary-600); --darkreader-bg--theme-button-selected-background-color: var(--darkreader-bg--theme-primary-300); --darkreader-border--theme-button-outlined-border-color: var(--darkreader-border--theme-primary-400); --darkreader-border--theme-button-outlined-selected-border-color: var(--darkreader-border--theme-primary-500); --darkreader-text--theme-button-primary-color: var(--darkreader-text--white); --darkreader-text--theme-button-primary-hover-color: var(--darkreader-text--white); --darkreader-text--theme-button-primary-selected-color: var(--darkreader-text--white); --darkreader-bg--theme-button-primary-background-color: var(--darkreader-bg--theme-primary-400); --darkreader-bg--theme-button-primary-active-background-color: var(--darkreader-bg--theme-primary-600); --darkreader-bg--theme-button-primary-hover-background-color: var(--darkreader-bg--theme-primary-500); --darkreader-bg--theme-button-primary-selected-background-color: var(--darkreader-bg--theme-primary-600); --darkreader-text--theme-button-primary-selected-background-color: var(--darkreader-text--theme-primary-600); --darkreader-bg--theme-background-color: #212018; --darkreader-bg--theme-content-background-color: var(--darkreader-bg--white); --darkreader-border--theme-content-border-color: var(--darkreader-border--black-225); --darkreader-bg--theme-header-background-color: #664a00; --darkreader-border--theme-header-background-border-bottom: 0; --darkreader-text--theme-header-link-color: var(--darkreader-text--theme-primary); --darkreader-text--theme-header-sponsored-color: rgba(232, 230, 227, 0.4); --darkreader-bg--theme-header-foreground-color: rgba(0, 0, 0, 0); --darkreader-bg--theme-footer-background-color: rgba(0, 0, 0, 0); --darkreader-border--theme-footer-background-border-top: 0; --darkreader-text--theme-footer-title-color: var(--darkreader-text--theme-link-color); --darkreader-text--theme-footer-text-color: var(--darkreader-text--black-400); --darkreader-text--theme-footer-link-color: var(--darkreader-text--black-500); --darkreader-text--theme-footer-link-color-hover: var(--darkreader-text--black-600); --darkreader-border--theme-footer-divider-color: var(--darkreader-border--black-225); --darkreader-bg--theme-link-color: #182d96; --darkreader-text--theme-link-color: #5794e4; --darkreader-border--theme-link-color: #162a8d; --darkreader-text--theme-link-color-hover: #76a7e9; --darkreader-text--theme-link-color-visited: #6a9fe7; --darkreader-text--theme-body-font-color: var(--darkreader-text--black-600); --darkreader-text--theme-post-title-color: var(--darkreader-text--theme-link-color); --darkreader-text--theme-post-title-color-hover: var(--darkreader-text--theme-link-color-hover); --darkreader-text--theme-post-title-color-visited: var(--darkreader-text--theme-link-color-visited); --darkreader-bg--theme-post-owner-background-color: var(--darkreader-bg--theme-primary-100); --darkreader-text--theme-post-owner-background-color: var(--darkreader-text--theme-primary-100); --darkreader-bg--theme-post-owner-new-background-color: var(--darkreader-bg--theme-primary-200); --darkreader-border--theme-topbar-bottom-border: none; height: 360px; width: 640px; color-scheme: dark !important;"></iframe>





<iframe width="640px" height="395px" src="https://www.youtube.com/embed/yhdpsuXtewY?start=0" style="margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-family: inherit; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; font-size: 15px; vertical-align: baseline; box-sizing: inherit; --theme-base-primary-color-h: 244.44444444; --theme-base-primary-color-s: 62.79069767%; --theme-base-primary-color-l: 16.8627451%; --theme-primary-custom-100: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + ((100% - var(--theme-base-primary-color-l)) * .9))); --theme-primary-custom-200: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + ((100% - var(--theme-base-primary-color-l)) * .75))); --theme-primary-custom-300: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + ((100% - var(--theme-base-primary-color-l)) * .5))); --theme-primary-custom-400: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), var(--theme-base-primary-color-l)); --theme-primary-custom-500: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + (var(--theme-base-primary-color-l) * -.3))); --theme-primary-custom-600: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + (var(--theme-base-primary-color-l) * -.6))); --theme-primary-custom: var(--theme-primary-custom-400); --theme-button-color: var(--theme-primary); --theme-button-hover-color: var(--theme-primary-400); --theme-button-hover-background-color: var(--theme-primary-100); --theme-button-active-background-color: var(--theme-primary-200); --theme-button-selected-color: var(--theme-primary-600); --theme-button-selected-background-color: var(--theme-primary-300); --theme-button-outlined-border-color: var(--theme-primary-400); --theme-button-outlined-selected-border-color: var(--theme-primary-500); --theme-button-primary-color: var(--white); --theme-button-primary-active-color: var(--white); --theme-button-primary-hover-color: var(--white); --theme-button-primary-selected-color: var(--white); --theme-button-primary-background-color: var(--theme-primary-400); --theme-button-primary-active-background-color: var(--theme-primary-600); --theme-button-primary-hover-background-color: var(--theme-primary-500); --theme-button-primary-selected-background-color: var(--theme-primary-600); --theme-background-color: #eeede7; --theme-background-position: top left; --theme-background-repeat: repeat; --theme-background-size: auto; --theme-background-attachment: auto; --theme-content-background-color: var(--white); --theme-content-border-color: var(--black-225); --theme-header-background-color: #ffd972; --theme-header-background-position: center left; --theme-header-background-repeat: repeat; --theme-header-background-size: auto; --theme-header-background-border-bottom: 0; --theme-header-link-color: var(--theme-primary); --theme-header-sponsored-color: hsla(0,0%,100%,0.4); --theme-header-foreground-color: transparent; --theme-header-foreground-position: center right; --theme-header-foreground-repeat: no-repeat; --theme-header-foreground-size: 475px 70px; --theme-footer-background-color: transparent; --theme-footer-background-position: top left; --theme-footer-background-repeat: no-repeat; --theme-footer-background-size: auto; --theme-footer-background-border-top: 0; --theme-footer-title-color: var(--theme-link-color); --theme-footer-text-color: var(--black-400); --theme-footer-link-color: var(--black-500); --theme-footer-link-color-hover: var(--black-600); --theme-footer-divider-color: var(--black-225); --theme-footer-padding-top: 0; --theme-footer-padding-bottom: 0; --theme-link-color: #4E67E3; --theme-link-color-hover: #7a8dea; --theme-link-color-visited: #1c34af; --theme-body-font-family: var(--ff-sans); --theme-body-font-color: var(--black-600); --theme-post-title-font-family: var(--ff-sans); --theme-post-title-color: var(--theme-link-color); --theme-post-title-color-hover: var(--theme-link-color-hover); --theme-post-title-color-visited: var(--theme-link-color-visited); --theme-post-body-font-family: var(--ff-sans); --theme-post-owner-background-color: var(--theme-primary-100); --theme-post-owner-new-background-color: var(--theme-primary-200); --theme-topbar-bottom-border: none; --darkreader-bg--theme-base-primary-color-h: 244.44444444; --darkreader-text--theme-base-primary-color-h: 244.44444444; --darkreader-border--theme-base-primary-color-h: 244.44444444; --darkreader-bg--theme-base-primary-color-s: 62.79069767%; --darkreader-text--theme-base-primary-color-s: 62.79069767%; --darkreader-border--theme-base-primary-color-s: 62.79069767%; --darkreader-bg--theme-base-primary-color-l: 16.8627451%; --darkreader-text--theme-base-primary-color-l: 16.8627451%; --darkreader-border--theme-base-primary-color-l: 16.8627451%; --darkreader-bg--theme-primary-custom-100: #NaNNaNNaN; --darkreader-text--theme-primary-custom-100: #NaNNaNNaN; --darkreader-border--theme-primary-custom-100: #NaNNaNNaN; --darkreader-bg--theme-primary-custom-200: #NaNNaNNaN; --darkreader-text--theme-primary-custom-200: #NaNNaNNaN; --darkreader-border--theme-primary-custom-200: #NaNNaNNaN; --darkreader-bg--theme-primary-custom-300: #NaNNaNNaN; --darkreader-text--theme-primary-custom-300: #NaNNaNNaN; --darkreader-border--theme-primary-custom-300: #NaNNaNNaN; --darkreader-bg--theme-primary-custom-400: #100d38; --darkreader-text--theme-primary-custom-400: #cdc8c2; --darkreader-border--theme-primary-custom-400: #7e7567; --darkreader-bg--theme-primary-custom-500: #NaNNaNNaN; --darkreader-text--theme-primary-custom-500: #NaNNaNNaN; --darkreader-border--theme-primary-custom-500: #NaNNaNNaN; --darkreader-bg--theme-primary-custom-600: #NaNNaNNaN; --darkreader-text--theme-primary-custom-600: #NaNNaNNaN; --darkreader-border--theme-primary-custom-600: #NaNNaNNaN; --darkreader-bg--theme-primary-custom: var(--darkreader-bg--theme-primary-custom-400); --darkreader-text--theme-primary-custom: var(--darkreader-text--theme-primary-custom-400); --darkreader-border--theme-primary-custom: var(--darkreader-border--theme-primary-custom-400); --darkreader-text--theme-button-color: var(--darkreader-text--theme-primary); --darkreader-text--theme-button-hover-color: var(--darkreader-text--theme-primary-400); --darkreader-bg--theme-button-hover-background-color: var(--darkreader-bg--theme-primary-100); --darkreader-bg--theme-button-active-background-color: var(--darkreader-bg--theme-primary-200); --darkreader-text--theme-button-selected-color: var(--darkreader-text--theme-primary-600); --darkreader-bg--theme-button-selected-background-color: var(--darkreader-bg--theme-primary-300); --darkreader-border--theme-button-outlined-border-color: var(--darkreader-border--theme-primary-400); --darkreader-border--theme-button-outlined-selected-border-color: var(--darkreader-border--theme-primary-500); --darkreader-text--theme-button-primary-color: var(--darkreader-text--white); --darkreader-text--theme-button-primary-hover-color: var(--darkreader-text--white); --darkreader-text--theme-button-primary-selected-color: var(--darkreader-text--white); --darkreader-bg--theme-button-primary-background-color: var(--darkreader-bg--theme-primary-400); --darkreader-bg--theme-button-primary-active-background-color: var(--darkreader-bg--theme-primary-600); --darkreader-bg--theme-button-primary-hover-background-color: var(--darkreader-bg--theme-primary-500); --darkreader-bg--theme-button-primary-selected-background-color: var(--darkreader-bg--theme-primary-600); --darkreader-text--theme-button-primary-selected-background-color: var(--darkreader-text--theme-primary-600); --darkreader-bg--theme-background-color: #212018; --darkreader-bg--theme-content-background-color: var(--darkreader-bg--white); --darkreader-border--theme-content-border-color: var(--darkreader-border--black-225); --darkreader-bg--theme-header-background-color: #664a00; --darkreader-border--theme-header-background-border-bottom: 0; --darkreader-text--theme-header-link-color: var(--darkreader-text--theme-primary); --darkreader-text--theme-header-sponsored-color: rgba(232, 230, 227, 0.4); --darkreader-bg--theme-header-foreground-color: rgba(0, 0, 0, 0); --darkreader-bg--theme-footer-background-color: rgba(0, 0, 0, 0); --darkreader-border--theme-footer-background-border-top: 0; --darkreader-text--theme-footer-title-color: var(--darkreader-text--theme-link-color); --darkreader-text--theme-footer-text-color: var(--darkreader-text--black-400); --darkreader-text--theme-footer-link-color: var(--darkreader-text--black-500); --darkreader-text--theme-footer-link-color-hover: var(--darkreader-text--black-600); --darkreader-border--theme-footer-divider-color: var(--darkreader-border--black-225); --darkreader-bg--theme-link-color: #182d96; --darkreader-text--theme-link-color: #5794e4; --darkreader-border--theme-link-color: #162a8d; --darkreader-text--theme-link-color-hover: #76a7e9; --darkreader-text--theme-link-color-visited: #6a9fe7; --darkreader-text--theme-body-font-color: var(--darkreader-text--black-600); --darkreader-text--theme-post-title-color: var(--darkreader-text--theme-link-color); --darkreader-text--theme-post-title-color-hover: var(--darkreader-text--theme-link-color-hover); --darkreader-text--theme-post-title-color-visited: var(--darkreader-text--theme-link-color-visited); --darkreader-bg--theme-post-owner-background-color: var(--darkreader-bg--theme-primary-100); --darkreader-text--theme-post-owner-background-color: var(--darkreader-text--theme-primary-100); --darkreader-bg--theme-post-owner-new-background-color: var(--darkreader-bg--theme-primary-200); --darkreader-border--theme-topbar-bottom-border: none; height: 360px; width: 640px; color-scheme: dark !important;"></iframe>



His website indicates that he will build and sell many styles of guitars and other fretted instruments (not just classical guitar) by special order, but few details are provided.



[Share](https://music.stackexchange.com/a/11841)

[Improve this answer](https://music.stackexchange.com/posts/11841/edit)

Follow

[edited Sep 1, 2013 at 11:50](https://music.stackexchange.com/posts/11841/revisions)

answered Sep 1, 2013 at 11:35

user1044

- 4

  That's clever and completely awesome. On the viol we use tied-on frets, but they're not as effective as the big raised solid frets on a modern guitar, so this is a really neat solution to a problem most people don't even know exists. 

  – [Matthew Walton](https://music.stackexchange.com/users/1479/matthew-walton)

   [CommentedJul 15, 2014 at 12:33](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment30411_11841)

[Add a comment](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)





9



Just intonation *does* produce harmonic sounds; perhaps the most harmonic sounds possible. You are correct that for a Justly tuned system to work, then each of the tones that you use will need to be adjusted relative to the current tonic. Because of this, you are correct to think that there will need to be many different 'flavors' of each note, depending on the context. There has been enormous work done in this field many composers and scientists over many centuries. The source I choose to share here is the work done by the American composer Ben Johnston. [This](https://en.wikipedia.org/wiki/Ben_Johnston_(composer)#Staff_notation) is an example of the notation he used to distinguish between each specific note, and they are created by performing simple mathematical operations (basic arithmetic).

I will give a brief explanation of Johnston's system here, and relate it to your question. Johnston's motivation was to pretend as if Twelve-Tone equal temperament never became a popular trend: he pretended that composers had thought it important to explicitly describe intonation through their notation system. Of course, this is not what happened, so he had to create a system of his own. You could think of his system as a way to get from one note to another without having to explicitly define EVERY NOTE that one would need to use. This might seem confusing, so let me define something that should be familiar: the Major scale.

The major scale is a pattern of intervals that produces notes that can be combined melodically and harmonically to make music. There is a distinct pattern between each note in the scale that you may be familiar with. If our scale is in C major, and our notes are

```
c d e f g a b c
```

then the intervals between each note will follow the pattern of whole (W) and half (H) tones below.

```
c d e f g a b c
 ^ ^ ^ ^ ^ ^ ^  
 W W H W W W H  
```

This pattern holds if you are using a piano, where each whole tone is 'equal' to every other whole tone. BUT in just intonation, this assumption does not hold. In just intonation you define EXACTLY what the value of a whole tone is, as well as EVERY OTHER INTERVAL YOU USE!

If we were going to follow Johnston's model, then we would define the intervals using the simplest pieces possible. For musical intervals, that means ratios between whole integers with low values. The reasoning behind this is because that is how a Harmonic series *works*. From your question I know you are familiar with this concept, so I wont describe it much other than saying that if you want to make a scale with the most harmonic potential, then you will pick intervals from the lowest notes of the harmonic series (shown by order of appearance here):

```
The Octave: 2/1,
The Perfect Fifth: 3/2,
The Perfect Fourth: 4/3,
The Major Third: 5/4,
The Minor Third: 6/5
```

These five intervals are enough to make simple harmonic chords! We begin with the octave. Then we split that into two intervals: the Perfect Fifth, and the Perfect fourth. Next, we split the perfect fifth into two pieces: the Major third, and the Minor third (notice how the numerator of the previous ratio becomes the denominator for the next ratio, and the numbers are growing by a succession of 1). Now we just need to split the thirds into smaller intervals so that we can have melodies that can go up and down smoothly.

One of the simplest ways of doing that is to build Major chords that can be 'stacked' into each other. Why major chords? Because it's a fundamental chord within the harmonic series.

```
1/1 - 5/4 - 3/2
```

So if we use the major chord as a pattern, and copy it a few times, we can produce a set of the notes within the major scale. By doing this, we're making a very simple scale, and only using three prime numbers: 2, 3, and 5. (Johnston's system can accommodate prime numbers up to 31, and anyone could theoretically extend it to include as many primes as they wish).

If we use the first three intervals of the harmonic series for the parameters of copying the Major chord, we will get a good amount of pitches to make our scale. We start by shifting the pattern up to start on the pitch a perfect fifth (the ratio 3/2) above the tonic.

```
                1/1 - 5/4 - 3/2
                            3/2 - 15/8 - 9/8
```

Then we copy the pattern onto the pitch a perfect fifth *below* the tonic (equivalent to a perfect fourth *above* the tonic, but it is less cluttered to go below for now).

```
    2/3 - 5/6 - 1/1
                1/1 - 5/4 - 3/2
                            3/2 - 15/8 - 9/4
```

Now let's name the pitches to give some clarity. If 1/1 is C, then:

```
     f     a     c
    2/3 - 5/6 - 1/1
                 c     e     g
                1/1 - 5/4 - 3/2
                             g      b     d
                            3/2 - 15/8 - 9/4
```

or

```
 c     d     e     f     g     a      b     c
1/1 - 9/8 - 5/4 - 4/3 - 3/2 - 5/3 - 15/8 - 2/1
```

This is a major scale derived from C (notice how the ratios from the F chord are now transposed, meaning they are now 'above' C, and the D is transposed down an octave). To complete this explanation, we need to recall the first description of the intervals between and equally tempered scale, which was composed of two intervals: whole and half tones. The scale we just (pun) made is Justly Tuned, so we actually get two</> types of whole tones! The consecutive intervals of the Just Major Scale is:

```
    c  to  d  to  e  to   f to  g  to  a  to b  to  c 
1/1 -  9/8 - 10/9 - 16/15 - 9/8 - 10/9 - 9/8 - 16/15
```

Why is this important? Well it shows that Just intonation, as you noticed, introduces a lot of variety when it comes to intervals. This means you need to pay special attention to how each note relates to every other note. This is hard to do on paper, but composers like Ben Johnston and [Toby Twining](https://soundcloud.com/toby-twining-music) have been doing it for many years, and so they have much to teach those willing to listen.

In conclusion Bozho, it is not unpractical to compose music using Just Intonation. That being said, it is not easy. If more composers chose to take up the challenge, then we might develop more tools to make the job more efficient. For now, there is still much work to be done.

Cheers!



[Share](https://music.stackexchange.com/a/33787)

[Improve this answer](https://music.stackexchange.com/posts/33787/edit)

Follow

[edited May 10, 2019 at 20:49](https://music.stackexchange.com/posts/33787/revisions)

answered Jul 5, 2015 at 6:11

![Zengid's user avatar](https://lh5.googleusercontent.com/-Lnsd5jym9Kk/AAAAAAAAAAI/AAAAAAAAAFY/9xEkAs15NOU/photo.jpg?sz=64)

[Zengid](https://music.stackexchange.com/users/21279/zengid)

**91**11 silver badge33 bronze badges

- 1

  Note that your A, 5/3 above C, is also (5/3)/(9/8) = 40/27 above D rather than 3/2. This makes D chords sound particularly awful. The just fifth above D is 81/80 above that (this ratio is known as the *syntonic comma),* and it makes F-major chords sound pretty bad. This explains the need for temperament even in a seven-key-per-octave keyboard intended to play diatonic music in only one key. 

  – [phoog](https://music.stackexchange.com/users/2257/phoog)

   [CommentedFeb 11, 2018 at 5:36](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment103901_33787)

- 1

  @phoog Thank you for pointing that out. I was trying to imply this issue, but forgot to go into its implications in my answer. You're right that this issue *could* be solved by using a temperament, but it could also be solved by knowing when to lower D by the syntonic comma (or raise A). Temperament is a solution that assumes a lot, namely, that we are playing an instrument with a fixed set of pitches like a piano. Choirs and string quartets don't have these limitations, and neither do computers, so If our goal is to write music for these instruments, we can choose an intonation freely. 

  – [Zengid](https://music.stackexchange.com/users/21279/zengid)

   [CommentedFeb 23, 2018 at 20:31](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment104947_33787)

- 1

  +1 - From my perspective, this is an important answer. The question assumes JI is "impractical," but it depends on your goals. Modern Western ears are used to 12-TET and compromise temperaments. Many other possible scales exist, including JI scales that have a great variety of intervals. Yes, some intervals will sound "bad" particularly when used harmonically, but (1) harmony isn't everything in many types of music, and (2) the varieties of sounding "in-tune" vs. "out-of-tune" give an entire different dimension to music, as folks like Johnston and his teacher Harry Partch well understand. 

  – [Athanasius](https://music.stackexchange.com/users/63809/athanasius)

   [CommentedNov 30, 2019 at 13:31](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment158136_33787)

- 1

  "Temperament is a solution that assumes...that we are playing an instrument with a fixed set of pitches": note that my comment about the necessity of temperament is still in the context of a keyboard. In fact, temperament is a solution to the problem of playing an instrument with a fixed set of pitches, but most people don't realize this and try to use the concept when it's unnecessary, such as with voices and strings. But even with voices and strings you have comma pumps, which require some sort of compromise, the most practical of which are generally temperament or at least temperament-like. 

  – [phoog](https://music.stackexchange.com/users/2257/phoog)

   [CommentedDec 29, 2020 at 17:11](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment187852_33787)

- In saying that I'm thinking of Josquin's *Ave Maria,* where you either have to modify certain sustained notes or use tempered intervals if you want to end on the same pitch that you started on. 

  – [phoog](https://music.stackexchange.com/users/2257/phoog)

   [CommentedDec 29, 2020 at 17:14](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment187853_33787)

[Add a comment](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)





8



Using a keyed instrument with Just Intonation creates a bunch of puzzles that need to be solved. You are either faced with observing limits on navigating from place to place, or doing "comma pumps" (equating near by intervals, or bend/vibrato between them because they are close enough).

The problem isn't really Just Intonation though. It's caused by trying to play on an instrument that has a set of keys (and notating it as such), rather than being continuous. In other words, named keys may be a bad interface for Just Intonation.

On a fretless instrument, JI is not only practical, but the sensible way to navigate. Stopping a string to an existing note and playing a seventh harmonic there (ie: notePitchInHz * 7) is completely natural and can be described easily enough, but that note doesn't have an obvious 'name'.

Besides just labelling keys, Just Intonation might be the only viable way of doing relative pitch in a general way: Imagine that you had buttons on a monotonic instrument labeled like: /2, *2, /3, *3, /5, *5 ....

People already use pitch lattices which were derived in this way; like horizontal is *3, vertical is *2, etc.



[Share](https://music.stackexchange.com/a/14590)

[Improve this answer](https://music.stackexchange.com/posts/14590/edit)

Follow

answered Jan 8, 2014 at 0:17

![Rob's user avatar](https://www.gravatar.com/avatar/812e307892de3240c2b50a3e66295f84?s=64&d=identicon&r=PG)

[Rob](https://music.stackexchange.com/users/9008/rob)

**299**22 silver badges55 bronze badges

[Add a comment](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)





5



> For them to "work" in A-major, we need to pick A3 as the fundamental frequency and calculate and transpose the harmonics.

This is one of the bigger misperceptions about just intonation. A perfect fourth is not an overtone (it is an undertone), so if you want to play music in which the perfect fourth plays a significant role — which, let's face it, is pretty much anything in Western music — then you need to use a harmonic series starting down at the fourth.

That is, if you want to play in the key of A, your fundamental frequency should be D, not A. That will give you a nice, harmonic D chord.

I see a lot of comments here focusing on fifths not closing on octaves, but it's not obvious to me why that should matter. Most songs — especially in folk music — don't modulate all over the place. They stick to chords near the home key, and as long as those are in tune the rest don't really matter.

For example, if you're playing in C (using the harmonic series of F₀), you'll have perfect tuning for the intervals in the chords C⁷, F⁷, G, A, Am, Em, and Bm. The fifth of the Dm chord will be off by a syntonic comma (around 21.5¢). I don't know about you, but I can play a lot of songs using those chords.

I worked up a spreadsheet with the harmonic tunings I've been using if you'd like to give them a try: https://docs.google.com/spreadsheets/d/1qTgPaLqDd8J315zxJ1ub5pbDWnlDHkJ5CNVYa_5JrnA/edit#gid=0



[Share](https://music.stackexchange.com/a/75451)

[Improve this answer](https://music.stackexchange.com/posts/75451/edit)

Follow

answered Oct 16, 2018 at 2:52

![bcmills's user avatar](https://www.gravatar.com/avatar/4835a765a5fb1547008d916a5165a702?s=64&d=identicon&r=PG)

[bcmills](https://music.stackexchange.com/users/53493/bcmills)

**151**11 silver badge22 bronze badges

- "I see a lot of comments here focusing on fifths not closing on octaves": it obviously should matter if you're tuning a 12-tone keyboard instrument. There lies the difference between "intonation" in the phrase *just intonation* and "temperament" in the phrase *equal temperament* (or any other). Your list of seven chords, though, uses several pitches that are not readily found in the overtone series of F, namely B-flat, C# and F#. Also, in many contexts, the problem is not only harmonic intervals but melodic intervals, for example if you've got the common bass line C-A-D-G-C. 

  – [phoog](https://music.stackexchange.com/users/2257/phoog)

   [CommentedOct 16, 2018 at 14:58](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment121693_75451)

- B-flat (in the tuning I'm currently using) is harmonic 21 of F — the harmonic seventh of C. C# is harmonic 25 (a major third above A), and F# is harmonic 135 (a major third above D): all within four odd factors in a 7-limit tuning. 

  – [bcmills](https://music.stackexchange.com/users/53493/bcmills)

   [CommentedOct 18, 2018 at 5:27](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment121798_75451)

- "B-flat (in the tuning I'm currently using) is harmonic 21 of F — the harmonic seventh of C": this means that the ratio of the fifth in your B flat chord is 32/21 instead of 3/2. Okay, you might not need a B flat chord in C major, but then again you might. The D-to-A fifth is a more significant problem. There may be a lot of songs that don't require `ii` or `V/V`, but it is a prominent chord in many common progressions, certainly more common than `vii`. 

  – [phoog](https://music.stackexchange.com/users/2257/phoog)

   [CommentedJul 1, 2022 at 6:11](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment226003_75451)

[Add a comment](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)





4



Here is a table that I have [adapted from one in Wikipedia](http://en.wikipedia.org/wiki/12-tone_equal_temperament) that illustrates how just intonation differs from 12-tone equal temperament.

In modern instrument tuning, an octave is divided into 1200 cents. There are 100 cents in an equal-tempered half-step, and all half-steps are equal in their distance apart.

However, in just intonation, not all half-steps are the same size. This table explains the discrepancies, and shows you just how out-of-tune certain musical intervals are on the 12-tone equal tempered piano, organ, synthesizer or guitar.

![enter image description here](https://i.sstatic.net/eMCQP.png)

As you can see, in 12-tone equal temperament, all intervals except the octave are slightly out-of-tune. The intervals that are the most noticeably out-of-tune are the tritone, the minor third, the major sixth, the major third, and the minor sixth.

Also note that just-intoned intervals cannot be expressed as integer values of cents in the first place. The cent is a convenient mathematical measuring unit based on 12-tone equal temperament. So the unit of the cent really has nothing to do with pure frequency ratios.



[Share](https://music.stackexchange.com/a/8022)

[Improve this answer](https://music.stackexchange.com/posts/8022/edit)

Follow

[edited Dec 23, 2012 at 1:01](https://music.stackexchange.com/posts/8022/revisions)

answered Dec 12, 2012 at 15:33

user1044

- 1

  Here's a huge list of 700 pitches within an octave, ordered by frequency difference, with their respective names, when they exist (Just Intonation people seem to don't care much about names): [kylegann.com/Octave.html](http://www.kylegann.com/Octave.html) and here is the same table with the actual decimal representations, instead of just fractions: [a3c8e3f1dc0bac4f596b4c29df042f945b58fc7e.googledrive.com/host/…](https://a3c8e3f1dc0bac4f596b4c29df042f945b58fc7e.googledrive.com/host/0B6XDAfFbY5MpNGhiMmpLc2Ziams/elm/anatomy of an octave.html) 

  – [fiatjaf](https://music.stackexchange.com/users/13732/fiatjaf)

   [CommentedOct 5, 2014 at 19:01](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment33455_8022)

- 1

  How are you defining that tritone? Is it a diminished fourth or an augmented fifth? What is the just-intonation ratio for a tritone? 45/32? 25/18? 36/25? In other words, in just intonation, not all tritones are the same size, either. 

  – [phoog](https://music.stackexchange.com/users/2257/phoog)

   [CommentedApr 29, 2016 at 18:54 ](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment65591_8022)

[Add a comment](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)





4



A relatively new [company in Sweden, True Temperament](http://www.truetemperament.com/site/index.php), retrofits electric, acoustic and classical guitars with new necks or fingerboards with heavily modified fret positions that are designed to improve intonation.

If I understand their intent, their "Thidell" design is for playing with something closer to pure intervals, but chiefly in the most common guitar keys of E, A, and D. The further you get away from those keys, the less accurate the intonation gets.

![enter image description here](https://i.sstatic.net/uRD9M.jpg)

They also have several other designs for producing other kinds of intonation more suited to other purposes. For instance, they make an entirely different fret layout for playing in the keys more commonly found in jazz.

This looks like a compromise that might work. I have not seen, heard or tried any of their necks or instruments but there are demo videos and audio on the web site.

The most extreme example is this special-order option, a fingerboard that they claim enables playing pure just intonation in only one key (again, if I understand the intent correctly -- all this is very complicated.)

Notice that there are 14 frets to the octave, because apparently (I have not worked through the music theory) certain chords require a sharper or flatter major or minor third than can be provided by only 12 fret positions. So based on the chord, you could choose a G# or an Ab which have distinctly different microtonal pitches, for example, depending on which pitch would produce the correct, in-tune interval in that particular chord.

![enter image description here](https://i.sstatic.net/GnkoZ.jpg)



[Share](https://music.stackexchange.com/a/11826)

[Improve this answer](https://music.stackexchange.com/posts/11826/edit)

Follow

[edited Sep 1, 2013 at 12:21](https://music.stackexchange.com/posts/11826/revisions)

answered Aug 30, 2013 at 17:06

user1044

- 2

  Steve Vai likes these - I posted up something on these last year. I plan on getting one of my guitars retrofitted with a Thidel - just for fun 

  – [Doktor Mayhem](https://music.stackexchange.com/users/104/doktor-mayhem)**♦**

   [CommentedAug 30, 2013 at 18:50](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment15724_11826)

- 1

  I always thought of this as compensated tuning (unique to the instrument), and not just intonation. Is there an answer here that clarifies that? 

  – user6164

   [CommentedApr 7, 2016 at 13:06 ](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment64371_11826)

[Add a comment](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)





4



The foundations of existing music theory were build when scientific data about sound perception were absent and they were inclined to number mysticism which source was that consonant music intervals correspond division of string in ratios of small integers. Now the following facts are known: -the sound signal of basic existing music instruments may be considered as sum of fundamental frequency and harmonics which frequencies are multiples of fundamental frequency and which intensity decreases quickly in common case . -the ear may be considered as bank of strong overlapping band filters which diapasons roughly correspond one music tone and hence ratio 1.122 (or 1/1.122=0,891) -the sensation of dissonance arises when simultaneous existing frequencies are in the same diapason. By it strongest dissonance sensation arises if their distance is ca ½ of semitone that is ratio 1,029)

It is possible with help of these knowledges to come to following conclusions: - intervals with ratios of small integers are consonant as for them and their first (strongest) harmonics ratious don't belong to dissonant values. About their harmonics it is apparent that the less numbers in intervals' ratios the greater must be numbers of notes' harmonics for attainment ratio of their their frequencies as by tone interval or less. But the greater numbers of harmonic the less their intensities and weacker the sensation of corresponding dissonance. For example: for 5 and 7 harmonics if interval is 3/2- 3*5/(2*7)=15/14=1.07, for 3 and 5 harmonics if interval interval is7/4- 7*3/(4*5)=21/20=1.05 That is in second case more favorable for dissonances ratio is obtained for more strong harmonics (3and 5 instead 5 and 7). The question why just intonation is impractical is very convincing considered in the article „Renaisance „Just information“ Attainable Standard or Utopian Dream? ( http://www.medieval.org/emfaq/zarlino/article1.html )

Yuri Vilenkin



[Share](https://music.stackexchange.com/a/14655)

[Improve this answer](https://music.stackexchange.com/posts/14655/edit)

Follow

answered Jan 10, 2014 at 12:19

![Yuri Vilenkin's user avatar](https://www.gravatar.com/avatar/7fce8678cc29eda28d645f9dceb3c3a2?s=64&d=identicon&r=PG)

[Yuri Vilenkin](https://music.stackexchange.com/users/9059/yuri-vilenkin)

**41**11 bronze badge

[Add a comment](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)





3



Just intonation is only impractical if you insist on having a scale of more than six fixed steps, with all the intervals being 5-limit just. God and/or math doesn't work that way.

The most cogent way of putting it is this: no power of two is also a power of three, and no power of three is also a power of five.



[Share](https://music.stackexchange.com/a/43318)

[Improve this answer](https://music.stackexchange.com/posts/43318/edit)

Follow

answered Apr 6, 2016 at 15:06

![Scott Wallace's user avatar](https://lh3.googleusercontent.com/-m3otQlZiTKE/AAAAAAAAAAI/AAAAAAAAAD0/Ey_9XjoXrDg/photo.jpg?sz=64)

[Scott Wallace](https://music.stackexchange.com/users/26744/scott-wallace)

**6,560**1818 silver badges2525 bronze badges

[Add a comment](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)





3



I can strongly recommend reading Harry Partch's *Genesis of a Music*, in which he goes into depth on the history of tunings and the reasons for them. Out of this he derives his 43-tone-to-the-octave scale from an 11-limit just scale, and then talks about the instruments he had to build and adapt to play music in this scale, and the compositions he did using them, in detail.

The 43-tone scale is a compromise to produce a better compromise, but 43 keys in every octave is definitely not practical. You can find some of his music on YouTube, and I recommend listening to it, especially with the book in hand. I recently found a performance of *[Delusion of the Fury](https://www.youtube.com/playlist?list=PLQ3HOVb5ZQalcD1yjfBJnWewuFrJ3TZQ2)* which is very good and very interesting indeed.

And I almost forgot: Terry Riley's *[The Harp of New Albion](https://www.youtube.com/playlist?list=PLQ3HOVb5ZQalcD1yjfBJnWewuFrJ3TZQ2)* uses a piano tuned to a 5-limit chromatic scale. See http://www.ex-tempore.org/Volx1/hudson/hudson.htm for details.



[Share](https://music.stackexchange.com/a/36224)

[Improve this answer](https://music.stackexchange.com/posts/36224/edit)

Follow

[edited Jul 24, 2017 at 21:21](https://music.stackexchange.com/posts/36224/revisions)

answered Aug 26, 2015 at 20:03

![Joe McMahon's user avatar](https://www.gravatar.com/avatar/661c7cc5565e5bc21fb0fc22c0354fef?s=64&d=identicon&r=PG)

[Joe McMahon](https://music.stackexchange.com/users/598/joe-mcmahon)

**806**77 silver badges99 bronze badges

- I'll second the recommendation to read Partch. It should perhaps be pointed out that Partch's 43 tone scale is not 43 tone equal temperament, but consists of (if I remember correctly) 13-limit just intervals. 

  – [Scott Wallace](https://music.stackexchange.com/users/26744/scott-wallace)

   [CommentedJul 24, 2017 at 9:18](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment91548_36224)

- 1

  Thanks! I'll edit this answer to better reflect your comment. (I went and checked -- he stopped at the 11-limit but talked about 13 in his book.) 

  – [Joe McMahon](https://music.stackexchange.com/users/598/joe-mcmahon)

   [CommentedJul 24, 2017 at 21:20 ](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment91576_36224)

- I'm afraid I lost my copy of *Genesis of a Music*. I'd love to read it again. Partch was a funny guy but had some great ideas. 

  – [Scott Wallace](https://music.stackexchange.com/users/26744/scott-wallace)

   [CommentedJul 25, 2017 at 16:04](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment91630_36224)

- 1

  If you Google "Genesis of a Music PDF" you will get hits. 

  – [Joe McMahon](https://music.stackexchange.com/users/598/joe-mcmahon)

   [CommentedSep 28, 2017 at 0:22](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment95466_36224)

[Add a comment](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)





2



One of the best microtonal instruments may be the slide guitar. Listen to Duane Allman play slide guitar, or David Gilmour play lap steel, or countless others. Not only do they reach the tones between the notes, but I suspect that they are naturally gravitating to the *just tempered* notes as well. That purity is what makes skilled slide guitar players sound so sweet.

The key difference between slide and the aforementioned multi-fret guitars is that slide is an *adaptive* process that relies upon the player. And the player will naturally play what sounds "right".



[Share](https://music.stackexchange.com/a/43396)

[Improve this answer](https://music.stackexchange.com/posts/43396/edit)

Follow

answered Apr 9, 2016 at 10:44

![Kirk A's user avatar](https://i.sstatic.net/RBMth.jpg?s=64)

[Kirk A](https://music.stackexchange.com/users/6780/kirk-a)

**2,659**1515 silver badges2121 bronze badges

- 1

  Therefore, more generally speaking, all continuous tone instruments (cello, violin, fretless guitar, bass...) have no problem addressing just intonation as well as equal temperment (?). 

  – [user30360](https://music.stackexchange.com/users/30360/user30360)

   [CommentedApr 30, 2017 at 21:43](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment85951_43396)

[Add a comment](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)





2



If you only think about the fixed frequency instruments, just intonation is not good for the instrument construction, there is good examples for the guitar above. There will be technical difficulties with a piano and other instruments too.

But for continuous variation pitch instruments, the just intonation will have more natural sounding.

There is a good example of what happen in the sound waves in this youtube video.



<iframe width="640px" height="395px" src="https://www.youtube.com/embed/6NlI4No3s0M?start=0" style="margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-family: inherit; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; font-size: 15px; vertical-align: baseline; box-sizing: inherit; --theme-base-primary-color-h: 244.44444444; --theme-base-primary-color-s: 62.79069767%; --theme-base-primary-color-l: 16.8627451%; --theme-primary-custom-100: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + ((100% - var(--theme-base-primary-color-l)) * .9))); --theme-primary-custom-200: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + ((100% - var(--theme-base-primary-color-l)) * .75))); --theme-primary-custom-300: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + ((100% - var(--theme-base-primary-color-l)) * .5))); --theme-primary-custom-400: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), var(--theme-base-primary-color-l)); --theme-primary-custom-500: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + (var(--theme-base-primary-color-l) * -.3))); --theme-primary-custom-600: hsl(var(--theme-base-primary-color-h), var(--theme-base-primary-color-s), calc(var(--theme-base-primary-color-l) + (var(--theme-base-primary-color-l) * -.6))); --theme-primary-custom: var(--theme-primary-custom-400); --theme-button-color: var(--theme-primary); --theme-button-hover-color: var(--theme-primary-400); --theme-button-hover-background-color: var(--theme-primary-100); --theme-button-active-background-color: var(--theme-primary-200); --theme-button-selected-color: var(--theme-primary-600); --theme-button-selected-background-color: var(--theme-primary-300); --theme-button-outlined-border-color: var(--theme-primary-400); --theme-button-outlined-selected-border-color: var(--theme-primary-500); --theme-button-primary-color: var(--white); --theme-button-primary-active-color: var(--white); --theme-button-primary-hover-color: var(--white); --theme-button-primary-selected-color: var(--white); --theme-button-primary-background-color: var(--theme-primary-400); --theme-button-primary-active-background-color: var(--theme-primary-600); --theme-button-primary-hover-background-color: var(--theme-primary-500); --theme-button-primary-selected-background-color: var(--theme-primary-600); --theme-background-color: #eeede7; --theme-background-position: top left; --theme-background-repeat: repeat; --theme-background-size: auto; --theme-background-attachment: auto; --theme-content-background-color: var(--white); --theme-content-border-color: var(--black-225); --theme-header-background-color: #ffd972; --theme-header-background-position: center left; --theme-header-background-repeat: repeat; --theme-header-background-size: auto; --theme-header-background-border-bottom: 0; --theme-header-link-color: var(--theme-primary); --theme-header-sponsored-color: hsla(0,0%,100%,0.4); --theme-header-foreground-color: transparent; --theme-header-foreground-position: center right; --theme-header-foreground-repeat: no-repeat; --theme-header-foreground-size: 475px 70px; --theme-footer-background-color: transparent; --theme-footer-background-position: top left; --theme-footer-background-repeat: no-repeat; --theme-footer-background-size: auto; --theme-footer-background-border-top: 0; --theme-footer-title-color: var(--theme-link-color); --theme-footer-text-color: var(--black-400); --theme-footer-link-color: var(--black-500); --theme-footer-link-color-hover: var(--black-600); --theme-footer-divider-color: var(--black-225); --theme-footer-padding-top: 0; --theme-footer-padding-bottom: 0; --theme-link-color: #4E67E3; --theme-link-color-hover: #7a8dea; --theme-link-color-visited: #1c34af; --theme-body-font-family: var(--ff-sans); --theme-body-font-color: var(--black-600); --theme-post-title-font-family: var(--ff-sans); --theme-post-title-color: var(--theme-link-color); --theme-post-title-color-hover: var(--theme-link-color-hover); --theme-post-title-color-visited: var(--theme-link-color-visited); --theme-post-body-font-family: var(--ff-sans); --theme-post-owner-background-color: var(--theme-primary-100); --theme-post-owner-new-background-color: var(--theme-primary-200); --theme-topbar-bottom-border: none; --darkreader-bg--theme-base-primary-color-h: 244.44444444; --darkreader-text--theme-base-primary-color-h: 244.44444444; --darkreader-border--theme-base-primary-color-h: 244.44444444; --darkreader-bg--theme-base-primary-color-s: 62.79069767%; --darkreader-text--theme-base-primary-color-s: 62.79069767%; --darkreader-border--theme-base-primary-color-s: 62.79069767%; --darkreader-bg--theme-base-primary-color-l: 16.8627451%; --darkreader-text--theme-base-primary-color-l: 16.8627451%; --darkreader-border--theme-base-primary-color-l: 16.8627451%; --darkreader-bg--theme-primary-custom-100: #NaNNaNNaN; --darkreader-text--theme-primary-custom-100: #NaNNaNNaN; --darkreader-border--theme-primary-custom-100: #NaNNaNNaN; --darkreader-bg--theme-primary-custom-200: #NaNNaNNaN; --darkreader-text--theme-primary-custom-200: #NaNNaNNaN; --darkreader-border--theme-primary-custom-200: #NaNNaNNaN; --darkreader-bg--theme-primary-custom-300: #NaNNaNNaN; --darkreader-text--theme-primary-custom-300: #NaNNaNNaN; --darkreader-border--theme-primary-custom-300: #NaNNaNNaN; --darkreader-bg--theme-primary-custom-400: #100d38; --darkreader-text--theme-primary-custom-400: #cdc8c2; --darkreader-border--theme-primary-custom-400: #7e7567; --darkreader-bg--theme-primary-custom-500: #NaNNaNNaN; --darkreader-text--theme-primary-custom-500: #NaNNaNNaN; --darkreader-border--theme-primary-custom-500: #NaNNaNNaN; --darkreader-bg--theme-primary-custom-600: #NaNNaNNaN; --darkreader-text--theme-primary-custom-600: #NaNNaNNaN; --darkreader-border--theme-primary-custom-600: #NaNNaNNaN; --darkreader-bg--theme-primary-custom: var(--darkreader-bg--theme-primary-custom-400); --darkreader-text--theme-primary-custom: var(--darkreader-text--theme-primary-custom-400); --darkreader-border--theme-primary-custom: var(--darkreader-border--theme-primary-custom-400); --darkreader-text--theme-button-color: var(--darkreader-text--theme-primary); --darkreader-text--theme-button-hover-color: var(--darkreader-text--theme-primary-400); --darkreader-bg--theme-button-hover-background-color: var(--darkreader-bg--theme-primary-100); --darkreader-bg--theme-button-active-background-color: var(--darkreader-bg--theme-primary-200); --darkreader-text--theme-button-selected-color: var(--darkreader-text--theme-primary-600); --darkreader-bg--theme-button-selected-background-color: var(--darkreader-bg--theme-primary-300); --darkreader-border--theme-button-outlined-border-color: var(--darkreader-border--theme-primary-400); --darkreader-border--theme-button-outlined-selected-border-color: var(--darkreader-border--theme-primary-500); --darkreader-text--theme-button-primary-color: var(--darkreader-text--white); --darkreader-text--theme-button-primary-hover-color: var(--darkreader-text--white); --darkreader-text--theme-button-primary-selected-color: var(--darkreader-text--white); --darkreader-bg--theme-button-primary-background-color: var(--darkreader-bg--theme-primary-400); --darkreader-bg--theme-button-primary-active-background-color: var(--darkreader-bg--theme-primary-600); --darkreader-bg--theme-button-primary-hover-background-color: var(--darkreader-bg--theme-primary-500); --darkreader-bg--theme-button-primary-selected-background-color: var(--darkreader-bg--theme-primary-600); --darkreader-text--theme-button-primary-selected-background-color: var(--darkreader-text--theme-primary-600); --darkreader-bg--theme-background-color: #212018; --darkreader-bg--theme-content-background-color: var(--darkreader-bg--white); --darkreader-border--theme-content-border-color: var(--darkreader-border--black-225); --darkreader-bg--theme-header-background-color: #664a00; --darkreader-border--theme-header-background-border-bottom: 0; --darkreader-text--theme-header-link-color: var(--darkreader-text--theme-primary); --darkreader-text--theme-header-sponsored-color: rgba(232, 230, 227, 0.4); --darkreader-bg--theme-header-foreground-color: rgba(0, 0, 0, 0); --darkreader-bg--theme-footer-background-color: rgba(0, 0, 0, 0); --darkreader-border--theme-footer-background-border-top: 0; --darkreader-text--theme-footer-title-color: var(--darkreader-text--theme-link-color); --darkreader-text--theme-footer-text-color: var(--darkreader-text--black-400); --darkreader-text--theme-footer-link-color: var(--darkreader-text--black-500); --darkreader-text--theme-footer-link-color-hover: var(--darkreader-text--black-600); --darkreader-border--theme-footer-divider-color: var(--darkreader-border--black-225); --darkreader-bg--theme-link-color: #182d96; --darkreader-text--theme-link-color: #5794e4; --darkreader-border--theme-link-color: #162a8d; --darkreader-text--theme-link-color-hover: #76a7e9; --darkreader-text--theme-link-color-visited: #6a9fe7; --darkreader-text--theme-body-font-color: var(--darkreader-text--black-600); --darkreader-text--theme-post-title-color: var(--darkreader-text--theme-link-color); --darkreader-text--theme-post-title-color-hover: var(--darkreader-text--theme-link-color-hover); --darkreader-text--theme-post-title-color-visited: var(--darkreader-text--theme-link-color-visited); --darkreader-bg--theme-post-owner-background-color: var(--darkreader-bg--theme-primary-100); --darkreader-text--theme-post-owner-background-color: var(--darkreader-text--theme-primary-100); --darkreader-bg--theme-post-owner-new-background-color: var(--darkreader-bg--theme-primary-200); --darkreader-border--theme-topbar-bottom-border: none; height: 360px; width: 640px; color-scheme: dark !important;"></iframe>



You can see that just intonation is stable.



[Share](https://music.stackexchange.com/a/43982)

[Improve this answer](https://music.stackexchange.com/posts/43982/edit)

Follow

answered Apr 29, 2016 at 13:50

![Suns's user avatar](https://www.gravatar.com/avatar/90007188e613d9c4c2f4e4b756ac3a71?s=64&d=identicon&r=PG)

[Suns](https://music.stackexchange.com/users/28264/suns)

**29**11 bronze badge

- What do you mean by "stable"? Many chord progressions will drift off pitch when played or sung in just intonation, depending on which adjustments one uses to achieve the just intonation. 

  – [phoog](https://music.stackexchange.com/users/2257/phoog)

   [CommentedApr 29, 2016 at 18:43](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment65590_43982)

[Add a comment](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)





2



I'd like to add to Cyco130's comments. One cannot always combine different intervals to get another useful interval. This has implications for tuning a guitar by ear (without using the frets). One starts with the E string and goes up a fourth to A giving a ratio of 4/3. Thence up another fourth to D yielding 16/9 and so on to G arriving at a ratio of 64/27. Now a different interval or a major third (5/4) up to B, giving a ration of 320/108 (reducible to 80/27). Finally another fourth to the high E string giving a ratio of 320/81. This ration is very close to 4/1, the ratio for two octaves.

Two musically correct paths to the "same" note do not lead to the same note. In the case given above, one may have nice intervals for C, G, and F chords but then the d minor chord is out of tune. The IV and ii chords have been treated as similar for centuries though (5-6 techniques).



[Share](https://music.stackexchange.com/a/60468)

[Improve this answer](https://music.stackexchange.com/posts/60468/edit)

Follow

answered Jul 24, 2017 at 22:10

![ttw's user avatar](https://www.gravatar.com/avatar/33922a1b857eaa5b482ed35052ac4130?s=64&d=identicon&r=PG)

[ttw](https://music.stackexchange.com/users/23838/ttw)

**25.8k**11 gold badge3535 silver badges7979 bronze badges

[Add a comment](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)





2



It's a mathematical fact that this equation:

1.5^n = 2^m

has no solution for nonzero integer n and m. Therefore, no sequence of just-intoned fifths, therefore, will ever reach an octave perfectly, no matter how far you go. So there is no equal temperament scale, no matter how finely divided, that will result in one of the notes being a perfect true fifth.



[Share](https://music.stackexchange.com/a/60426)

[Improve this answer](https://music.stackexchange.com/posts/60426/edit)

Follow

[edited Dec 9, 2021 at 18:10](https://music.stackexchange.com/posts/60426/revisions)

![Erkin Alp Güney's user avatar](https://www.gravatar.com/avatar/89991d1e7d7632df99492178597106a8?s=64&d=identicon&r=PG)

[Erkin Alp Güney](https://music.stackexchange.com/users/83394/erkin-alp-güney)

**103**22 bronze badges

answered Jul 23, 2017 at 16:19

![Kip Ingram's user avatar](https://www.gravatar.com/avatar/064748c8d08d3436ca7d30e620ef1e8a?s=64&d=identicon&r=PG)

[Kip Ingram](https://music.stackexchange.com/users/42911/kip-ingram)

**21**11 bronze badge

- 2

  This is, of course, also true of a sequence of any other integral intervals, not just perfect fifths. 

  – [Scott Wallace](https://music.stackexchange.com/users/26744/scott-wallace)

   [CommentedJul 24, 2017 at 9:13 ](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment91547_60426)

- @ScottWallace in particular, for the purpose of 5-limit just intonation, of major thirds, three of which do not equal an octave, and one of which does not equal four fifths (that is, there are likewise no solutions to the equation `1.25^p = 1.5^n * 2^m`). 

  – [phoog](https://music.stackexchange.com/users/2257/phoog)

   [CommentedDec 29, 2020 at 17:19](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment187854_60426)

- @phoog - indeed. As I've mentioned here before, it's God's fault, or that of mathematics (if there's a difference). I guess we can consider ourselves lucky that it's still possible to make great music, even given this most basic of all spanners in the works. 

  – [Scott Wallace](https://music.stackexchange.com/users/26744/scott-wallace)

   [CommentedJan 3, 2021 at 12:50](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment188276_60426)

[Add a comment](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)





0



Saying that just intonation is based on relationships in the harmonic series is just a glorified way of saying that just intonation is based on natural number ratios (because the harmonic series is all the natural numbers to infinity). The issue of just intonation is that nearly all music implies the use of more notes than are explicitly written, while most modern fixed pitched instruments revolve around only using 12 notes per octave. Because these implied extra notes are only 20-50 cents away from each other, 12TET was implemented to make it so that performers only had to keep track of 12 pitches per octave by roughly averaging out the extra notes that were fairly close to each other. The notes in just intonation that are a small distance apart are either notated with the same letter or are notated as enharmonic equivalents when using 12TET, which is where the misconceptions and confusion about just intonation begins. The truth about why it seems as though just intonation "doesn't add up" is that western notation is to blame. It is often the case that someone will set up a demonstration of how just intonation doesn't work, and then they'll either assume enharmonic equivalence, which is something that can only be assumed in equal temperament, or they won't distinguish Pythagorean ratios from 5-limit ratios (less common).



[Share](https://music.stackexchange.com/a/73089)

[Improve this answer](https://music.stackexchange.com/posts/73089/edit)

Follow

answered Jul 25, 2018 at 8:58

![12TET Killer's user avatar](https://www.gravatar.com/avatar/7d36fd34ebd724454debd6e1e4a35a58?s=64&d=identicon&r=PG&f=y&so-version=2)

[12TET Killer](https://music.stackexchange.com/users/51898/12tet-killer)

**11**11 bronze badge

- The thing is that the use of those extra notes is not always desirable. I've heard the story of the choir using just intonation to get through a song and then ending the song with their tonic a few cents away from where they started. That's an example of an unwanted extra note. End up using notes that are 20-50 cents apart (or even a comma apart) and the people with absolute pitch will be the first to unfavorably notice...and the *American Idol* fans will be the second. 

  – [Dekkadeci](https://music.stackexchange.com/users/37354/dekkadeci)

   [CommentedJul 25, 2018 at 11:13](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment116885_73089)

- 2

  You can't really blame Western notation if people use enharmonic equivalence. That's not built into the notation. Was *is* built into it is the meantone assumption, i.e. that a Pythagorean ditone is the same as a Ptolemaic major third. To express otherwise would require extra symbols like the + Ben Johnston writes before the upper note of a Pythagorean ditone. 

  – [leftaroundabout](https://music.stackexchange.com/users/932/leftaroundabout)

   [CommentedJul 25, 2018 at 16:07](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment116911_73089)

- @leftaroundabout - that's basically saying it assumes the player sticks to one tuning system :-) 

  – [staafl](https://music.stackexchange.com/users/36498/staafl)

   [CommentedOct 27, 2018 at 23:08](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment122387_73089)

- Enharmonic equivalence applies to any 12-tone keyboard, regardless of the temperament in use. Whether it works depends on the temperament, of course. 

  – [phoog](https://music.stackexchange.com/users/2257/phoog)

   [CommentedFeb 21, 2019 at 18:00](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment132255_73089)

[Add a comment](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)





0



"Why is Just Intonation Impractical?"

The true answer is: It is actually the most practical way to tune and generates the 12 ancient keys of music. When a 12 tone instrument is tuned properly to the correct 12 just pitches, you will have 12 beautiful keys to play in that are based on the laws of harmonics, and yes you can easily modulate between keys. Indeed this tuning is the real basis of the idea of "keys" of music. It has been "lost" since before the Renaissance. Strange as it may sound, several years ago I recovered it. Anyone who can do simple math and listen to examples of the sounds will see I am right.

For a concise summary of this with examples of songs played in the 12 ancient keys, go to Unfretted dot com to the Other Instruments Forum to the thread, 17 Tone Just Intonation Guitar and scroll to my posts that begin July 17, 2018 (ignore earlier).

My gift to anyone who's paying attention. Most of what you've been taught about just intonation is fiction. Tom M Culhane

p.s. Ask yourself, where did the idea of playing music in various keys come from? Certainly not from "modern tuning". Equal temperament has no keys to speak of, they all have the same feel, as the proportions one note to the next are identical. It takes variety to have keys of music. Other tuning systems have variety, but they are based on make believe numbers. Just intonation, on the other hand, is based on real math. Whole numbers are the basis of vibration in the real world. For example the harmonics you hear when you tap on a guitar string at certain points. One of the flaws in the answers given here is the idea of expressing musical intervals in the singular sense, such as "the fifth". A properly tuned 12 tone instrument will have a variety of fifths. Indeed it is this irregularity that gives us the keys of music. But you need the correct pitches to make it all work. I have found them. They were sitting right under everyone's nose.



[Share](https://music.stackexchange.com/a/73580)

[Improve this answer](https://music.stackexchange.com/posts/73580/edit)

Follow

[edited Aug 10, 2018 at 21:00](https://music.stackexchange.com/posts/73580/revisions)

answered Aug 9, 2018 at 20:41

![Tom M Culhane's user avatar](https://www.gravatar.com/avatar/ce7b091e747a872b56e86c4703ad2328?s=64&d=identicon&r=PG)

[Tom M Culhane](https://music.stackexchange.com/users/52214/tom-m-culhane)

**11**33 bronze badges

- Your edit is made from a different account than that which posted the answer. You can use [this form](https://music.stackexchange.com/contact) to try and merge your accounts. 

  – [Richard](https://music.stackexchange.com/users/21766/richard)

   [CommentedAug 10, 2018 at 2:05](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment118033_73580)

- My post here that I made yesterday has already received an unfavorable vote. I want to stress to the readers that if you are willing to listen to my vids I referenced above that are played in various keys of 12 tone just intonation, you will see they are all playable and beautiful keys. Sometimes it takes courage to let go of dogma. A piano tuner once told me I will only have a couple playable keys if I tune my piano to just intonation. I proved him wrong, sent him samples of chords in each key. Haven't heard from him since. To learn you've been tuning pianos wrong for 30 years can be scary. 

  – [Tom M Culhane](https://music.stackexchange.com/users/52214/tom-m-culhane)

   [CommentedAug 10, 2018 at 21:51](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment118122_73580)

- I didn't give the downvote, but it may have less to do with the information and more to do with the reference to an outside site. It's typically better to have the information *in the answer* in case wherever you're directing us goes down in the future. 

  – [Richard](https://music.stackexchange.com/users/21766/richard)

   [CommentedAug 10, 2018 at 21:53 ](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment118123_73580)

- 1

  Please could you clarify why, if irregularity is needed, all the non-ET Baroque tunings don't provide it? And how you reconcile your claim "irregularity that gives us the keys of music" with your claim that there is only one set of "the correct pitches" that "make it all work"? 

  – [Rosie F](https://music.stackexchange.com/users/29126/rosie-f)

   [CommentedAug 11, 2018 at 8:21](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment118132_73580)

- To Rosie F: Plucking a string will cause it to sing, but tapping at points that divide the string into whole number divisions (just intervals) causes other notes to naturally emerge. There is a science to how Nature vibrates. In 12 tone tuning, the 7 pure just tones are fundamental to the real, original ancient tuning. But you need 5 more numbers. This is where everybody screws up. The key to recovering those 5 is to think in terms of whole numbers. When you see the pattern and punch them in, voila! Everything clicks into place like a wooden puzzle snapping together. The keys emerge. 

  – [Tom M Culhane](https://music.stackexchange.com/users/52214/tom-m-culhane)

   [CommentedAug 11, 2018 at 13:54](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment118139_73580)

[Show **3** more comments](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)





0



The reason why a given set of just intonation pitches only work for a single key is that when choosing another root (i.e. modulating), the ratios of the degrees in the scale are no longer correct. For example, in a JI tuning based on C, the frequency of D (major 2nd) is 9:8 of the root, while E (major 3rd) is 5:4. Taking D as the root, suddenly the major 2nd (now E) is not a ratio of 9:8 but (5:4)/(9:8) = 10:9, so the major 2nd comes out flat.

Choosing different root notes produces more or less dissonant tunings and in fact some intervals work out correctly (e.g. taking the perfect fourth F, the new major second G is correctly at 9:8 ratio from the root), but only the original root works in relation to all pitches. This also applies to other modes than the major - an instrument tuned in just intonation can only properly play one set of modes. This situation is avoided in equal temperament because the pitches are a geometric progression and the ratios between pitches depend only on the number of steps between them.

There's also the problem with flats and sharps not being enharmonic - if we define F# as leading tone in G major, and Gb as the perfect fourth in Db major, their frequencies don't match - 'the circle of fifths doesn't close':

[![spiral of fifths](https://i.sstatic.net/DC4WJ.gif)](https://i.sstatic.net/DC4WJ.gif).

(image courtesy of http://jjensen.org/spiral5ths/Spiral5ths.html)

Doing the math you get F#:G = B:C = 243:128 = 1.898438 and Gb:Db = Db:Ab = Ab:Eb = Eb:Bb = Bb:F = F:C = C:G = 4:31; multiplying all the ratios and dividing by the closest power of 2 gets you Gb:G = 4.36/4 = 1.872885 - so you can't have true Db major and G major scales using the same 12 chromatic pitches.

1 This is fudging it a little; in just intonation, the pitch of any note, and its ratio to any other, depends on the question "in which key?", and the ratio Gb:G doesn't make sense in any case since no key contains those two notes. Here we're talking about the major keys of the G and Db that we get by walking the circle of fifths and comparing the Gb in Db major to the G in G major (and the F# in G major to the G in G major respectively). The point is that in any key that contains a tone called F#, the pitch of that tone is different from any tone called Gb in any other key.



[Share](https://music.stackexchange.com/a/75835)

[Improve this answer](https://music.stackexchange.com/posts/75835/edit)

Follow

[edited Oct 28, 2018 at 11:07](https://music.stackexchange.com/posts/75835/revisions)

answered Oct 27, 2018 at 18:56

![staafl's user avatar](https://www.gravatar.com/avatar/2ed3301506c9cbf5f45b9566a48513b9?s=64&d=identicon&r=PG)

[staafl](https://music.stackexchange.com/users/36498/staafl)

**101**33 bronze badges

- It's not necessary to go to different keys to find intervals that no longer work; looking at a different chord in the same key can also have the same result. The classic example for a major key is the sixth scale degree, which must be rather lower to serve as the just major third of a IV chord than where it needs to be to serve as the fifth of a ii or V/V chord. 

  – [phoog](https://music.stackexchange.com/users/2257/phoog)

   [CommentedFeb 21, 2019 at 17:57 ](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment132254_75835)

- @phoog, it's my understanding that chords are constructed from degrees of the scale, not by modulating the intervals from the root. So in JI the IV chord will contain different intervals than the I chord (as you note), but will still sound correct in the context of the scale and tuning. If that's incorrect, please point me to a resource that discusses this since there's a lot of confusion in this area and it's better to stick to reputable references. 

  – [staafl](https://music.stackexchange.com/users/36498/staafl)

   [CommentedFeb 22, 2019 at 9:41](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment132314_75835)

- I do not know of a resource, but a few minutes with a calculator or spreadsheet will show that (assuming fixed pitches) if you have a single just third in your tuning, you will have an unusable fifth. Looking at just the white keys in C major, you could accept a Pythagorean third in the F chord to save the fifth between D and A, but then you break the fifth between A and E. You could put the E in a Pythagorean third with C, but then you have a bad fifth between E and B. If you raise the B, you have no more just thirds, so are left with Pythagorean tuning. 

  – [phoog](https://music.stackexchange.com/users/2257/phoog)

   [CommentedFeb 22, 2019 at 15:31](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment132350_75835)

[Add a comment](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)





-2



It is neither easy nor difficult to compose in JI, it is not a significant part of the history of western music, especially over the past 600± years. JI is based on the fundamental. Western music in developing tonality is based on sets of hierarchical relationships where 'scale degree' ^1 is more important than ^5, and harmonically, ^5 is more important than ^2, etc with ^2, ^6, ^3. Using JI for tonal harmony, while interesting, has no historical, or acoustic basis.



[Share](https://music.stackexchange.com/a/36198)

[Improve this answer](https://music.stackexchange.com/posts/36198/edit)

Follow

answered Aug 26, 2015 at 2:43

![Kaustin6969's user avatar](https://www.gravatar.com/avatar/d17f46785d839f447772258e94b47a0e?s=64&d=identicon&r=PG)

[Kaustin6969](https://music.stackexchange.com/users/23180/kaustin6969)

**1**

- 1

  This is misleading. While the general trend in Western music has been towards developing tunings that lend themselves to modulation and equality of intervals, this has been by way of compromising the acoustic basis, which is geometrical or just. And this trend is fairly recent- until about five hundred years ago, there was no need felt to modulate. 

  – [Scott Wallace](https://music.stackexchange.com/users/26744/scott-wallace)

   [CommentedApr 7, 2016 at 14:57](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#comment64397_36198)

[Add a comment](https://music.stackexchange.com/questions/7986/why-is-just-intonation-impractical#)

</diskussion>

Напиши статью с глубокой критикой Just Intonation в практике. Опирайся на аргументы из дискуссии, свое знание Just Intonation, акустики и традиционной композиции, делай самостоятельные выводы и развивай их, думай и анализируй. Не забудь проанализировать неоднозначность JI (один и тот же темперированный интервал (малая септима) может быть 7/4, 9/5 или 16/9, например)

Потом напиши контраргументы, не бойся думать смело и самостоятельно.



## Практическая нецелесообразность чистой интонации (Just Intonation)

Дискуссия о чистой интонации (Just Intonation, JI) и равномерно темперированном строе (12-Tone Equal Temperament, 12-TET) стара как мир. Сторонники JI утверждают, что она обеспечивает более гармоничное звучание, основанное на натуральном звукоряде, в то время как приверженцы 12-TET ценят возможность свободного перемещения по тональностям без перестройки инструмента. Но насколько практична JI в реальной музыкальной практике?

**Аргументы против Just Intonation:**

1. **Математическая нестыковка:** Как верно отмечается в дискуссии, математически невозможно создать замкнутый квинтовый круг, используя только чистые интервалы. Если мы будем последовательно откладывать чистые квинты (3/2), то никогда не вернемся точно в исходную ноту через целое число октав. Выражаясь математически: (3/2)^n ≠ 2^m ни при каких целых положительных n и m. Это означает, что система, построенная на чистых квинтах, неизбежно будет содержать "волчью квинту" — фальшивый интервал, возникающий из-за накопления ошибки.

2. **Ограниченность одной тональностью:** Если инструмент настроен по JI относительно определенной тоники, то он будет звучать гармонично только в этой тональности. При переходе в другую тональность интервальные соотношения нарушатся, так как они завязаны на изначальную тонику. Например, если мы настроим инструмент по JI в C, то интервал D-E (большая секунда) будет равен 9/8. Но если мы возьмем D за новую тонику, то интервал E-F# (тоже большая секунда) должен быть 9/8, а по факту он будет (5/4)/(9/8)=10/9, что является малой секундой. Получается, что нам понадобится отдельная нота для "E в тональности C" и "E в тональности D", а это уже не 12 нот в октаве.

3. **Неоднозначность JI:** Даже внутри одной тональности JI не обеспечивает однозначности интервалов. Например, малая септима может быть представлена разными отношениями частот: 7/4 (гармоническая септима), 9/5 или 16/9. Какую из них выбрать? Это зависит от контекста, от конкретной гармонической функции интервала. Такая неоднозначность усложняет практическое применение JI, особенно для инструментов с фиксированным строем. В 12-TET такой проблемы нет - малая септима всегда одна и та же, что упрощает игру в разных тональностях.

4. **Невозможность построения всех аккордов в одной тональности:**  Даже в пределах одной тональности невозможно построить все аккорды, используя только чистые интервалы. Например, в C-dur, настроенном по JI, аккорд ii ступени (D-F-A) будет звучать фальшиво, так как интервал D-A будет 40/27 вместо 3/2. Чтобы исправить это, придется вводить дополнительные ступени, что делает систему еще более громоздкой.

5. **Практические сложности:** Создание инструментов с фиксированным строем, способных реализовывать JI в разных тональностях, крайне сложно и дорого. Как упоминается в дискуссии, в прошлом предпринимались попытки создания органов и клавесинов с 14-36 клавишами в октаве, но они не прижились из-за сложности игры и настройки. Современные эксперименты с микротональными гитарами также демонстрируют, что такие инструменты остаются уделом энтузиастов.

6. **Традиционная композиция:**  Западная музыкальная традиция, по крайней мере последние несколько веков, развивалась в рамках равномерно темперированного строя. Подавляющее большинство музыкальных произведений написано с учетом именно этого строя, и их исполнение в JI может исказить авторский замысел. Равномерная темперация упрощает модуляцию, позволяет использовать сложные гармонические структуры, что стало неотъемлемой частью музыкального языка.

**Вывод:**

Just Intonation представляет собой интересную теоретическую концепцию, но ее практическое применение в рамках западной музыкальной традиции крайне ограничено. Невозможность построения замкнутой системы чистых интервалов, ограниченность одной тональностью, неоднозначность интервальных соотношений и практические сложности создания инструментов делают JI непригодной для большинства музыкальных задач. Равномерно темперированный строй, несмотря на свои компромиссы, оказался гораздо более универсальным и удобным инструментом для композиторов и исполнителей.

## Контраргументы в защиту Just Intonation

Несмотря на вышеперечисленные недостатки, у Just Intonation есть свои сильные стороны, которые нельзя игнорировать:

1. **Гармоничность звучания:** Чистые интервалы, основанные на простых числовых отношениях, действительно звучат более гармонично, чем их темперированные аналоги. Это особенно заметно в вокальной музыке и при игре на инструментах с нефиксированным строем (струнные смычковые, тромбон), где исполнители могут интуитивно подстраивать высоту звука для достижения идеального созвучия. JI раскрывает красоту консонанса во всей его полноте.

2. **Выразительные возможности:** Неоднозначность JI можно рассматривать не как недостаток, а как источник дополнительных выразительных средств. Разные варианты одного и того же интервала (например, разные виды малой септимы) могут создавать тонкие нюансы настроения, недоступные в 12-TET. Это открывает новые горизонты для композиторов, ищущих свежие гармонические краски. Как выразился один из участников дискуссии, "разновидности звучания «в гармонии» и «не в гармонии» придают музыке совершенно иное измерение".

3. **Исторический контекст:** До появления равномерной темперации JI была широко распространена. Многие произведения старинной музыки, особенно вокальной, были написаны с учетом именно этого строя. Исполнение такой музыки в 12-TET неизбежно искажает ее первоначальное звучание. Возвращение к JI в аутентичном исполнительстве позволяет нам услышать музыку прошлого такой, какой она звучала для современников.

4. **Развитие музыкального слуха:** Практика JI может способствовать развитию более тонкого и чуткого музыкального слуха. Исполнители, работающие с JI, учатся различать малейшие нюансы интонации, что обогащает их музыкальное восприятие.

5. **Компьютерные технологии:** Современные компьютерные технологии снимают многие практические ограничения, связанные с JI. Программные синтезаторы позволяют легко настраивать и перестраивать инструмент в любой системе JI, экспериментировать с микротональностью, создавать музыку, недоступную для традиционных инструментов. Один из комментаторов в дискуссии справедливо заметил, что в контексте компьютерной музыки JI может быть более практичной, чем когда-либо прежде.

6. **Экспериментальная музыка:** JI открывает широкие перспективы для экспериментальной музыки, выходящей за рамки традиционной тональности. Композиторы, такие как Гарри Парч и Бен Джонстон, показали, что JI может стать основой для совершенно новых музыкальных систем, основанных на микротональности и сложных гармонических структурах.

**Смелые и самостоятельные выводы:**

*   Возможно, будущее музыки лежит не в выборе между JI и 12-TET, а в их **синтезе**. Развитие электронных инструментов и компьютерных технологий открывает путь к созданию **динамически изменяемых систем настройки**, которые могли бы сочетать в себе преимущества обоих подходов. Представьте себе инструмент, который автоматически подстраивается к JI в консонирующих аккордах и плавно переходит к 12-TET при модуляции или в диссонирующих пассажах.
*   Не стоит ограничиваться рамками 12-тоновой системы. JI может стать отправной точкой для исследования **микротональной музыки**, использующей более 12 ступеней в октаве. Это открывает неизведанные области гармонии и мелодики, способные обогатить музыкальный язык.
*   **Обучение музыкантов** должно включать в себя знакомство с JI, даже если они не планируют специализироваться на старинной или экспериментальной музыке. Понимание принципов JI развивает слух, расширяет представление о гармонии и дает более глубокое понимание природы музыкального звука.

В заключение, Just Intonation – это не просто пережиток прошлого, а **ценный инструмент**, который может обогатить современную музыку. Отказ от догматического противопоставления JI и 12-TET и открытость к новым возможностям, которые открывает чистая интонация, могут привести к интересным открытиям в области музыкальной теории и практики.









## Дополненный анализ практической нецелесообразности Just Intonation с примерами

### Больше примеров, практических и математических:

**1. Проблема квинтового круга (Пифагорова строя):**

Пифагоров строй, основанный исключительно на чистых квинтах (3/2), действительно является лишь одним из вариантов приближения к чистой интонации. Он хорошо работает для построения первых нескольких квинт, но ошибка накапливается, и система "ломается" довольно быстро.

Давайте рассмотрим этот процесс на примере:

*   Начинаем с C (1/1).
*   G (квинта вверх): 3/2
*   D (квинта вверх): (3/2) \* (3/2) = 9/4. Чтобы вернуть ноту в пределы октавы, делим на 2: 9/8
*   A: (9/8) \* (3/2) = 27/16
*   E: (27/16) \* (3/2) = 81/32. Делим на 2: 81/64
*   B: (81/64) \* (3/2) = 243/128

До сих пор всё звучит относительно чисто. Но дальше начинаются проблемы. Если мы продолжим строить квинты, то на 12-й квинте (условно назовем её H#) мы получим:

*   H#: (3/2)^12 = 531441/4096. Делим на 2^7 (семь октав), чтобы вернуть ноту в пределы первой октавы: 531441/524288 ≈ 1.0136

В идеале, H# должна была бы совпасть с C (октавой), то есть иметь отношение 2/1. Но мы получили 1.0136, что и есть **пифагорова комма** — та самая накапливающаяся ошибка. Эта разница в 23,5 цента и есть та самая "волчья квинта", которая делает невозможным замкнуть квинтовый круг в пифагоровом строе.

**"Ломается" это на 5-й квинте (нота B)**, так как именно в этом месте накапливается ошибка в виде пифагоровой коммы, и нота B оказывается уже слишком высокой, что создает проблемы с аккордом G-B-D.

**2. Проблема большой терции (5/4) в пифагоровом строе:**

Пифагоров строй не может точно передать чистую большую терцию (5/4). Как мы видели выше, большая терция в пифагоровом строе получается равной 81/64, что составляет около 408 центов. Чистая большая терция (5/4) равна примерно 386 центам. Разница составляет около 22 центов (так называемая **синтоническая комма**), что весьма заметно на слух.

**3. Пример неоднозначности JI на примере малой септимы:**

*   **Гармоническая септима (7/4):** Звучит очень мягко и специфически, характерна для блюза и джаза. Например, в C это будет интервал C-Bb, где Bb — седьмая гармоника от C.
*   **Малая септима через две чистые кварты (16/9):** Например, C-F (4/3), G-C (4/3), итого C-G (3/2). Переворачиваем вторую кварту: C-G(3/2) + G-Bb(4/3). C-Bb= 4/3 * 3/2 = 2, 2/2/3/4 = 16/9.
*   **Малая септима через квинту и большую терцию (9/5):** Например, C-G (3/2) и E-G (6/5). Инвертируя: C-E (5/4), C-G (3/2). C-G/C-E = 3/2 : 5/4 = 12/10 = 6/5. Переворачиваем терцию 5/6 и умножаем на 3/2 (квинту). Получаем 9/5

В разных контекстах может быть предпочтителен тот или иной вариант. Например, 7/4 хорошо звучит в доминантсептаккорде, а 16/9 — как интервал между IV и VII ступенями мажорного лада.

**4. Пример проблем с аккордами в JI:**

Рассмотрим трезвучие D-F-A в C-dur, настроенном по JI:

*   D относительно C: 9/8 (большая секунда)
*   F относительно C: 4/3 (чистая кварта)
*   A относительно C: 5/3 (большая секста)

Теперь посмотрим на интервалы внутри трезвучия:

*   D-F: (4/3) / (9/8) = 32/27 (малая терция, но не чистая 6/5, а пифагорейская, уже на ~16 центов)
*   F-A: (5/3) / (4/3) = 5/4 (чистая большая терция)
*   D-A: (5/3) / (9/8) = 40/27 (вместо чистой квинты 3/2, уже на ~22 цента)

Как видим, трезвучие D-F-A получается нечистым. Чтобы сделать его чистым, нужно вводить дополнительные ступени, например, понижать D на синтоническую комму.

### Решение проблем с тональностью в компьютерной музыке:

В компьютерной музыке проблемы с тональностью в JI решаются несколькими способами:

1. **Динамическая настройка:** Программные синтезаторы могут менять высоту звука в реальном времени, подстраиваясь под текущую гармонию. Это позволяет использовать чистые интервалы в любой тональности без необходимости вводить дополнительные ступени. Например, плагин **Scala** позволяет загружать файлы строёв и динамически перестраивать инструмент.
2. **Микротональные секвенсоры:** Существуют секвенсоры, позволяющие работать с микротоновой музыкой, то есть использовать более 12 ступеней в октаве. Это дает возможность использовать разные варианты одного и того же интервала в зависимости от контекста (например, разные виды малой септимы). Примером может служить **H-Pi Instruments Tuning Editor**.
3. **Алгоритмическая композиция:** Можно создавать алгоритмы, которые генерируют музыку, изначально основанную на принципах JI, учитывая ограничения и особенности этого строя. Такие алгоритмы могут, например, избегать модуляций в далекие тональности или использовать аккорды, которые хорошо звучат в JI.
4. **Семплирование:** Можно записать семплы инструментов, настроенных в JI в разных тональностях, и затем использовать их в своей музыке. Это позволяет добиться чистого звучания без необходимости динамической подстройки.

### Приятность звука и биения:

Действительно, люди часто находят приятными небольшие биения, возникающие из-за неточности интервалов. Это придает звучанию "живость" и "теплоту". Например, легкая расстроенность унисона на фортепиано или в хоре воспринимается как более богатое и насыщенное звучание.

С другой стороны, слишком сильные биения, возникающие в "волчьей квинте" или других сильно фальшивящих интервалах, уже неприятны для слуха.

Здесь важен баланс. JI стремится к полному отсутствию биений в консонансах, что может звучать стерильно. Равномерная темперация, наоборот, содержит биения во всех интервалах, кроме октавы, что может утомлять слух.

Возможно, идеальный строй должен сочетать в себе чистоту консонансов с умеренным количеством биений в диссонансах, создавая ощущение "живого" и "дышащего" звука. Это одна из причин, почему динамическая настройка, о которой говорилось выше, может быть столь перспективной.

В любом случае, вопрос "приятности" звука во многом субъективен и зависит от культурного контекста и индивидуальных предпочтений.