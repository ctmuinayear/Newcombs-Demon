/*
After commenting on a simple adjustment to take F from deterministic to non-deterministic
we return to a deterministic F to handle an arbitrary length string of inputs. This wasn't
really a problem for us, since we had our for loop. The for loop was external to our F though,
and Langan seems to be influenced by recursive ideas, so let's extend our automata to handle
strings recursively.

Let's say we have a string t ∈ S*
S* is the set of all possible strings from S.
A string of S is simply some finite sequence of elements from S.

Remember we only defined d for single s ∈ S. So let's extend F to handle string from S by
introducing the empty string λ, and an "extended transition function" dp.

dp functions like so:
Given t ∈ S* and s ∈ S
dp(λ, q) = q;
dp(ts, q) = d(t, dp(t, q))

This is the recursive definition Langan gives in MP 1, and it's the one we're going to code. Note, you could wrap the entire recursion into one function.

Note: I invert the parameters and use d(s, q) while Langan uses d(q, s). I imagine the input coming in from the left and exiting on the right, I suspect
Langan may think of it as the automata traveling from left to right. This is more intuitive for me for now - though I may try to subvert that tendency later.

Let's try our automata with recursive d:
*/

//Here is our modified automata:
let F = {
    //Define some input alphabet:
    ///Keeping the numbers for simplicity but changing them to strings so we can concatenate them.
    S: ["0", "1", "2", "3", "4", "5", "6", "7"],

    //Define some state set Q
    Q: [0, 1, 2, 3, 4, 5, 6, 7],

    //define some subset of accepting states:
    A: [2, 3, 4, 5],

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
    }
}

//Let's print everything one more time for good measure
console.log("input alphabet: " + F.S);
console.log("State set: " + F.Q);
console.log("Initial state: " + F.q0);
console.log("Current state: " + F.q);
console.log("Currently accepts? " + F.A.includes(F.q))
console.log();

//Now let's run it on some string 123 and check state:
//Pre-computed by hand this should be 6
F.D("123");
console.log(F.q);
console.log("Accepted? " + F.A.includes(F.q));
console.log();

//Let's try 234 
//Pre-computed by hand this should be 1
F.q = F.q0; //reset F to initial state
F.D("234");
console.log(F.q);
console.log("Accepted? " + F.A.includes(F.q));
console.log()

//Let's try one it will actually accept:
F.q = F.q0; //reset F to initial state
F.D("345");
console.log(F.q);
console.log("Accepted? " + F.A.includes(F.q));

//Note, this recursion actually takes the string backwards. If F.q = 0, then F.D(123) will
//add 3 to 0, rather than 1. In this case it's commutative - F is effectively an implementation
//of the cyclic group in Z8.