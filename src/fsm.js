class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(arguments.length === 0){
            throw new Error();
        }

        this.initialState = config.initial
        this.currentState = config.initial;
        this.states = config.states;
        this.history = ['normal'];
        this.redoAvailable = false;
        this.undoLog = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {        
        return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(this.states[state] === undefined){
            throw new Error();
        }

        this.currentState = state;
        this.history.push(state);

        this.undoLog = [];
        this.redoAvailable = false;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        const newState = this.states[this.currentState].transitions[event];
        if(newState === undefined){
            throw new Error();
        }

        this.currentState = newState;
        this.history.push(newState);

        this.undoLog = [];
        this.redoAvailable = false;
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.currentState = this.initialState;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if(arguments.length === 0){
            return Object.keys(this.states);
        }

        let statesArray = [];

        for(let key in this.states){
            const state = this.states[key].transitions;

            for(let transition in state){
                if(transition === event){
                    statesArray.push(key);
                    break;
                }
            }
        }

        return statesArray
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this.history.length === 1){
            return false;
        }
        this.undoLog.unshift(this.currentState);
        this.currentState = this.history[this.history.length-2];
        this.history.splice(-1, 1);

        this.redoAvailable = true;
        return true
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {        
        if(this.redoAvailable){
            const newState = this.undoLog[0];
            this.currentState = newState;
            this.history.push(newState);
            this.undoLog.splice(0,1);
            this.redoAvailable = this.undoLog.length ===0?false:true;
            return true;
        }

        return this.redoAvailable;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = ['normal']
        this.currentState = 'normal'
        this.redoAvailable = false;
        this.undoLog = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
