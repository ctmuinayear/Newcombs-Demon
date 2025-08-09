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

Let's try it.
*/


//Create an F acceptor:
let F = {
    //Define some input alphabet:
    ///Using numbers for simplicity in the update function.
    S: [0, 1, 2, 3, 4, 5, 6, 7],

    //Define some state set Q
    Q: [0, 1, 2, 3, 4, 5, 6, 7],

    //define some subset of accepting states:
    A: [2, 3, 4, 5],

    //Define initial state for control
    q0: 0,

    //Set current state to initial state
    q: 0,

    //Not including q as a parameter because it's contained in the object programmatically,
    //But the mapping is still SxQ -> Q
    d: function(s) {
        //if s is not in the input alphabet S we simply do nothing - s is outside the syntax of S
        if(!this.S.includes(s)){
            return;
        }

        //if for some reason q is not in Q, we will just reset to q0
        if(!this.Q.includes(this.q)){
            this.q = this.q0;
        }
        
        //run the d defined above and get the result:
        let index = (s + this.q) % this.Q.length;

        //update state q:
        this.q = this.Q[index];
    }
}

//let's print all the items of F fro sanity:
console.log("input alphabet: " + F.S);
console.log("State set: " + F.Q);
console.log("Initial state: " + F.q0);
console.log("Current state: " + F.q);
console.log("Currently accepts? " + F.A.includes(F.q))
console.log();

//Now let's run it for a bit with random elements from S and see what it accepts and what it rejects:
for(let i = 0; i < 10; i++){
    let randIndex = Math.floor(Math.random() * F.S.length);
    F.d(F.S[randIndex], F.q);
    console.log("Current state: " + F.q);
    console.log("Accepted? " + F.A.includes(F.q));
    console.log();
}