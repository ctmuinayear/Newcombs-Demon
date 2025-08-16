/*
After Acceptors, Langan goes on to define transducers. A transducer is a tuple
M = (S, d, Q, m, T, q0)
Where S is the input alphabet, d: S x Q -> Q is the input state transition function
Q is a non-empty state set, m: S x Q -> T is the output function, T is the output
alphabet, and q0 is the initial state as before.

We will build the recursive version.
Remember in the recursive version of the acceptor:
Given t ∈ S* and s ∈ S
dp(λ, q) = q;
dp(ts, q) = d(t, dp(t, q))

We similarly extend m:
mp(λ, q) = λ
mp(ts, q) = mp(t, q)m(dp(t, q), s) Note: here mp(...)m(...) implies concatenation, not multplication

It does seem like the recursive version is both more difficult and less efficient than the for loop
version, but let's try it anyway:
*/

let M = {
    //Define some input alphabet:
    ///Keeping the numbers for simplicity but changing them to strings so we can concatenate them.
    S: ["0", "1", "2", "3", "4", "5", "6", "7"],

    //Define some state set Q
    Q: [0, 1, 2, 3, 4, 5, 6, 7],

    //define some subset of accepting states:
    A: [2, 3, 4, 5],

    //Defining T for convenience:
    T: ["0", "1", "2"],

    //Define initial state for control
    q0: 0,

    //Set current state to initial state
    q: 0,

    //Modification of our original mapping. It now accepts a parameter q so it can process the output of dp
    //I don't think this is strictly necessary, but it's closer to Langan's notation. (Which obviously wasn't
    //designed for modern programming syntax.)
    d: function(s, q) {
        //if s is not in the input alphabet S we simply do nothing - s is outside the syntax of S
        if(!this.S.includes(s)){
            return;
        }

        //if for some reason q is not in Q, we will just reset to q0
        if(!this.Q.includes(q)){
            q = this.q0;
        }
        
        //run the d defined above and get the result:
        let index = (+s + q) % this.Q.length;

        //update state q:
        q = this.Q[index];
        return q;
    },

    dp: function(t, q){
        if(t == ""){
            return q;
        }
        let newT = t.slice(1); //this is 't' from our discussion above
        let s = t[0]; //this is s from our discussion above. 

        return this.d(s, this.dp(newT, q));
    },

    //This is the actual d of our modified F, the D exposed to the outside world/what the input hits.
    //Really all it is is a wrapper to avoid exposing q to the outside without intention.
    D: function(t){
        this.q = this.dp(t, this.q);
    },

    //NOTE: D changes q, and is called in here, we're going to have to think about how we run this.
    ////Probably by running m first to avoid interfering with ourselves. The for loop variant avoids
    ////this issue (or at least minimizes it), but may be less general, I don't actually know.
    ////Also this strikes me as wildly inefficient, what with the computing q's more than once.
    ////I'm sure there are better implementations out there.

    //base variant of m
    m: function(s, q){

        //If we accept, choose an index to return
        let index = (q + s) % this.T.length;
        //return choice
        return this.T[index];
    },

    //recursive variant of m
    mp: function(t, q){
        if(t === ""){
            return "";
        }

        let newT = t.slice(1); //this is 't' from our discussion above
        let s = t[0]; //this is s from our discussion above. 

        //Stepping q. The definition requires it and for now I'm only allowing
        //return on those inputs which are accepted - possibly anticipating later 
        //development. But this means we can't run both D and M, since they would 
        //interfere.
        
        let newBeginning = this.mp(newT, this.q);
        let newEnd = this.m(s, q);

        return newBeginning + newEnd;
    },
    
    //Adding "external" M because I'm picky.
    M: function(t){
        return this.mp(t, this.q);
    },
    
    //Adding in the acceptor function for a convenience:
    Accepts: function(){
        return this.A.includes(this.q);
    },

    //Adding a reset function for the same:
    reset: function(){
        this.q = this.q0;
    }
}

//Let's print everything one more time for good measure
console.log("\nBASIC STATE CHECK")
console.log("input alphabet: " + M.S);
console.log("State set: " + M.Q);
console.log("Accepting set check: " + M.A);
console.log("Initial state: " + M.q0);
console.log("Current state: " + M.q);
console.log("Currently accepts? " + M.Accepts())
console.log("\n\n");

//Let's run our new transducer and fire off M.M() if the string is accepted, but not
//if the string isn't.
//We'll start with a string we know is rejected:
console.log("TESTING OUR TRANSDUCER")
let transducerInput = "123";
M.D(transducerInput);
if(M.Accepts()){
    let output = M.M(transducerInput);
    console.log("output state for 123: " + output); //Nothing happens, cool.
}
M.reset(); 

//Now let's try with a string we remember works:
transducerInput = "345";
M.D(transducerInput);
if(M.Accepts()){
    let output = M.M(transducerInput);
    console.log("output state: " + output);
}
M.reset();  //--> Note the funny business here: we aren't reseting after M.D(...),
//Which actually breaks from our recursive definition by giving D and M two different q's
//Now that we've reset everything, let's see what the output is if we do reset, and keep
//M and D with the same starting q:

M.D(transducerInput);
if(M.Accepts()){
    M.reset();
    let output = M.M(transducerInput);
    console.log("Reset first output state: " + output); //Notice this is actually different 
}
M.reset(); 
console.log("\n\n");

//This seems somewhat external to the transducer M. It seems fitting that all of M's functionality
//should be contained within M. Later with the ARC principle (Analytic Reality Closure), self-containment
//will be necessary. (Ignoring for now the fact that there is input).
//Let us then extend our M to contain all of it's own tick functionality:
M.Transduce = function(input=""){ //input set to zero so it's not strictly required
    M.D(input);
    if(M.Accepts()){
        M.reset();
        let output = M.M(input);
        return output;
    }
    M.reset(); //NOTE: We don't actually have to reset here, we could keep the q-memory, but if we don't the reset
                //above will be more complicated. This should suffice for here and now.

    return ""; //Return blank output if string is not accepted. In line with mp(λ, q) = λ
}

//Let's try this out with our new Tick function:
console.log("NEW TRANSDUCE FUNCTION TEST");
let rejected = M.Transduce("123");
console.log("Output from rejected string: " + rejected); // should be blank

let accepted = M.Transduce("345");
console.log("Output from accepted string: " + accepted);