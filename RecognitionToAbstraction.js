/*
Between the discussion on recursive deterministic acceptors and recursive non-deterministic acceptors,
Langan writes the following:

    "Thus, the accepting behavior of F is defined inductively for s-quantized string extensions; the way 
    in which we recognize and assimilate new bits of information within our reality is specified in dp. 
    Were we to widen the discussion to imagination, conceptualization, theorization, or other intrinsic
    computations, we would need to consider "ideas"; we would have to generalize from recognition to abstraction
    by means of a nonlocal or self-iterating, input-free extension of d."

I'm not sure where the nonlocal part of this comes in, my suspision would be that if a string 123 comes in, the
1, 2, and 3 are all seperate observations and some function within the acceptor needs to utilize 1, 2, and 3
all simultaneousl.

So let's try this in the following form:
-S as before
-Q fragmented into Q1 and Q2. Q1 representing recognition, Q2 representing abstraction
-d generalized to include d1 and d2. d1 operates on t ∈ S*, d2 operates on q ∈ Q1
-q0 as before but will include states in Q1 and Q2
-A will also be fragmented into A1 and A2. d2 will operate on all q1 accepted in Q1 and
    choose/abstract recognized thoughts in A1 to A2
-M -> We could add a "memory" to our acceptor, but this would still be a section of Q.
    so let's leave it our for now and pretend that it's simply encoded in our Q (Q1) "as
    is".

Let's try this (deterministically):
*/

//Here is our modified automata:
let F = {
    //Define some input alphabet:
    ///For simplicity, S will just be the real numbers
    //S = Real Numbers

    //For simplicity, Q will be a set of tuples
    //Q = (Real number, [-1, 0, 1])

    //Going to define A1 as a function which accepts input
    //if q > 4 or q < -4
    //This lets us define the subset of accepting state without an infinite list, lol.
    A1: function(){
        return this.q[0] > 4 || this.q[0] < -4;
    },
    
    //A2 is going to be a function accepting only +1 on the q2 state
    A2: function(){
        return this.q[1] == 1;
    },

    //Define initial state for control (q1, q2)
    q0: [0, 0],

    //Set current state to initial state
    q: [0, 0],

    //Going to build off our initial "for loop" version of the d function for intuition
    //and because we're using numbers - faster and easier for now.
    //This is not a very interesting one, lol
    d: function(s){

        //For now the main portion of our update function will simply add input to state
        //That is we will updated q1
        this.d1(s);

        //Next, if the input is accepted, we will both reason or "abstract" about it, and 
        //Reset state.
        if(this.A1()){
            //State that we accepted the input.
            console.log("Passed recognition test!")

            //In principle this could be a function that 'reasons' indefinitely about its
            //current state. Right now it performs only 1 iteration.
            this.d2();

            if(this.A2()){
                //if we also pass the 'abstraction' test, log that too.
                console.log("passed the abstraction test!");
            }

            //Log q before reset
            console.log("Final state: " + this.q);

            //reset state
            this.reset();
            console.log();
        }
    },

    d1: function(s){
        this.q[0] = this.q[0] + s;
    },

    d2: function(){
        if(this.q[0] > 4){
            this.q[1] = 1;
        }
    },


    //Defining reset function for convenience:
    reset: function(){
        //Remember pass by reference vs pass by value.
        this.q[0] = this.q0[0];
        this.q[1] = this.q0[1];
    },
}

//Let's print everything one more time for good measure
console.log("Initial state: " + F.q0);
console.log("Current state: " + F.q);
console.log("Currently accepts input: " + F.A1());
console.log("Currently accepts reasoning: " + F.A2());
console.log();

//Now we give it some input:
for(let i = 0; i < 100; i++){

    //Give an input from -1 to 1
    let input = Math.random() * 2 - 1;
    F.d(input);
    console.log("current state: " + F.q);
}
