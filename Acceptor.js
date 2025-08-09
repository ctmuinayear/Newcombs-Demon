/*
Newcomb's Paradox is a paradox which influenced Langan considerably. The paradox goes like this:
1) Newcomb's Demon invites you to play a game to demonstrate his power.
2) He takes you to a room with two boxes on the table: a transparent box and an opaque box.
3) The transparent box has $1,000 dollars in it - you can see this clearly.
4) He tells you that if he has determined that you will take the opaque box only, then he has placed $1,000,000 in the opaque box.
5) If he has determined that you will take both boxes, then there is nothing in the opaque box.
6) You are permitted to take either the opaque box only, or both boxes. Which do you choose?
7) Using a pair of spare boxes and some Monopoly money, he offers to take you through trial runs.
8) The two of you engage in several trial runs. Each time you pick the opaque box only, there is $1,000,000 moneys in it. Each time you take both boxes, there is $0 moneys in the opaque box.
9) After some time he says you have to play for real now. You leave the room, he sets everything up, you enter again.
10) What do you choose? On the one hand, he's been right every time. On the other, whatever move he made has already been made, and you have nothing to loose by choosing both boxes.

Langan resolves this paradox with a hierarcy of automata in MP 1: "The Resolution To Newcomb's Paradox". It's one of the easier papers. (Still by no means a trivial read). I highly recommend.
*/ 

/*
To resolve the paradox, Langan starts with an overview of Automata.
An acceptor F is a 5-tuple: F = (S, d, Q, A, q0) [Note: he writes it with Greek letters and in a different order. I find this order more intuitive. For the Greek, I admit to laziness. Lol
S is a set {s1, s2, ...} of symbols called the input alphabet of F
d is the update function d: SXQ -> Q. The function d takes the current input and current state and uses that information to update the current state Q.
Q is the set of possible internal states
A is a subset of Q, the set that F "accepts".
q0 is some initial starting condition.
*/

