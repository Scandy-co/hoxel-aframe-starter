AFRAME.registerState({
  initialState: {
    score: 0
  },

  handlers: {
    decreaseScore: function(state, action) {
      state.score -= action.points;
    },

    increaseScore: function(state, action) {
      state.score += action.points;
    }
  }
});
