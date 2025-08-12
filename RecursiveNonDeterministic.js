/*
Langan moves on to handle the case that a non-deterministic automata is accepting arbitrary length string

This is done by adjusting our dn: S x Q -> Q to dnp: S x Q -> 2^Q

Our dnp is defined as follows:
1) Let t ⊂ S* and s ⊂ S
2) dnp(λ, q) = {q};
3) dnp(ts, q) = U(q' ⊂ dnp(t, q))(dn(s, q'))
---->That is the union of all our original non-deterministic outputs dn over the character s
---->for all q' from dnp(t, q). Another recursive definition.
4) Fn is then said to accept a string t iff dnp(t, q) ∩ A =/= {}.
---->Note, I think at this point Langan has a slight clerical error: he writes 
---->dnp(t, q) ∩ A = ~{}. I could be wrong but I think ~{} would generally equate to the universal
---->set, which seems like an odd choice. Makes more sense to just say the intersection is non-empty.
---->Of course, this is Langan we're talking about, so I suppose there could be some 42069 IQ galaxy
---->brain thought going on I simply cannot comprehend right now, but a minor error seems more likely.

Let's try it:
*/

let F = {
    //Define some input alphabet:
    ///Keeping the numbers for simplicity but changing them to strings so we can concatenate them.
    S: ["0", "1", "2", "3", "4", "5", "6", "7"],

    //Define some state set Q
    Q: [0, 1, 2, 3, 4, 5, 6, 7],

    //define some subset of accepting states:
    A: [3, 4, 5],

    //Define initial state and control state
    //Keeping both q0 and q initialized at 0 rather than []
    //This way they are both in a definite state at the beginning, non-deterministic only 
    //after non-deterministic processing.
    q0: 0,
    q: 0,

    //We'll keep dn and simply parametrize it for q:
    dn: function(s, q) {
        //if s is not in the input alphabet S we simply do nothing - s is outside the syntax of S
        if(!this.S.includes(s)){
            return [];
        }

        //if for some reason q is not in Q, we will just reset to q0
        if(!this.Q.includes(q)){
            q = this.q0;
        }
        
        //run the d defined above and get the result:
        let index = (+s + q) % this.Q.length + 1;

        //update state q:
        return this.Q.slice(0, index)
    },

    //Adding our dnp for non-deterministic recursive functionality
    dnp: function(t, q){
        if(t == ""){
            return [q];
        }
        let newT = t.slice(1); //this is 't' from our discussion above
        let s = t[0]; //this is s from our discussion above.

        //get all the q' to feed to dn
        let setQ = this.dnp(newT, q);

        //create new list for efficiency, no need to join every time.
        let appendum = [];
        for(let i = 0; i < setQ.length; i++){
            //Append the dn output to our list
            let newPossibility = this.dn(s, setQ[i]);
            appendum.push(newPossibility);
        }

        //Return set of possible Qs
        return [...new Set(setQ.concat(...appendum))];
    },

    //"External" dn, as before in the deterministic recursive case.
    D: function(t){
        this.q = this.dnp(t, this.q)
    },

    //Convenience function for our testing
    reset: function(){
        this.q = this.q0;
    }
}

//Let's print everything again for good measure:
console.log("input alphabet: " + F.S);
console.log("State set: " + F.Q);
console.log("Initial state: " + F.q0);
console.log("Current state: " + F.q);
console.log();

F.D("");
console.log(F.q);
console.log("Currently accepts? " + F.A.some(state => new Set(F.q).has(state)))
console.log();

F.reset();
F.D("111");
console.log(F.q);
console.log("Currently accepts? " + F.A.some(state => new Set(F.q).has(state)))
console.log();

F.reset();
F.D("765");
console.log(F.q);
console.log("Currently accepts? " + F.A.some(state => new Set(F.q).has(state)))
console.log();