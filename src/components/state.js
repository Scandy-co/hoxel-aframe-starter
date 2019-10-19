AFRAME.registerState({
  initialState: {
    score: 0,
    hoxelsLoaded: 0
  },

  handlers: {
    decreaseScore: function(state, action) {
      state.score -= action.points;
    },

    increaseScore: function(state, action) {
      state.score += action.points;
    },

    increaseHoxelsLoaded: function(state, action) {
      state.hoxelsLoaded += action.count;
      let hoxelsLoadedPercent = state.hoxelsLoaded / 5;
      document
        .querySelector("#loadingIndicatorTorus")
        .setAttribute("arc", hoxelsLoadedPercent * 360);
      if (state.hoxelsLoaded === 5) {
        document
          .querySelector("#loadingIndicator")
          .setAttribute("visible", false);
        document.querySelector("#gameScene").setAttribute("visible", true);
      }
    }
  }
});
