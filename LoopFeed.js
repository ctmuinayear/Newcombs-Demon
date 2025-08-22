/*
Just for fun, since Langan seems to like self-reference, we're going to do a few things:
1) Extract F into a factory function.
2) Let two transducers observe each other.
3) Let one transducer observe itself.
*/

let getTransducer = function(){
    let M = {
        //Define some input alphabet:
        ///Keeping the numbers for simplicity but changing them to strings so we can concatenate them.
        S: ["0", "1", "2", "3", "4", "5", "6", "7"],
    
        //Define some state set Q
        Q: [0, 1, 2, 3, 4, 5, 6, 7],
    
        //define some subset of accepting states:
        A: [2, 3, 4, 5],
    
        //Extend T to match S for consistency:
        T: ["0", "1", "2", "3", "4", "5", "6", "7"],
    
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
                //Correcting this to return from output alphabet
                return this.T[this.q];
            }
    
            let newT = t.slice(1); //this is 't' from our discussion above
            let s = t[0]; //this is s from our discussion above. 
    
            //Stepping q. The definition requires it and for now I'm only allowing
            //return on those inputs which are accepted - possibly anticipating later 
            //development. But this means we can't run both D and M, since they would 
            //interfere.
            
            let newBeginning = this.mp(newT, this.q);
            let newEnd = this.m(s, q);
            let result = newBeginning + newEnd;
            
            return result;
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

    return M;
}

//Basic tests
//Nothing happens, trivial case with 0
let M1 = getTransducer();
console.log(M1.q);
let t = M1.M("1");
console.log(t);
console.log(M1.q);

//Try setting M1.q to 1
M1.q = 1;
t = M1.M("");
console.log("m1 output: " + t);
console.log("\n===================\n")

//Letting two transducers observe each other, both with state 0
M1.reset();
let M2 = getTransducer();
t = M2.M(M1.M(""));
console.log(t);

console.log("\n===================\n")

//let's do a loop:
//setting t to a null input
t = "";
M1.reset();
M2.reset();
for(let i = 0; i < 10; ++i){
    t = M2.M(M1.M(t));
    console.log("output so far: " + t);
}
console.log("\n===================\n")

//That wasn't very interesting. Let's change state
t = "";
M1.reset();
M1.q = 1;
M2.q = 3;
M2.reset();
for(let i = 0; i < 10; ++i){
    t = M2.M(M1.M(t));
    console.log("output so far: " + t);
}


console.log("\n===================\n")
//Time to feed one to itself
t = "";
M1.reset();
M1.q = 1;
for(let i = 0; i < 10; ++i){
    t = M1.M(t);
    console.log("output so far: " + t);
}