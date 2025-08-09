/*
After the basic acceptor F, langan makes a simple adjustment for non-deterministic acceptors. 
As far as I can tell, he has done nothing outside what mainstream math is comfortable with.
Remember our original acceptor F:
    F = (S, dn, Q, q0, A)

The main difference now is instead of:
    d: S x Q -> Q

We now have
    dn: S x Q -> 2^Q
    This takes the current input and current state, and chooses an element from the power set of Q.
    n is for non-deterministic (or at least that's what I'm going to say.)
    [Note: 2^Q is the notation in MP 1. Wikipedia uses P(Q) where P is for the Power Set]

Let's try it:
*/

//Let's start with our acceptor from before:
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

    //CHANGES HAPPEN HERE!!
    //Now instead of having d: S x Q -> Q, we must have dn: S x Q -> 2^Q
    //Before our function was simply the (s + q)th element of ZQ.length (the cyclical group of length Q.length) 
    //let's adjust this to be:
    //  The first (s + q) elements of Q mod its length
    //Keeping it simple
    dn: function(s) {
        //if s is not in the input alphabet S we simply do nothing - s is outside the syntax of S
        if(!this.S.includes(s)){
            return;
        }

        //if for some reason q is not in Q, we will just reset to q0
        //NOTE: This will cause problems. Once the function has run, q will not be an element of Q but a subset.
        //Therefore every tick this will reset q. We will deal with this later. (possibly much later.) 
        if(!this.Q.includes(this.q)){
            this.q = this.q0;
        }
        
        //run the d defined above and get the result:
        let index = (s + this.q) % this.Q.length + 1;

        //update state q:
        this.q = this.Q.slice(0, index)
    }
}

//Let's print everything again for good measuer:
console.log("input alphabet: " + F.S);
console.log("State set: " + F.Q);
console.log("Initial state: " + F.q0);
console.log("Current state: " + F.q);
console.log("Currently accepts? " + F.A.includes(F.q))
console.log();

//Now let's run it again for a few ticks. Remember, it will reset every time because
//we haven't actually handled the "determining" part of our non-deterministic acceptor
//Again we will use random inputs to simulate the environment. 
//Note: Langan seems quite opposed to (pure) randomness. By assumption we will be too, but this is good enough for now.
//We are also not using randomness in F's operations.
for(let i = 0; i < 10; i++){
    let randIndex = Math.floor(Math.random() * F.S.length);

    //Simply adjust F.d to F.dn:
    F.dn(F.S[randIndex], F.q);

    console.log("Current state: [" + F.q + "]");
    console.log("Accepted? " + F.A.includes(F.q));
    console.log();
}

//Notice, even the case where the returned value is a single element, it still could never be accepted no matter
//how we defined A subset of Q. Since the elements of A are individual elements in Q, and the elements of 2^Q are
//subsets of Q. The closest it comes to the deterministic case is returning a single element subset that overlaps with A.